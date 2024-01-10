const { ModelAdoptClass } = require('../models/model_adopt');
const { readAnimalById, deleteAnimalByNgo } = require('./db_client_animals');
const { readRequestById } = require('./db_client_requests_adopt');
const { readNgoById } = require('./db_client_ngo_mongo');
const { 
    notificatorAcceptAdoptAdopter, 
    notificatorAcceptAdoptNgo, 
    notificatorRejectAdopt, 
    notificatorUndoAdopt
} = require('../notificators/notificator_adopt');

const {
    createAcceptanceByMistake,
    createDevolution,
    createMistreatment
} = require('../notificators/subjects_reasons');

async function acceptAdopt(ngoId, requestId) {
    try {

        const resultNgo = await readNgoById(ngoId);

        var ngo = resultNgo.msg;

        if(resultNgo == null) {
            console.log("ONG não encontrada.");
            return { statusCode: 404, msg: "ONG não encontrada."};
        }

        const request = await readRequestById(ngoId, requestId);

        if(request == null) {
            console.log("Requisição não encontrada.");
            return { statusCode: 404, msg: "Requisição não encontrada."};
        }

        const animal = await readAnimalById(ngoId, request.animalId);

        if(animal == null) {
            console.log("Animal não encontrado.");
            return { statusCode: 404, msg: "Animal não encontrado."};
        }

        const adopter = request.adopter;

        const dataToInsert = new ModelAdoptClass({ animal: animal, adopter: adopter });

        await ngo.adopts.push(dataToInsert);
        await ngo.save();

        ngo = await readNgoById(ngoId);
        var length = ngo.requestsAdopts.length;

        if(length > 0) {
            var index = 0;
            while(index < length) {
                if( 
                    ngo.requestsAdopts[index] 
                    && ngo.requestsAdopts[index].animalId 
                    && ngo.requestsAdopts[index].animalId.toString() 
                    === request.animalId.toString()
                ) {
                    if(adopter.cpf !== ngo.requestsAdopts[index].adopter.cpf) {
                        await notificatorRejectAdopt(ngoId, ngo.requestsAdopts[index]);
                    }
                    ngo.requestsAdopts.splice(index, 1);
                    await ngo.save();
                    index--;
                    length--;
                }
                index++;
            }
        }

        const result = await deleteAnimalByNgo(ngoId, request.animalId);

        if(result == null) {
            return { statusCode: 500, msg: "Erro ao mover animal para adoção." };
        }

        result = await ngo.save();

        if(result == null) {
            return { statusCode: 500, msg: "Erro ao aceitar adoção." };
        }

        await notificatorAcceptAdoptAdopter(ngoId, dataToInsert);
        await notificatorAcceptAdoptNgo(ngoId, dataToInsert);

        console.log('Documento inserido com sucesso:', result._id);
        return { statusCode: 200, msg: "Adoção aceita com sucesso."};
    } catch (error) {
        console.error('Erro:', error);
        return { statusCode: 500, msg: "Erro ao aceitar adoção."};
    }
}

async function undoAdopt(adoptId, ngoId, subjectNumber) {
    try {

        const resultNgo = await readNgoById(ngoId);

        var ngo = resultNgo.msg;

        if(resultNgo == null) {
            console.log("ONG não encontrada.");
            return { statusCode: 404, msg: "ONG não encontrada."};
        }

        const adopt = ngo.adopts.filter(adopt => adopt._id.toString() === adoptId);

        if(adopt == null) {
            console.log("Adoção não encontrada.");
            return { statusCode: 404, msg: "Adoção não encontrada."};
        }

        const animal = adopt[0].animal;

        const updatedAdopts = ngo.adopts.filter(adopt => adopt._id.toString() !== adoptId);

        ngo.animals.push(animal);

        var subjectReason;

        switch(subjectNumber) {
            case 1:
                subjectReason = createAcceptanceByMistake(animal.animalName);
                break;
            case 2:
                subjectReason = createDevolution(animal.animalName, ngo.ngoName);
                break;
            default: 
                subjectReason = createMistreatment(animal.animalName);
                break;
        }

        await notificatorUndoAdopt(ngo.ngoName, adopt[0], subjectReason);

        ngo.adopts = updatedAdopts;

        const result = await ngo.save();

        if(result == null) {
            return { statusCode: 500, msg: "Erro ao rejeitar adoções." };
        }

        console.log('Adoção desfeita com sucesso: ', result._id);

        return { statusCode: 200, msg: "Adoção desfeita com sucesso." };
    } catch (error) {
        console.error('Erro:', error);
        return { statusCode: 500, msg: "Erro ao desfazer adoção." };
    }
}

async function rejectAll(ngoId, animalId) {
    try {

        const resultNgo = await readNgoById(ngoId);

        var ngo = resultNgo.msg;

        if(resultNgo == null) {
            return { statusCode: 404, msg: "ONG não encontrada."};
        }

        const updatedRequests = ngo.requestsAdopts.filter(request => request.animalId !== animalId);

        const removedRequests = ngo.requestsAdopts.filter(request => request.animalId === animalId);

        console.log(removedRequests);

        ngo.requestsAdopts = updatedRequests;

        const result = await ngo.save();

        if(result == null) {
            return { statusCode: 500, msg: "Erro ao rejeitar adoções." };
        }

        console.log('Lista de adoções excluída com sucesso: ', result._id);
        return { statusCode: 200, msg: "Adoções rejeitadas com sucesso." };
    } catch (error) {
        console.error('Erro:', error);
        return { statusCode: 500, msg: "Erro ao rejeitar adoções."};
    }
}

module.exports = {
    acceptAdopt,
    undoAdopt,
    rejectAll
};
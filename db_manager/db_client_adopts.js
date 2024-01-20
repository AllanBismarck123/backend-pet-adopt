const { ModelNgoClass } = require('../models/model_ngo');
const { ModelAdoptClass } = require('../models/model_adopt');
const { deleteAnimalByNgo } = require('./db_client_animals');

const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.key' });

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

        var ngo = await ModelNgoClass.findById(ngoId).exec();

        if(ngo == null) {
            return { statusCode: 404, msg: "ONG não encontrada."};
        }

        var request = ngo.requestsAdopts.id(requestId);

        if(request == null) {
            return { statusCode: 404, msg: "Requisição não encontrada."};
        }

        var animal = ngo.animals.id(request.animalId);

        if(animal == null) {
            return { statusCode: 404, msg: "Animal não encontrado."};
        }

        const adopter = request.adopter;

        const dataToInsert = new ModelAdoptClass({ animal: animal, adopter: adopter });

        await ngo.adopts.push(dataToInsert);
        await ngo.save();

        ngo = await ModelNgoClass.findById(ngoId).exec();

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
                        var animal = ngo.animals.id(ngo.requestsAdopts[index].animalId);

                        await notificatorRejectAdopt(
                            ngo.ngoName, 
                            ngo.requestsAdopts[index].adopter.adopterName,
                            ngo.requestsAdopts[index].adopter.email,
                            animal.animalId
                        );
                    }
                    ngo.requestsAdopts.splice(index, 1);
                    await ngo.save();
                    index--;
                    length--;
                }
                index++;
            }
        }

        var result = await deleteAnimalByNgo(ngoId, request.animalId);

        if(result == null) {
            return { statusCode: 500, msg: "Erro ao mudar o animal de disponível para adotado." };
        }

        result = await ngo.save();

        if(result == null) {
            return { statusCode: 500, msg: "Erro ao aceitar adoção." };
        }

        await notificatorAcceptAdoptAdopter(
            ngo.ngoName, 
            dataToInsert.adopter.adopterName,
            dataToInsert.adopter.email,
            dataToInsert.animal.animalName
        );

        await notificatorAcceptAdoptNgo(
            ngo.ngoName,
            ngo.email, 
            dataToInsert.animal.animalName,
            dataToInsert.adopter.adopterName
        );

        return { statusCode: 200, msg: "Adoção aceita com sucesso."};
    } catch (error) {
        return { statusCode: 500, msg: "Erro ao aceitar adoção."};
    }
}

async function undoAdopt(adoptId, ngoId, subjectNumber) {
    try {

        var ngo = await ModelNgoClass.findById(ngoId).exec();

        if(ngo == null) {
            return { statusCode: 404, msg: "ONG não encontrada."};
        }

        const adopt = ngo.adopts.filter(adopt => adopt._id.toString() === adoptId);

        if(adopt == null) {
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

        await notificatorUndoAdopt(
            ngo.ngoName, 
            adopt[0].adopter.adopterName,
            adopt[0].adopter.email,
            adopt[0].animal.animalName,
            subjectReason
        );

        ngo.adopts = updatedAdopts;

        const result = await ngo.save();

        if(result == null) {
            return { statusCode: 500, msg: "Erro ao rejeitar adoções." };
        }

        return { statusCode: 200, msg: "Adoção desfeita com sucesso." };
    } catch (error) {
        return { statusCode: 500, msg: "Erro ao desfazer adoção." };
    }
}

async function rejectAll(ngoId, animalId) {
    try {

        var ngo = await ModelNgoClass.findById(ngoId).exec();

        if(ngo == null) {
            return { statusCode: 404, msg: "ONG não encontrada."};
        }

        const updatedRequests = ngo.requestsAdopts.filter(request => request.animalId !== animalId);

        const removedRequests = ngo.requestsAdopts.filter(request => request.animalId === animalId);

        removedRequests.forEach(async (element) => {
            var animal = ngo.animals.id(element.animalId);

            await notificatorRejectAdopt(
                ngo.ngoName, 
                element.adopter.adopterName,
                element.adopter.email,
                animal.animalName
            );
        });

        ngo.requestsAdopts = updatedRequests;

        const result = await ngo.save();

        if(result == null) {
            return { statusCode: 500, msg: "Erro ao rejeitar adoções." };
        }

        return { statusCode: 200, msg: "Adoções rejeitadas com sucesso." };
    } catch (error) {
        return { statusCode: 500, msg: "Erro ao rejeitar adoções."};
    }
}

module.exports = {
    acceptAdopt,
    undoAdopt,
    rejectAll
};
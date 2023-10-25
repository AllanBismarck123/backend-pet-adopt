const { ModelAdoptClass } = require('../models/model_adopt');
const { readAnimalById, deleteAnimalByNgo } = require('./db_client_animals');
const { readRequestById } = require('./db_client_requests_adopt');
const { readNgoById } = require('./db_client_ngo_mongo');
const { 
    notificatorAcceptAdoptAdopter, 
    notificatorAcceptAdoptNgo, 
    notificatorRejectAdopt 
} = require('../notificators/notificator_adopt');

async function acceptAdopt(ngoId, requestId) {
    try {

        var ngo = await readNgoById(ngoId);
        const request = await readRequestById(ngoId, requestId);
        const animal = await readAnimalById(ngoId, request.animalId);
        const tutor = request.tutor;

        const dataToInsert = new ModelAdoptClass({ animal: animal, tutor: tutor});

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
                    if(tutor.cpf !== ngo.requestsAdopts[index].tutor.cpf) {
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

        await deleteAnimalByNgo(ngoId, request.animalId);

        const result = await ngo.save();
        await notificatorAcceptAdoptAdopter(ngoId, dataToInsert);
        await notificatorAcceptAdoptNgo(ngoId, dataToInsert);

        console.log('Documento inserido com sucesso:', result._id);
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function undoAdopt(adoptId, ngoId) {
    try {

        var ngo = await readNgoById(ngoId);

        const adopt = ngo.adopts.filter(adopt => adopt._id.toString() === adoptId);
        const animal = adopt[0].animal;
        console.log(animal);

        const updatedAdopts = ngo.adopts.filter(adopt => adopt._id.toString() !== adoptId);

        ngo.animals.push(animal);

        ngo.adopts = updatedAdopts;

        const result = await ngo.save();

        console.log('Adoção desfeita com sucesso: ', result._id);
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function rejectAll(ngoId, animalId) {
    try {

        var ngo = await readNgoById(ngoId);

        const updatedRequests = ngo.requestsAdopts.filter(request => request.animalId !== animalId);

        ngo.requestsAdopts = updatedRequests;

        const result = await ngo.save();

        console.log('Lista de adoções excluída com sucesso: ', result._id);
    } catch (error) {
        console.error('Erro:', error);
    }
}

module.exports = {
    acceptAdopt,
    undoAdopt,
    rejectAll
};
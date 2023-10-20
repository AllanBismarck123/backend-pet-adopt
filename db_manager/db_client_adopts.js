const { ModelAdoptClass } = require('../models/model_adopt');
const { readAnimalById, deleteAnimalByUser } = require('./db_client_animals');
const { readRequestById, deleteRequestByUser } = require('./db_client_requests_adopt');
const { readUserById } = require('./db_client_user_mongo');
const { 
    notificatorAcceptAdoptUser, 
    notificatorAcceptAdoptNgo, 
    notificatorRejectAdopt 
} = require('../notificators/notificator_email');

async function acceptAdopt(userId, requestId) {
    try {

        var user = await readUserById(userId);
        const request = await readRequestById(userId, requestId);
        const animal = await readAnimalById(userId, request.animalId);
        const tutor = request.tutor;

        const dataToInsert = new ModelAdoptClass({ animal: animal, tutor: tutor});

        await user.adopts.push(dataToInsert);
        await user.save();

        user = await readUserById(userId);
        var length = user.requestsAdopts.length;

        if(length > 0) {
            var index = 0;
            while(index < length) {
                if( 
                    user.requestsAdopts[index] 
                    && user.requestsAdopts[index].animalId 
                    && user.requestsAdopts[index].animalId.toString() 
                    === request.animalId.toString()
                ) {
                    if(tutor.cpf !== user.requestsAdopts[index].tutor.cpf) {
                        await notificatorRejectAdopt(userId, user.requestsAdopts[index]);
                    }
                    user.requestsAdopts.splice(index, 1);
                    await user.save();
                    index--;
                    length--;
                }
                index++;
            }
        }

        await deleteAnimalByUser(userId, request.animalId);

        const result = await user.save();
        await notificatorAcceptAdoptUser(userId, dataToInsert);
        await notificatorAcceptAdoptNgo(userId, dataToInsert);

        console.log('Documento inserido com sucesso:', result._id);
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function rejectAll(userId, animalId) {
    try {

        var user = await readUserById(userId);

        const updatedRequests = user.requestsAdopts.filter(request => request.animalId !== animalId);

        user.requestsAdopts = updatedRequests;

        const result = await user.save();

        console.log('Lista de adoções excluída com sucesso: ', result._id);
    } catch (error) {
        console.error('Erro:', error);
    }
}

module.exports = {
    acceptAdopt,
    rejectAll
};
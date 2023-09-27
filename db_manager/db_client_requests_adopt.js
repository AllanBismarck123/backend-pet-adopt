const { ModelRequestAdoptClass } = require('../models/model_request_adopt');
const { readUserById } = require('./db_client_user_mongo');

async function saveRequestAdopt(tutor, animalId, ngoId) {
    try {
        const dataToInsert = new ModelRequestAdoptClass({ tutor: tutor, animalId: animalId });
        console.log(dataToInsert);
        var user = await readUserById(ngoId);

        user.requestsAdopts.push(dataToInsert);

        const result = await user.save();
        console.log('Documento inserido com sucesso:', result._id);
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function readRequestsAdopt(ngoId) {
    try {
        const user = await readUserById(ngoId);
        return user.requestsAdopts;
    } catch (error) {
        console.error('Erro:', error);
        return [];
    }
}

async function deleteRequestByUser(userId, requestId) {

    try {
        var user = await readUserById(userId);

        if (user != null && requestId != null) {
            var requestsAdopts = user.requestsAdopts;

            const index = requestsAdopts.findIndex((request) => request._id.toString() === requestId.toString());

            if (index >= 0) {
                user.requestsAdopts.splice(index, 1);
                await user.save();

                console.log("Requisição deletada com sucesso.");
                return "Requisição deletada com sucesso.";
            } else {
                console.log("Requisição não encontrado para deleção.");
                return "Requisição não encontrado para deleção.";
            }

        }
        console.log("Documento deletado com sucesso:", result);
    } catch (error) {
        console.error('Erro ao deletar a requisição:', error);
        return "Erro ao deletar requisição";
    }
}

module.exports = {
    saveRequestAdopt,
    readRequestsAdopt,
    deleteRequestByUser
};
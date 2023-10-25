const { ModelRequestAdoptClass } = require('../models/model_request_adopt');
const { readNgoById } = require('./db_client_ngo_mongo');

const { 
    notificatorRejectAdopt  
} = require('../notificators/notificator_adopt');

async function saveRequestAdopt(adopter, animalId, ngoId) {
    try {
        const dataToInsert = new ModelRequestAdoptClass({ adopter: adopter, animalId: animalId });
        var ngo = await readNgoById(ngoId);

        ngo.requestsAdopts.push(dataToInsert);

        const result = await ngo.save();
        console.log('Documento inserido com sucesso:', result._id);
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function readRequestsAdopt(ngoId) {
    try {
        const ngo = await readNgoById(ngoId);
        return ngo.requestsAdopts;
    } catch (error) {
        console.error('Erro:', error);
        return [];
    }
}

async function readRequestById(ngoId, requestId) {
    try {

        const ngo = await readNgoById(ngoId);

        if (ngo != null && requestId != null) {
            var requestsAdopts = ngo.requestsAdopts;
            const index = requestsAdopts.findIndex((request) => request._id.toString() === requestId.toString());

            return ngo.requestsAdopts[index];
        }

        return [];
    } catch (error) {
        console.error('Erro:', error);
        return [];
    }
}

async function deleteRequestByNgo(ngoId, requestId) {

    try {
        var ngo = await readNgoById(ngoId);

        if (ngo != null && requestId != null) {
            var requestsAdopts = ngo.requestsAdopts;

            const index = requestsAdopts.findIndex((request) => request._id.toString() === requestId.toString());

            if (index >= 0) {
                await notificatorRejectAdopt(ngoId, ngo.requestsAdopts[index]);
                
                ngo.requestsAdopts.splice(index, 1);
                await ngo.save();

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
    readRequestById,
    deleteRequestByNgo
};
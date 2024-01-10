const { ModelRequestAdoptClass } = require('../models/model_request_adopt');
const { readNgoById } = require('./db_client_ngo_mongo');

const { 
    notificatorRejectAdopt  
} = require('../notificators/notificator_adopt');

async function saveRequestAdopt(adopter, animalId, ngoId) {
    try {
        const dataToInsert = new ModelRequestAdoptClass({ adopter: adopter, animalId: animalId });
        const resultNgo = await readNgoById(ngoId);

        var ngo = resultNgo.msg;

        if(resultNgo == null) {
            console.log("ONG não encontrada.");
            return { statusCode: 404, msg: "ONG não encontrada."};
        }

        ngo.requestsAdopts.push(dataToInsert);

        const result = await ngo.save();

        if(result == null) {
            return { statusCode: 500, msg: "Erro ao aceitar adoção." };
        }

        console.log('Documento inserido com sucesso:', result._id);
        return { statusCode: 200, msg: "Requisição criada com sucesso." };
    } catch (error) {
        console.error('Erro:', error);
        return { statusCode: 500, msg: "Erro ao aceitar adoção." };
    }
}

async function readRequestsAdopt(ngoId) {
    try {
        const resultNgo = await readNgoById(ngoId);

        const ngo = resultNgo.msg;

        if(resultNgo == null) {
            console.log("ONG não encontrada.");
            return { statusCode: 404, msg: "ONG não encontrada." };
        }

        return { statusCode: 200, msg: ngo.requestsAdopts };
    } catch (error) {
        console.error('Erro:', error);
        return { statusCode: 500, msg: "Erro ao buscar requisições de adoção." };
    }
}

async function readRequestById(ngoId, requestId) {
    try {

        const resultNgo = await readNgoById(ngoId);

        const ngo = resultNgo.msg;

        if(resultNgo == null) {
            console.log("ONG não encontrada.");
            return { statusCode: 404, msg: "ONG não encontrada." };
        }

        if (ngo != null && requestId != null) {
            var requestsAdopts = ngo.requestsAdopts;
            const index = requestsAdopts.findIndex((request) => request._id.toString() === requestId.toString());

            if(index >= 0 && index < requestsAdopts.length) {
                return { statusCode: 200, msg: ngo.requestsAdopts[index] };
            } else {
                return { statusCode: 404, msg: "Requisição não encontrada." }; 
            }
        }

        return { statusCode: 500, msg: "Erro ao buscar requisição." }; 
    } catch (error) {
        console.error('Erro:', error);
        return { statusCode: 500, msg: "Erro ao buscar requisição." }; 
    }
}

async function deleteRequestByAdopter(ngoId, requestId) {

    try {
        const resultNgo = await readNgoById(ngoId);

        var ngo = resultNgo.msg;

        if(resultNgo == null) {
            console.log("ONG não encontrada.");
            return { statusCode: 404, msg: "ONG não encontrada." };
        }

        if (ngo != null && requestId != null) {
            var requestsAdopts = ngo.requestsAdopts;

            const index = requestsAdopts.findIndex((request) => request._id.toString() === requestId.toString());

            if (index >= 0 && index < requestsAdopts.length) {
                ngo.requestsAdopts.splice(index, 1);
                const result = await ngo.save();

                if(result == null) {
                    return { statusCode: 500, msg: "Erro ao deletar requisição." };
                }
                
                await notificatorRejectAdopt(ngoId, ngo.requestsAdopts[index]);

                console.log("Requisição deletada com sucesso.");
                return { statusCode: 200, msg: "Requisição deletada com sucesso."};
            } else {
                console.log("Requisição não encontrado para deleção.");
                return { statusCode: 404, msg: "Requisição não encontrada para deleção."};
            }
        }

        console.log("Documento deletado com sucesso:", result);
        return { statusCode: 500, msg: "Erro ao deletar requisição." };
    } catch (error) {
        console.error('Erro ao deletar a requisição:', error);
        return { statusCode: 500, msg: "Erro ao deletar requisição." };
    }
}

module.exports = {
    saveRequestAdopt,
    readRequestsAdopt,
    readRequestById,
    deleteRequestByAdopter
};
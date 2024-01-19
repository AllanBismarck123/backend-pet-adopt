const { ModelRequestAdoptClass } = require('../models/model_request_adopt');
const { ModelNgoClass } = require('../models/model_ngo');

const { 
    notificatorRejectAdopt  
} = require('../notificators/notificator_adopt');

async function saveRequestAdopt(adopter, animalId, ngoId) {
    try {
        const dataToInsert = new ModelRequestAdoptClass({ adopter: adopter, animalId: animalId });
        var ngo = await ModelNgoClass.findById(ngoId).exec();

        if(ngo == null) {
            return { statusCode: 404, msg: "ONG não encontrada."};
        }

        ngo.requestsAdopts.push(dataToInsert);

        const result = await ngo.save();

        if(result == null) {
            return { statusCode: 500, msg: "Erro ao criar requisição de adoção." };
        }

        return { statusCode: 200, msg: "Requisição criada com sucesso." };
    } catch (error) {
        console.log(error);
        return { statusCode: 500, msg: "Erro ao criar requisição de adoção." };
    }
}

async function readRequestsAdopt(ngoId) {
    try {
        var ngo = await ModelNgoClass.findById(ngoId).exec();

        if(ngo == null) {
            return { statusCode: 404, msg: "ONG não encontrada." };
        }

        return { statusCode: 200, msg: ngo.requestsAdopts };
    } catch (error) {
        return { statusCode: 500, msg: "Erro ao buscar requisições de adoção." };
    }
}

async function readRequestById(ngoId, requestId) {
    try {

        const ngo = await ModelNgoClass.findById(ngoId).exec();

        if(ngo == null) {
            return { statusCode: 404, msg: "ONG não encontrada." };
        }

        if (requestId != null) {
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
        return { statusCode: 500, msg: "Erro ao buscar requisição." }; 
    }
}

async function deleteRequestByAdopter(ngoId, requestId) {

    try {
        var ngo = await ModelNgoClass.findById(ngoId).exec();

        if(ngo == null) {
            return { statusCode: 404, msg: "ONG não encontrada." };
        }

        if (requestId != null) {
            var requestsAdopts = ngo.requestsAdopts;
            
            const index = requestsAdopts.findIndex((request) => request._id.toString() === requestId.toString());

            if (index >= 0 && index < requestsAdopts.length) {
                var animal = await ngo.animals.id(requestsAdopts[index].animalId);
                var request = requestsAdopts[index];

                ngo.requestsAdopts.splice(index, 1);
                const result = await ngo.save();

                if(result == null) {
                    return { statusCode: 500, msg: "Erro ao deletar requisição." };
                }
                
                await notificatorRejectAdopt(
                    ngo.ngoName, 
                    request.adopter.adopterName,
                    request.adopter.email,
                    animal.animalName
                );

                return { statusCode: 200, msg: "Requisição deletada com sucesso."};
            } else {
                return { statusCode: 404, msg: "Requisição não encontrada para deleção."};
            }
        }

        return { statusCode: 500, msg: "Erro ao deletar requisição." };
    } catch (error) {
        console.log(error);
        return { statusCode: 500, msg: "Erro ao deletar requisição." };
    }
}

module.exports = {
    saveRequestAdopt,
    readRequestsAdopt,
    readRequestById,
    deleteRequestByAdopter
};
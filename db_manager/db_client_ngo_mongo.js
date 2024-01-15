const mongoose = require('mongoose');
const { ModelNgoClass } = require('../models/model_ngo');
const { ObjectId } = require('mongodb');

mongoose.connect(process.env.MONGO_DB_URI,
 { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conexão com o MongoDB estabelecida'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

const { 
    notificatorWelcomeNgo, 
    notificatorEditNgo, 
    notificatorDeleteNgo 
} = require('../notificators/notificator_ngo');

async function saveNgo(data) {
    const dataToInsert = new ModelNgoClass(data);
    try {
        await ModelNgoClass.createCollection();
        
        const result = await dataToInsert.save();
        await notificatorWelcomeNgo(dataToInsert.ngoName, dataToInsert.email);

        if(result) {
            return { statusCode: 201, msg: "ONG cadastrada com sucesso." };
        } else {
            return { statusCode: 500, msg: "Erro ao cadastrar ONG." };
        }
    } catch (error) {
        console.error('Error:', error);
        return { statusCode: 500, msg: "Erro ao cadastrar ONG." };
    }
}

async function readNgo() {
    try {
        const data = await ModelNgoClass.find().exec();

        return { statusCode: 200, msg: data };
    } catch (error) {
        console.error('Erro:', error);
        return { statusCode: 500, msg: "Erro ao buscar ONGs." };
    }
}

async function readNgoById(ngoId) {
    try {
        const ngo = await ModelNgoClass.findById(ngoId).exec();

        if(!ngo) {
            return { statusCode: 404, msg: "ONG não encontrada."};
        }

        return { statusCode: 200, msg: ngo };
    } catch (error) {
        console.error('Erro:', error);
        return { statusCode: 500, msg: "Erro ao buscar ONG."};
    }
}

async function updateNgoById(ngoId, newNgoName, newEmail) {
    try {
        const resultNgo = await readNgoById(ngoId);

        var ngo = resultNgo.msg;

        if(resultNgo == null) {
            return { statusCode: 404, msg: "ONG não encontrada."};
        } else {
            ngo.ngoName = newNgoName == null ? ngo.ngoName : newNgoName;
            ngo.email = newEmail == null ? ngo.email : newEmail;

            const result = await ngo.save();

            if(result == null) {
                return { statusCode: 500, msg: "Erro ao atualizar ONG."};
            }

            await notificatorEditNgo(ngo.ngoName, ngo.email);

            console.log("ONG atualizada com sucesso.");
            return { statusCode: 200, msg: "ONG atualizada com sucesso." };
        }
    } catch(error) {
        console.log("Erro ao atualizar a ONG", error);
        return { statusCode: 500, msg: "Erro ao atualizar ONG."};
    }
}

async function deleteNgoById(ngoId) {
    try {
        var ngoObjId = new ObjectId(ngoId);

        const resultNgo = await readNgoById(ngoId);

        var ngo = resultNgo.msg;

        if(resultNgo == null) {
            return { statusCode: 404, msg: "ONG não encontrada."};
        }

        const result = await ModelNgoClass.deleteOne(ngoObjId);
        if(!result) {
            return { statusCode: 500, msg: "Erro ao deletar ONG."};
        }

        await notificatorDeleteNgo(ngo.ngoName, ngo.email);

        if(result.deletedCount > 0) {
            console.log("ONG deletada com sucesso:", result);
            return { statusCode: 200, msg: "ONG deletada com sucesso."};
        } else {
            console.error('Erro ao deletar o documento:', error);
            return { statusCode: 500, msg: "Erro ao deletar ONG."};
        }   
    } catch (error) {
        console.error('Erro ao deletar o documento:', error);
        return { statusCode: 500, msg: "Erro ao deletar ONG."};
    }
}

module.exports = {
    saveNgo,
    readNgo,
    readNgoById,
    updateNgoById,
    deleteNgoById
};
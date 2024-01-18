const mongoose = require('mongoose');
const { ModelNgoClass } = require('../models/model_ngo');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.key' });

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

        dataToInsert.password = await bcrypt.hash(dataToInsert.password, 10);
        
        const result = await dataToInsert.save();

        const token = jwt.sign({ _id: dataToInsert._id.toString() }, process.env.JWT_SECRET);

        dataToInsert.tokens = dataToInsert.tokens.concat({ token });

        await dataToInsert.save();

        await notificatorWelcomeNgo(dataToInsert.ngoName, dataToInsert.email);

        if(result) {
            return { statusCode: 201, msg: "ONG cadastrada com sucesso." };
        } else {
            return { statusCode: 500, msg: "Erro ao cadastrar ONG." };
        }
    } catch (error) {
        return { statusCode: 500, msg: "Erro ao cadastrar ONG. Detalhes: " + error.message };
    }
}

async function readNgo() {
    try {
        const data = await ModelNgoClass.find({}, '_id ngoName email animals adopts requestsAdopts').exec();

        return { statusCode: 200, msg: data };
    } catch (error) {
        console.error('Erro:', error);
        return { statusCode: 500, msg: "Erro ao buscar ONGs." };
    }
}

async function readNgoById(ngoId, req) {
    try {

        const ngo = await ModelNgoClass.findById(ngoId, '_id ngoName email animals adopts requestsAdopts').exec();

        if(!ngo) {
            return { statusCode: 404, msg: "ONG não encontrada." };
        }

        return { statusCode: 200, msg: ngo };
    } catch (error) {
        console.error('Erro:', error);
        return { statusCode: 500, msg: "Erro ao buscar ONG." };
    }
}

async function updateNgoById(ngoId, newNgoName, newEmail) {
    try {
        var ngo = await ModelNgoClass.findById(ngoId).exec();

        if(ngo == null) {
            return { statusCode: 404, msg: "ONG não encontrada." };
        } else {
            ngo.ngoName = newNgoName == null ? ngo.ngoName : newNgoName;
            ngo.email = newEmail == null ? ngo.email : newEmail;

            const result = await ngo.save();

            if(result == null) {
                return { statusCode: 500, msg: "Erro ao atualizar ONG." };
            }

            await notificatorEditNgo(ngo.ngoName, ngo.email);

            return { statusCode: 200, msg: "ONG atualizada com sucesso." };
        }
    } catch(error) {
        return { statusCode: 500, msg: "Erro ao atualizar ONG." };
    }
}

async function deleteNgoById(ngoId) {
    try {
        var ngoObjId = new ObjectId(ngoId);

        var ngo = await ModelNgoClass.findById(ngoId).exec();

        if(ngo == null) {
            return { statusCode: 404, msg: "ONG não encontrada." };
        }

        const result = await ModelNgoClass.deleteOne(ngoObjId);
        
        if(!result) {
            return { statusCode: 500, msg: "Erro ao deletar ONG." };
        }

        await notificatorDeleteNgo(ngo.ngoName, ngo.email);

        if(result.deletedCount > 0) {
            return { statusCode: 200, msg: "ONG deletada com sucesso." };
        } else {
            return { statusCode: 500, msg: "Erro ao deletar ONG." };
        }   
    } catch (error) {
        return { statusCode: 500, msg: "Erro ao deletar ONG." };
    }
}

module.exports = {
    saveNgo,
    readNgo,
    readNgoById,
    updateNgoById,
    deleteNgoById
};
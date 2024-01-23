const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const { readNgoById } = require('../db_manager/db_client_ngo_mongo');

const {
    saveRequestAdopt,
    readRequestsAdopt,
    readRequestById,
    deleteRequestByAdopter
} = require('../db_manager/db_client_requests_adopt');

const {
    notificatorSendRequestAdopter,
    notificatorSendRequestNgo
} = require('../notificators/notificator_request');

const { ModelRequestAdoptClass } = require('../models/model_request_adopt');

router.post('/create-request', async (req, res) => {

    const {
        ngoId,
        animalId,
        urlImageAdopter,
        adopterName,
        cpf,
        rg,
        age,
        road,
        numberHouse,
        neighborhood,
        city,
        state,
        telephone,
        email
    } = req.body;

    const adopter = {
        urlImageAdopter: urlImageAdopter,
        adopterName: adopterName,
        cpf: cpf,
        rg: rg,
        age: age,
        road: road,
        numberHouse: numberHouse,
        neighborhood: neighborhood,
        city: city,
        state: state,
        telephone: telephone,
        email: email
    }

    if (!mongoose.Types.ObjectId.isValid(ngoId) || !mongoose.Types.ObjectId.isValid(animalId)) {
        return res.status(400).json({ error: 'ID da ONG ou do animal inválido.' });
    }

    try {
        var requests = await readRequestsAdopt(ngoId);

        requests = requests.msg;

        const existingRequest = requests.find((element) => element.adopter.cpf === adopter.cpf && element.animalId === animalId);
        
        if (existingRequest) {
            return res.status(400).json({ message: 'Você já fez uma solicitação de adoção para esse animal, aguarde o andamento do processo de adoção.' });
        }

        const result = await saveRequestAdopt(adopter, animalId, ngoId);

        const request = new ModelRequestAdoptClass({ adopter: adopter, animalId: animalId });
        
        if(result.statusCode == 200) {
            var ngo = await readNgoById(ngoId);
            ngo = ngo.msg;

            var animal = ngo.animals.id(request.animalId);

            await notificatorSendRequestAdopter(
                ngo.ngoName,
                request.adopter.adopterName,
                request.adopter.email, 
                animal.animalId
            );

            await notificatorSendRequestNgo(
                ngo.ngoName,
                ngo.email,
                request.adopter.adopterName, 
                animal.animalId
            );
        }

        res.status(result.statusCode).json({ message: result.msg });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao realizar requisição de adoção.' });
    }
});

router.get('/all-requests', async (req, res) => {
    var ngoId;

    if (req.body) {
        ngoId = req.body.ngoId;
    }

    if (!mongoose.Types.ObjectId.isValid(ngoId)) {
        return res.status(400).json({ error: 'ID da ONG inválido.' });
    }

    try {
        const result = await readRequestsAdopt(ngoId);
        res.status(result.statusCode).json(result.msg);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao ler requisições de adoção.' });
    }
});

router.get('/read-request', async (req, res) => {
    var ngoId;
    var requestId;

    if (req.body) {
        ngoId = req.body.ngoId;
        requestId = req.body.requestId
    }

    if (!mongoose.Types.ObjectId.isValid(ngoId) || !mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({ error: 'ID da ONG ou da requisição inválido.' });
    }

    try {
        const result = await readRequestById(ngoId, requestId);
        res.status(result.statusCode).json(result.msg);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao ler requisição.' });
    }
});

router.delete('/delete-request', async (req, res) => {
    var ngoId;
    var requestId;

    if (req.body) {
        ngoId = req.body.ngoId;
        requestId = req.body.requestId;
    }

    if (!mongoose.Types.ObjectId.isValid(ngoId) || !mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({ error: 'ID da ONG ou da requisição inválido.' });
    }

    try {
        var result = await deleteRequestByAdopter(ngoId, requestId);
        res.status(result.statusCode).json({ message: result.msg });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar requisição.' });
    }
});

module.exports = router;
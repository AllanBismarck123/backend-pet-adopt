const express = require('express');
const router = express.Router();

const { acceptAdopt, rejectAll, undoAdopt } = require('../db_manager/db_client_adopts');

const mongoose = require('mongoose');

router.post('/accept-adopt', async (req, res) => {
    var ngoId;
    var requestId;

    if(req.body) {
        ngoId = req.body.ngoId;
        requestId = req.body.requestId;
    }

    if (!mongoose.Types.ObjectId.isValid(ngoId) || !mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({ error: 'ID da ONG ou da requisição inválido.' });
    }

    try {
        const result = await acceptAdopt(ngoId, requestId);
        
        res.status(result.statusCode).json({ msg: result.msg});
    } catch (error) {
        res.status(500).json({ error: 'Erro ao aceitar adoção.' });
    }
});

router.post('/undo-adopt', async (req, res) => {
    var ngoId;
    var adoptId;
    var subjectNumber;

    if(req.body) {
        ngoId = req.body.ngoId;
        adoptId = req.body.adoptId;
        subjectNumber = req.body.subjectNumber;
    }

    if (!mongoose.Types.ObjectId.isValid(ngoId) || !mongoose.Types.ObjectId.isValid(adoptId)) {
        return res.status(400).json({ error: 'ID da ONG ou da adoção inválido.' });
    }

    try {
        const result = await undoAdopt(adoptId, ngoId, subjectNumber);

        res.status(result.statusCode).json({ message: result.msg });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao desfazer adoção.' });
    }
});

router.post('/reject-all-requests', async (req, res) => {
    var ngoId;
    var animalId;

    if(req.body) {
        ngoId = req.body.ngoId;
        animalId = req.body.animalId;
    }

    if (!mongoose.Types.ObjectId.isValid(ngoId) || !mongoose.Types.ObjectId.isValid(animalId)) {
        return res.status(400).json({ error: 'ID da ONG ou do animal inválido.' });
    }

    try {
        const result = await rejectAll(ngoId, animalId);
        res.status(result.statusCode).json({ message: result.msg });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao rejeitar adoções.' });
    }
});

module.exports = router;
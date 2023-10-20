const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const { acceptAdopt, rejectAll, deleteAdopt } = require('../db_manager/db_client_adopts');

router.post('/accept-adopt', async (req, res) => {
    var userId;
    var requestId;

    if(req.body) {
        userId = req.body.userId;
        requestId = req.body.requestId;
    }

    try {
        await acceptAdopt(userId, requestId);
        res.status(200).json({ message: 'Adoção aceita com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao aceitar adoção.' });
    }
});

router.post('/delete-adopt', async (req, res) => {
    var ngoId;
    var adoptId;

    if(req.body) {
        ngoId = req.body.ngoId;
        adoptId = req.body.adoptId;
    }

    try {
        await deleteAdopt(adoptId, ngoId);
        res.status(200).json({ message: 'Adoção deletada com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar adoção.' });
    }
});

router.post('/reject-all-adopts', async (req, res) => {
    var userId;
    var animalId;

    if(req.body) {
        userId = req.body.userId;
        animalId = req.body.animalId;
    }

    try {
        await rejectAll(userId, animalId);
        res.status(200).json({ message: 'Solicitações de adoção deletadas com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar adoções.' });
    }
});

module.exports = router;
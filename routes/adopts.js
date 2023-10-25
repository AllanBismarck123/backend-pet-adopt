const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const { acceptAdopt, rejectAll, undoAdopt } = require('../db_manager/db_client_adopts');

router.post('/accept-adopt', async (req, res) => {
    var ngoId;
    var requestId;

    if(req.body) {
        ngoId = req.body.ngoId;
        requestId = req.body.requestId;
    }

    try {
        const result = await acceptAdopt(ngoId, requestId);
        if(result) {
            res.status(200).json({ message: 'Adoção aceita com sucesso.' });
        } else {
            res.status(404).json({ message: 'Requisição não encontrada.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao aceitar adoção.' });
    }
});

router.post('/undo-adopt', async (req, res) => {
    var ngoId;
    var adoptId;

    if(req.body) {
        ngoId = req.body.ngoId;
        adoptId = req.body.adoptId;
    }

    try {
        await undoAdopt(adoptId, ngoId);
        res.status(200).json({ message: 'Adoção desfeita com sucesso.' });
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

    try {
        await rejectAll(ngoId, animalId);
        res.status(200).json({ message: 'Solicitações de adoção deletadas com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar adoções.' });
    }
});

module.exports = router;
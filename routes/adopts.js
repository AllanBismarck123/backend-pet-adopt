const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const { acceptAdopt, rejectAll } = require('../db_manager/db_client_adopts');

router.post('/accept-adopt', async (req, res) => {
    const userId = req.body.userId;
    const requestId = req.body.requestId;

    try {
        await acceptAdopt(userId, requestId);

        res.status(200).json({ message: 'Adoção aceita com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao aceitar adoção.' });
    }
});

router.post('/reject-all-adopts', async (req, res) => {
    const userId = req.body.userId;
    const animalId = req.body.animalId;

    try {
        await rejectAll(userId, animalId);
        res.status(200).json({ message: 'Solicitações de adoção deletadas com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar adoções.' });
    }
});

module.exports = router;
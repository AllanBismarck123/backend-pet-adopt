const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const { acceptAdopt } = require('../db_manager/db_client_adopts');

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

module.exports = router;
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const UserModel = require('../models/userModel'); // Substitua pelo modelo real do seu usuário

// Rota para fazer login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verifique se o usuário existe no banco de dados
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        // Verifique se a senha está correta
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        // Gere um token JWT
        const token = jwt.sign({ userId: user._id }, 'suaChaveSecreta', { expiresIn: '1h' });

        // Envie o token como resposta (você pode optar por usar cookies, local storage, etc.)
        res.json({ token });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro no login.' });
    }
});

// Rota para fazer logout
router.post('/logout', async (req, res) => {
    try {
        // Remova o token do cliente (por exemplo, limpando os cookies ou local storage)
        // Aqui, estou usando cookies como exemplo
        res.clearCookie('token');

        res.status(200).json({ message: 'Logout bem-sucedido.' });
    } catch (error) {
        console.error('Erro no logout:', error);
        res.status(500).json({ error: 'Erro no logout.' });
    }
});

module.exports = router;

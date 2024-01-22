const express = require('express');
const router = express.Router();
const { login, logout } = require('../auth/login_logout');

router.post('/login', async (req, res) => {

    var email;
    var password;

    if(req.body) {
        email = req.body.email;
        password = req.body.password;
    }


    try {
        const result = await login(email, password);

        if(result == null) {
            return res.status(500).json({ message: 'Erro ao fazer login.'})
        }

        return res.status(result.statusCode).json({ message: result.msg });

    } catch (error) {
        return res.status(500).json({ error: 'Erro a fazer login.' });
    }
});

router.post('/logout', async (req, res) => {
    var authToken;

    if(req.header) {
        authToken = req.header('Authorization');
    }

    try {
        const result = await logout(res, authToken);

        if(result == null) {
            return res.status(500).json({ message: 'Erro ao fazer logout.' });
        }

        return res.status(200).json({ message: 'Logout bem-sucedido.' });
    } catch (error) {
        console.error('Erro no logout:', error);
        return res.status(500).json({ error: 'Erro ao fazer logout.' });
    }
});

module.exports = router;

const cors = require('cors');
const express = require('express');
const ngo = require('./routes/ngo');

try {
    require('dotenv').config({ path: '.env.cred' });
} catch (error) {
    console.error('Erro ao carregar variáveis de ambiente:', error);
}

const { sendEmails } = require('./notificators/notificator_email');

const app = express();

app.use(cors());

app.use(express.json());

const hostname = '0.0.0.0';
const port = 4000;

// app.use('/ngo', ngo);

app.get('/test', async (req, res) => {
    console.log(process.env.EMAIL_USER);
    console.log(process.env.PASSWORD);
    try {
        await sendEmails();
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

app.listen(port, hostname);
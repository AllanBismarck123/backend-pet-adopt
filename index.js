const cors = require('cors');
const express = require('express');
const ngo = require('./routes/ngo');

const app = express();

app.use(cors());

app.use(express.json());

const hostname = '0.0.0.0';
const port = 4000;

app.use('/ngo', ngo);

//Falta criar rota de deletar adoção

app.listen(port, hostname);
const cors = require('cors');
const express = require('express');
const ngo = require('./routes/ngo');

const undo_adopt_test = require('./unit_tests/notificator_adopt_test');

const app = express();

app.use(cors());

app.use(express.json());

const hostname = '0.0.0.0';
const port = 4000;

app.use('/ngo', ngo);

app.use('/adopt_test', undo_adopt_test);

app.listen(port, hostname);
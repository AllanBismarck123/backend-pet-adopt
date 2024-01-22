const express = require('express');
const router = express.Router();

const animals = require('./animals');
const requests_adopts = require('./requests_adopts');
const adopts = require('./adopts');
const auth = require('./login_logout');

const mongoose = require('mongoose');

const {
  saveNgo,
  readNgo,
  readNgoById,
  updateNgoById,
  deleteNgoById,
  teste
} = require('../db_manager/db_client_ngo_mongo');

const ngo = {
  ngoName: "ONG",
  email: "allan_b95@outlook.com",
  password: "123456",
  animals: [],
  adopts: [],
  requestAdopts: [],
  tokens: []
}

router.post('/create-ngo', async (req, res) => {
  try {
    const result = await saveNgo(ngo);
    res.status(result.statusCode).json({ message: result.msg });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar conta da ONG.' });
  }
});

router.get('/ngos', async (req, res) => {
  try {
    const result = await readNgo();
    res.status(result.statusCode).json(result.msg);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ONGs.' });
  }
});

router.get('/ngo', async (req, res) => {

  var ngoId;

  if(req.body) {
    ngoId = req.body.ngoId;
  }

  if (!mongoose.Types.ObjectId.isValid(ngoId)) {
    return res.status(400).json({ error: 'ID de usuário inválido.' });
  }

  try {
    const result = await readNgoById(ngoId);

    res.status(result.statusCode).json(result.msg);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ONG.' });
  }
});

router.get('/read-ngo', async (req, res) => {

  var ngoId;

  if(req.body) {
    ngoId = req.body.ngoId;
  }

  if (!mongoose.Types.ObjectId.isValid(ngoId)) {
    return res.status(400).json({ error: 'ID de usuário inválido.' });
  }

  try {
    const result = await teste(ngoId);

    res.status(result.statusCode).json(result.msg);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ONG.' });
  }
});

router.put('/update-ngo', async (req, res) => {

  var ngoId;
  var newNgoName;
  var newEmail;

  var authToken;

  if (req.body) {
    ngoId = req.body.ngoId;
    newNgoName = req.body.newNgoName;
    newEmail = req.body.newEmail;

    if (!mongoose.Types.ObjectId.isValid(ngoId)) {
      return res.status(400).json({ error: 'ID da ONG inválido.' });
    }

    if (newNgoName == null && newEmail == null) {
      return res.status(400).json({ error: 'Novos dados são obrigatórios.' });
    }

  }

  if(req.header) {
    authToken = req.header('Authorization');
  }

  try {
    const result = await updateNgoById(ngoId, newNgoName, newEmail, authToken);
    res.status(result.statusCode).json({ message: result.msg });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar a conta da ONG.' });
  }

});

router.delete('/delete-ngo', async (req, res) => {
  var ngoId;
  var authToken;

  if(req.body) {
    ngoId = req.body.ngoId;
  }

  if(req.header) {
    authToken = req.header('Authorization');
  }

  if (!mongoose.Types.ObjectId.isValid(ngoId)) {
    return res.status(400).json({ error: 'ID da ONG inválido.' });
  }

  try {
    const result = await deleteNgoById(ngoId,authToken);

    if(result == null) {
      res.status(500).json({ error: 'Erro ao deletar conta da ONG.' });
    } else {      
        res.status(result.statusCode).json({ message: result.msg });
    }

  } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar conta da ONG.' });
  }
});

router.use('/animals', animals);
router.use('/requests', requests_adopts);
router.use('/adopts', adopts);
router.use('/auth', auth);

module.exports = router;
const express = require('express');
const router = express.Router();

const animals = require('./animals');
const requests_adopts = require('./requests_adopts');
const adopts = require('./adopts');

const mongoose = require('mongoose');

const {
  saveNgo,
  readNgo,
  readNgoById,
  updateNgoById,
  deleteNgoById
} = require('../db_manager/db_client_ngo_mongo');

const ngo = {
  ngoName: "ONG",
  email: "allan_b95@outlook.com",
  animals: [],
  adopts: []
}

router.post('/create-ngo', async (req, res) => {
  try {
    await saveNgo(ngo);
    res.status(200).json({ message: 'Conta da ONG criada com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar conta da ONG.' });
  }
});

router.get('/ngos', async (req, res) => {
  try {
    const data = await readNgo();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler dados.' });
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
    const ngo = await readNgoById(ngoId);
    if (!ngo) {
      return res.status(404).json({ error: 'ONG não encontrada.' });
    }
    res.status(200).json(ngo);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ONG.' });
  }
});

router.put('/update-ngo', async (req, res) => {

  var ngoId;
  var newNgoName;
  var newEmail;

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

  try {
    await updateNgoById(ngoId, newNgoName, newEmail);
    res.status(200).json({ message: 'Conta da ONG atualizada com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar a conta da ONG.' });
  }

});

router.delete('/delete-ngo', async (req, res) => {
  var ngoId;

  if(req.body) {
    ngoId = req.body.ngoId;
  }

  if (!mongoose.Types.ObjectId.isValid(ngoId)) {
    return res.status(400).json({ error: 'ID de documento inválido.' });
  }

  try {
    var result = await deleteNgoById(ngoId);
    if(result == false) {
      res.status(404).json({ error: 'ONG não encontrada.' });
    } else {
      res.json({ message: 'Conta da ONG deletada com sucesso.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar conta da ONG.' });
  }
});

router.use('/animals', animals);
router.use('/requests', requests_adopts);
router.use('/adopts', adopts);

module.exports = router;
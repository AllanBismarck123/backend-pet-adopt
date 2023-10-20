const express = require('express');
const router = express.Router();

const animals = require('./animals');
const requests_adopts = require('./requests_adopts');
const adopts = require('./adopts');

const mongoose = require('mongoose');

const {
  saveUser,
  readUser,
  readUserById,
  updateUserById,
  deleteUserById
} = require('../db_manager/db_client_user_mongo');

const user = {
  ngoName: "ONG",
  email: "allan_b95@outlook.com",
  animals: [],
  adopts: []
}

router.post('/create-user', async (req, res) => {
  try {
    await saveUser(user);
    res.status(200).json({ message: 'Usuário criado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário.' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const data = await readUser();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler dados.' });
  }
});

router.get('/user', async (req, res) => {

  var userId;

  if(req.body) {
    userId = req.body.userId;
  }

  console.log(userId);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'ID de usuário inválido.' });
  }

  try {
    const user = await readUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(200).json(user);
    console.log(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
});

router.put('/update-user', async (req, res) => {

  var userId;
  var newNgoName;
  var newEmail;

  if (req.body) {
    userId = req.body.userId;
    newNgoName = req.body.newNgoName;
    newEmail = req.body.newEmail;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'ID de usuário inválido.' });
    }

    if (newNgoName == null && newEmail == null) {
      return res.status(400).json({ error: 'Novo usuário é obrigatório.' });
    }

  }

  try {
    await updateUserById(userId, newNgoName, newEmail);
    res.status(200).json({ message: 'Usuário atualizado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o usuário.' });
  }

});

router.delete('/delete-user', async (req, res) => {
  var userId;

  if(req.body) {
    userId = req.body.userId;
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'ID de documento inválido.' });
  }

  try {
    await deleteUserById(userId);
    res.json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário.' });
  }
});

router.use('/animals', animals);
router.use('/requests', requests_adopts);
router.use('/adopts', adopts);

module.exports = router;
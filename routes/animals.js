const express = require('express');
const router = express.Router();

const animals = require('./animals');

const mongoose = require('mongoose');

const { saveAnimal, readAnimals, updateAnimalByUser } = require('../db_manager/db_client_animals');

const animal = {
    urlImageAnimal: "url da imagem",
    animalName: "Nome",
    specie: "animal",
    race: "sem raça",
    age: "2",
    specialCondition: "muito bem de saúde",
    sex: "male",
}

router.post('/create-animal', async (req, res) => {
    const userId = req.body.id;

    try {
        await saveAnimal(userId, animal);
        res.status(200).json({ message: 'Animal cadastrado com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar animal.' });
    }
});

router.get('/all-animals', async (req, res) => {
    var userId;

    if (req.body) {
        userId = req.body.id;
        console.log(userId);
    }

    try {
        const data = await readAnimals(userId);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao ler animais.' });
    }
});

router.put('/update-animal', async (req, res) => {

    var userId;
    var newAnimal;
    var destAnimalId;
    var urlImageAnimal;
    var animalName;
    var specie;
    var race;
    var age;
    var specialCondition;
    var sex;

    if (req.body) {
        userId = req.body.userId;
        destAnimalId = req.body.destAnimalId;
        newAnimal = req.body.newAnimal;

        urlImageAnimal = newAnimal.urlImageAnimal;
        animalName = newAnimal.animalName;
        specie = newAnimal.specie;
        race = newAnimal.race;
        age = newAnimal.age;
        specialCondition = newAnimal.specialCondition;
        sex = newAnimal.sex;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(destAnimalId)) {
            return res.status(400).json({ error: 'ID de usuário ou animal inválido.' });
        }

        if (
            urlImageAnimal == null 
            && animalName == null 
            && specie == null 
            && race == null 
            && age == null 
            && specialCondition == null 
            && sex == null
        ) {
            return res.status(400).json({ error: 'Novos dados são obrigatórios.' });
        }

    }

    try {
        var result = await updateAnimalByUser(userId, destAnimalId, newAnimal);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o animal.' });
    }

});

// router.delete('/delete-users/:id', async (req, res) => {
//     const userId = req.params.id;

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//         return res.status(400).json({ error: 'ID de documento inválido.' });
//     }

//     try {
//         await deleteUserById(userId);
//         res.json({ message: 'Usuário deletado com sucesso.' });
//     } catch (error) {
//         res.status(500).json({ error: 'Erro ao deletar usuário.' });
//     }
// });

// router.use('/animals', animals);

module.exports = router;
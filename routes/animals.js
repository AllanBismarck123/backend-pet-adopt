const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const { 
    saveAnimal, 
    readAnimals, 
    readAnimalById, 
    updateAnimalByNgo, 
    deleteAnimalByNgo
} = require('../db_manager/db_client_animals');

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
    var ngoId;
    
    if(req.body) {
        ngoId = req.body.ngoId;
    }

    try {
        await saveAnimal(ngoId, animal);
        res.status(200).json({ message: 'Animal cadastrado com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar animal.' });
    }
});

router.get('/all-animals', async (req, res) => {
    var ngoId;

    if (req.body) {
        ngoId = req.body.ngoId;
    }

    try {
        const data = await readAnimals(ngoId);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao ler animais.' });
    }
});

router.get('/read-animal', async (req, res) => {
    var ngoId;
    var animalId;

    if (req.body) {
        ngoId = req.body.ngoId;
        animalId = req.body.animalId
    }

    try {
        const data = await readAnimalById(ngoId, animalId);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao ler animal.' });
    }
});

router.put('/update-animal', async (req, res) => {

    var ngoId;
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
        ngoId = req.body.ngoId;
        destAnimalId = req.body.destAnimalId;
        newAnimal = req.body.newAnimal;

        urlImageAnimal = newAnimal.urlImageAnimal;
        animalName = newAnimal.animalName;
        specie = newAnimal.specie;
        race = newAnimal.race;
        age = newAnimal.age;
        specialCondition = newAnimal.specialCondition;
        sex = newAnimal.sex;

        if (!mongoose.Types.ObjectId.isValid(ngoId) || !mongoose.Types.ObjectId.isValid(destAnimalId)) {
            return res.status(400).json({ error: 'ID da ONG ou do animal inválido.' });
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
        var result = await updateAnimalByNgo(ngoId, destAnimalId, newAnimal);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o animal.' });
    }

});

router.delete('/delete-animal', async (req, res) => {
    var ngoId;
    var animalId;

    if(req.body) {
        ngoId = req.body.ngoId;
        animalId = req.body.animalId;
    }

    if (!mongoose.Types.ObjectId.isValid(ngoId) || !mongoose.Types.ObjectId.isValid(animalId)) {
        return res.status(400).json({ error: 'ID da ONG ou do animal inválido.' });
    }

    try {
        var result = await deleteAnimalByNgo(ngoId, animalId);
        res.json({ message: result });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar animal.' });
    }
});

module.exports = router;
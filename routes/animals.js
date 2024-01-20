const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const {
    saveAnimal,
    readAnimals,
    readAnimalById,
    updateAnimalByNgo,
    deleteAnimalByNgo,
    readAnimalByFilters
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
    var authToken;

    if (req.body) {
        ngoId = req.body.ngoId;
    }

    if(req.header) {
        authToken = req.header('Authorization');
    }

    if (!mongoose.Types.ObjectId.isValid(ngoId)) {
        return res.status(400).json({ error: 'ID da ONG inválido.' });
    }

    try {
        const result = await saveAnimal(ngoId, animal, authToken);
        res.status(result.statusCode).json({ message: result.msg });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar animal.' });
    }
});

router.get('/all-animals', async (req, res) => {
    var ngoId;

    if (req.body) {
        ngoId = req.body.ngoId;
    }

    if (!mongoose.Types.ObjectId.isValid(ngoId)) {
        return res.status(400).json({ error: 'ID da ONG inválido.' });
    }

    try {
        const result = await readAnimals(ngoId);
        res.status(result.statusCode).json(result.msg);
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

    if (!mongoose.Types.ObjectId.isValid(ngoId) || !mongoose.Types.ObjectId.isValid(animalId)) {
        return res.status(400).json({ error: 'ID da ONG ou do animal inválido.' });
    }

    try {
        const result = await readAnimalById(ngoId, animalId);
        res.status(result.statusCode).json(result.msg);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao ler animal.' });
    }
});

router.put('/update-animal', async (req, res) => {

    var ngoId;
    var newAnimal;
    var destAnimalId;

    var authToken;

    if (req.body) {
        ngoId = req.body.ngoId;
        destAnimalId = req.body.destAnimalId;
        newAnimal = req.body.newAnimal;

        if (!mongoose.Types.ObjectId.isValid(ngoId) || !mongoose.Types.ObjectId.isValid(destAnimalId)) {
            return res.status(400).json({ error: 'ID da ONG ou do animal inválido.' });
        }

        if (
            newAnimal.urlImageAnimal == null
            && newAnimal.animalName == null
            && newAnimal.specie == null
            && newAnimal.race == null
            && newAnimal.age == null
            && newAnimal.specialCondition == null
            && newAnimal.sex == null
        ) {
            return res.status(400).json({ error: 'Novos dados são obrigatórios.' });
        }

    }

    if(req.header) {
        authToken = req.header('Authorization');
    }

    try {
        const result = await updateAnimalByNgo(ngoId, destAnimalId, newAnimal, authToken);
        res.status(result.statusCode).json({ message: result.msg });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o animal.' });
    }

});

router.delete('/delete-animal', async (req, res) => {
    var ngoId;
    var animalId;

    var authToken;

    if (req.body) {
        ngoId = req.body.ngoId;
        animalId = req.body.animalId;
    }

    if(req.header) {
        authToken = req.header('Authorization');
    }

    if (!mongoose.Types.ObjectId.isValid(ngoId) || !mongoose.Types.ObjectId.isValid(animalId)) {
        return res.status(400).json({ error: 'ID da ONG ou do animal inválido.' });
    }

    try {
        const result = await deleteAnimalByNgo(ngoId, animalId, authToken);
        res.status(result.statusCode).json({ message: result.msg });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar animal.' });
    }
});

router.get('/read-animal-by-filter', async (req, res) => {
    var ngoId;
    var animalParameters;
    var animalTypeFilters;

    if (req.body) {
        ngoId = req.body.ngoId;
        animalParameters = req.body.animalParameters;
        animalTypeFilters = req.body.animalTypeFilters;
    }

    if (!mongoose.Types.ObjectId.isValid(ngoId)) {
        return res.status(400).json({ error: 'ID da ONG inválido.' });
    }

    if (
        animalTypeFilters.length == 0 || 
        animalParameters.length == 0 || 
        animalTypeFilters == null || 
        animalParameters == null || 
        animalTypeFilters.length != animalParameters.length
    ) {
        return res.status(400).json({ error: 'Parâmetros de filtro inválidos.' });
    }

    try {
        var result = await readAnimalByFilters(ngoId, animalParameters, animalTypeFilters);

        res.status(result.statusCode).json(result.msg);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao ler animais por filtros.' });
    }
});

module.exports = router;
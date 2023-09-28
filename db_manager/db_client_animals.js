const { ModelAnimalClass } = require('../models/model_animal');
const { readUserById } = require('./db_client_user_mongo');

async function saveAnimal(userId, data) {
    try {
        const dataToInsert = new ModelAnimalClass(data);
        var user = await readUserById(userId);

        user.animals.push(dataToInsert);

        const result = await user.save();
        console.log('Documento inserido com sucesso:', result._id);
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function readAnimals(userId) {
    try {
        const user = await readUserById(userId);
        return user.animals;
    } catch (error) {
        console.error('Erro:', error);
        return [];
    }
}

async function readAnimalById(userId, animalId) {

    try {

        const user = await readUserById(userId);

        if (user != null && animalId != null) {
            var animals = user.animals;
            const index = animals.findIndex((animal) => animal._id.toString() === animalId.toString());

            return user.animals[index];
        }

        return [];
    } catch (error) {
        console.error('Erro:', error);
        return [];
    }
}

async function updateAnimalByUser(userId, destAnimalId, newAnimal) {
    try {
        var user = await readUserById(userId);
        if (newAnimal != null) {
            var animals = user.animals;
            var find = false;

            animals.forEach((i) => {
                if (i._id.toString() === destAnimalId.toString()) {
                    find = true;

                    i.urlImageAnimal = newAnimal.urlImageAnimal;
                    i.animalName = newAnimal.animalName;
                    i.specie = newAnimal.specie;
                    i.race = newAnimal.race;
                    i.age = newAnimal.age;
                    i.specialCondition = newAnimal.specialCondition;
                    i.sex = newAnimal.sex;
                }
            });

            if (find) {
                user.animals = animals;
                await user.save();

                console.log("Animal atualizado com sucesso.");
                return "Animal atualizado com sucesso.";
            } else {
                console.log("Animal não encontrado para atualização.");
                return "Animal não encontrado para atualização.";
            }

        }

    } catch (error) {
        console.log("Erro ao atualizar animal", error);
        return "Erro ao atualizar animal";
    }
}

async function deleteAnimalByUser(userId, animalId) {

    try {
        var user = await readUserById(userId);
        if (user != null && animalId != null) {
            var animals = user.animals;

            const index = animals.findIndex((animal) => animal._id.toString() === animalId.toString());

            if (index >= 0) {
                user.animals.splice(index, 1);
                await user.save();

                console.log("Animal deletado com sucesso.");
                return "Animal deletado com sucesso.";
            } else {
                console.log("Animal não encontrado para deleção.");
                return "Animal não encontrado para deleção.";
            }

        }
        console.log("Documento deletado com sucesso:", result);
    } catch (error) {
        console.error('Erro ao deletar o animal:', error);
        return "Erro ao deletar animal";
    }
}

module.exports = {
    saveAnimal,
    readAnimals,
    readAnimalById,
    updateAnimalByUser,
    deleteAnimalByUser
};
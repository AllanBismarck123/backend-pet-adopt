const { ModelAnimalClass } = require('../models/model_animal');
const { readNgoById } = require('./db_client_ngo_mongo');

async function saveAnimal(ngoId, data) {
    try {
        const dataToInsert = new ModelAnimalClass(data);
        var ngo = await readNgoById(ngoId);

        ngo.animals.push(dataToInsert);

        const result = await ngo.save();
        console.log('Documento inserido com sucesso:', result._id);
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function readAnimals(ngoId) {
    try {
        const ngo = await readNgoById(ngoId);
        return ngo.animals;
    } catch (error) {
        console.error('Erro:', error);
        return [];
    }
}

async function readAnimalById(ngoId, animalId) {

    try {

        const ngo = await readNgoById(ngoId);

        if (ngo != null && animalId != null) {
            var animals = ngo.animals;
            const index = animals.findIndex((animal) => animal._id.toString() === animalId.toString());

            return ngo.animals[index];
        }

        return [];
    } catch (error) {
        console.error('Erro:', error);
        return [];
    }
}

async function updateAnimalByNgo(ngoId, destAnimalId, newAnimal) {
    try {
        var ngo = await readNgoById(ngoId);
        if (newAnimal != null) {
            var animals = ngo.animals;
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
                ngo.animals = animals;
                await ngo.save();

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

async function deleteAnimalByNgo(ngoId, animalId) {

    try {
        var ngo = await readNgoById(ngoId);
        if (ngo != null && animalId != null) {
            var animals = ngo.animals;

            const index = animals.findIndex((animal) => animal._id.toString() === animalId.toString());

            if (index >= 0) {
                ngo.animals.splice(index, 1);
                await ngo.save();

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
    updateAnimalByNgo,
    deleteAnimalByNgo
};
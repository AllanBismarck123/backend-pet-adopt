const { ModelAnimalClass } = require('../models/model_animal');
const { ModelNgoClass } = require('../models/model_ngo');

const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.key' });

async function saveAnimal(ngoId, data, authToken) {
    try {

        const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);

        const dataToInsert = new ModelAnimalClass(data);
        var ngo = await ModelNgoClass.findById(ngoId).exec();

        if (ngo == null) {
            return { statusCode: 404, msg: "ONG não encontrada." };
        }

        ngo.animals.push(dataToInsert);

        const result = await ngo.save();

        if (result == null) {
            return { statusCode: 500, msg: "Erro ao cadastrar animal." };
        }

        return { statusCode: 201, msg: "Animal cadastrado com sucesso." };
    } catch (error) {
        console.log(error);
        return { statusCode: 401, msg: "Usuário não autenticado." };
    }
}

async function readAnimals(ngoId) {
    try {
        var ngo = await ModelNgoClass.findById(ngoId).exec();

        if (ngo == null) {
            return { statusCode: 404, msg: "ONG não encontrada." };
        }

        return { statusCode: 200, msg: ngo.animals };
    } catch (error) {
        return { statusCode: 500, msg: "Erro ao ler animais." };
    }
}

async function readAnimalById(ngoId, animalId) {

    try {

        var ngo = await ModelNgoClass.findById(ngoId).exec();

        if (ngo == null) {
            return { statusCode: 404, msg: "ONG não encontrada." };
        }

        var animal = ngo.animals.id(animalId);

        if(animal == null) {
            return { statusCode: 404, msg: "Animal não encontrado."}
        }

        return { statusCode: 200, msg: animal };
    } catch (error) {
        return { statusCode: 500, msg: "Erro ao buscar animal." };
    }
}

async function updateAnimalByNgo(ngoId, destAnimalId, newAnimal, authToken) {
    try {

        const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);

        var ngo = await ModelNgoClass.findById(ngoId).exec();

        if (ngo == null) {
            return { statusCode: 404, msg: "ONG não encontrada." };
        }

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
                const result = await ngo.save();

                if (result) {
                    return { statusCode: 200, msg: "Animal atualizado com sucesso." };
                } else {
                    return { statusCode: 500, msg: "Erro ao atualizar animal." };
                }
            } else {
                return { statusCode: 404, msg: "Animal não encontrado para atualização." };
            }

        }

        return { statusCode: 500, msg: "Erro ao atualizar animal." };
    } catch (error) {
        return { statusCode: 401, msg: "Usuário não autenticado." };
    }
}

async function deleteAnimalByNgo(ngoId, animalId, authToken) {

    try {

        const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);

        var ngo = await ModelNgoClass.findById(ngoId).exec();

        if (ngo == null) {
            return { statusCode: 404, msg: "ONG não encontrada." };
        }

        if (animalId != null) {
            var animals = ngo.animals;

            const index = animals.findIndex((animal) => animal._id.toString() === animalId.toString());

            if (index >= 0) {
                ngo.animals.splice(index, 1);
                const result = await ngo.save();

                if (result != null) {
                    return { statusCode: 200, msg: "Animal deletado com sucesso." };
                } else {
                    return { statusCode: 500, msg: "Erro ao deletar animal." };
                }
            } else {
                return { statusCode: 404, msg: "Animal não encontrado para deleção." };
            }

        }

        return { statusCode: 500, msg: "Erro ao deletar animal." };
    } catch (error) {
        return { statusCode: 500, msg: "Usuário não autenticado." };
    }
}

async function readAnimalByFilters(ngoId, animalParameters, animalTypeFilters) {
    try {

        const ngo = await ModelNgoClass.findById(ngoId).exec();

        var animals = ngo.animals;

        if (ngo == null) {
            return { statusCode: 404, msg: "ONG não encontrada." };
        }

        animalTypeFilters.forEach((element, index) => {
            switch (element) {
                case 'Age':
                    animals = animals.filter(animal => animal.age == animalParameters[index]);
                    break;
                case 'Sex':
                    animals = animals.filter(animal => animal.sex.toString()
                    .toLowerCase() === animalParameters[index].toLowerCase());
                    break;
                case 'SpecialCondition':
                    animals = animals.filter(animal => animal.specialCondition.length > 0);
                    break;
                case 'Specie':
                    animals = animals.filter(animal => animal.specie.toString()
                    .toLowerCase()
                    .includes(animalParameters[index].toLowerCase()));
                    break;
                case 'Name':
                    animals = animals.filter(animal => animal.animalName.toString()
                    .toLowerCase()
                    .includes(animalParameters[index].toLowerCase()));
                    break;
                default:
                    animals = animals.filter(animal => animal.race.toString()
                    .toLowerCase()
                    .includes(animalParameters[index].toLowerCase()));
            }
        });

        return { statusCode: 200, msg: animals };
    } catch (error) {
        console.error('Erro:', error);
        return { statusCode: 500, msg: "Erro ao buscar animais pelos filtros." };
    }
}

module.exports = {
    saveAnimal,
    readAnimals,
    readAnimalById,
    updateAnimalByNgo,
    deleteAnimalByNgo,
    readAnimalByFilters
};
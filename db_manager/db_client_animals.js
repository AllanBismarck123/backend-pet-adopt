const { ModelAnimalClass } = require('../models/model_animal');
const { readNgoById } = require('./db_client_ngo_mongo');

async function saveAnimal(ngoId, data) {
    try {
        const dataToInsert = new ModelAnimalClass(data);
        var ngo = await readNgoById(ngoId);

        if(ngo == null) {
            return { statusCode: 404, msg: "ONG não encontrada." };
        }

        ngo.animals.push(dataToInsert);

        const result = await ngo.save();

        if(result == null) {
            return { statusCode: 500, msg: "Erro ao cadastrar animal." };
        }

        console.log('Documento inserido com sucesso:', result._id);
        return { statusCode: 201, msg: "Animal cadastrado com sucesso." };
    } catch (error) {
        console.error('Erro:', error);
        return { statusCode: 500, msg: "Erro ao cadastrar animal." };
    }
}

async function readAnimals(ngoId) {
    try {
        const ngo = await readNgoById(ngoId);

        if(ngo == null) {
            return { statusCode: 404, msg: [] };
        }

        return { statusCode: 200, msg: ngo.animals };
    } catch (error) {
        console.error('Erro:', error);
        return { statusCode: 500, msg: [] };
    }
}

async function readAnimalById(ngoId, animalId) {

    try {

        const ngo = await readNgoById(ngoId);

        if(ngo == null) {
            return { statusCode: 404, msg: "ONG não encontrada." };
        }

        if (ngo != null && animalId != null) {
            var animals = ngo.animals;
            const index = animals.findIndex((animal) => animal._id.toString() === animalId.toString());

            if(index == null) {
                return { statusCode: 404, msg: "Animal não encontrado." };
            }

            return { statusCode: 200, msg: ngo.animals[index] };
        }

        return { statusCode: 500, msg: "Erro ao buscar animal." };
    } catch (error) {
        console.error('Erro:', error);
        return { statusCode: 500, msg: "Erro ao buscar animal." };
    }
}

async function updateAnimalByNgo(ngoId, destAnimalId, newAnimal) {
    try {
        var ngo = await readNgoById(ngoId);

        if(ngo == null) {
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

                if(result) {
                    console.log("Animal atualizado com sucesso.");
                    return { statusCode: 200, msg: "Animal atualizado com sucesso." };
                } else {
                    console.log("Animal não encontrado para atualização.");
                    return { statusCode: 404, msg: "Animal não encontrado para atualização." };
                }
            } else {
                console.log("Animal não encontrado para atualização.");
                return { statusCode: 404, msg: "Animal não encontrado para atualização." };
            }

        }

        return { statusCode: 500, msg: "Erro ao atualizar animal." };
    } catch (error) {
        console.log("Erro ao atualizar animal", error);
        return { statusCode: 500, msg: "Erro ao atualizar animal." };
    }
}

async function deleteAnimalByNgo(ngoId, animalId) {

    try {
        var ngo = await readNgoById(ngoId);

        if(ngo == null) {
            console.log("ONG não encontrada.");
            return { statusCode: 404, msg: "ONG não encontrada." };
        }

        if (ngo != null && animalId != null) {
            var animals = ngo.animals;

            const index = animals.findIndex((animal) => animal._id.toString() === animalId.toString());

            if (index >= 0) {
                ngo.animals.splice(index, 1);
                const result = await ngo.save();

                if(result) {
                    console.log("Animal deletado com sucesso.");
                    return { statusCode: 200, msg: "Animal deletado com sucesso." };
                } else {
                    console.log("Erro ao deletar animal.");
                    return { statusCode: 500, msg: "Erro ao deletar animal." };
                }
            } else {
                console.log("Animal não encontrado para deleção.");
                return { statusCode: 404, msg: "Animal não encontrado para deleção." };
            }

        }

        console.log("Erro ao deletar animal.");
        return { statusCode: 500, msg: "Erro ao deletar animal." };
    } catch (error) {
        console.error('Erro ao deletar o animal:', error);
        return { statusCode: 500, msg: "Erro ao deletar animal." };
    }
}

module.exports = {
    saveAnimal,
    readAnimals,
    readAnimalById,
    updateAnimalByNgo,
    deleteAnimalByNgo
};
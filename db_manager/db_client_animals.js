const { ModelAnimalClass } = require('../models/model_animal');
const { readUserById, updateUserById } = require('./db_client_user_mongo');

async function saveAnimal(userId, data) {
    try {
        const dataToInsert = new ModelAnimalClass(data);
        console.log(dataToInsert);
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

async function updateAnimalByUser(userId, destAnimalId, newAnimal) {
    try {
        var user = await readUserById(userId);
        if (newAnimal != null) {
            var animals = user.animals;
            var find = false;

            animals.forEach((i) => {
                console.log(`i: ${i._id}`);
                console.log(`dest: ${destAnimalId}`);
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

            if(find) {
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

// async function deleteAnimalByUser(userId) {
//     console.log(userId);
//     try {
//         const result = await ModelUserClass.deleteOne(userId);
//         if(!result) {
//             throw new Error('Documento não encontrado.');
//         }
//         console.log("Documento deletado com sucesso:", result);
//     } catch (error) {
//         console.error('Erro ao deletar o documento:', error);
//         return null;
//     }
// }

module.exports = {
    saveAnimal,
    readAnimals,
    updateAnimalByUser
    // deleteAnimalByUser
};
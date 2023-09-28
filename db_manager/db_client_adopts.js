const { ModelAdoptClass } = require('../models/model_adopt');
const { readAnimalById, deleteAnimalByUser } = require('./db_client_animals');
const { readRequestById, deleteRequestByUser } = require('./db_client_requests_adopt');
const { readUserById } = require('./db_client_user_mongo');
const { ObjectId } = require('mongodb');

async function acceptAdopt(userId, requestId) {
    try {

        var user = await readUserById(userId);
        const request = await readRequestById(userId, requestId);
        const animal = await readAnimalById(userId, request.animalId);
        const tutor = request.tutor;

        const dataToInsert = new ModelAdoptClass({ animal: animal, tutor: tutor});
        console.log(dataToInsert);

        await user.adopts.push(dataToInsert);
        await user.save();

        await deleteAnimalByUser(userId, request.animalId);

        user = await readUserById(userId);
        var length = user.requestsAdopts.length;

        if(length > 0) {
            var index = 0;
            while(index < length) {
                console.log(user.requestsAdopts[index].animalId);
                console.log(request.animalId);
                console.log('\n');
                if( 
                    user.requestsAdopts[index] 
                    && user.requestsAdopts[index].animalId 
                    && user.requestsAdopts[index].animalId.toString() 
                    === request.animalId.toString()
                ) {
                    console.log(index);
                    user.requestsAdopts.splice(index, 1);
                    await user.save();
                    index--;
                    length--;
                }
                index++;
            }
        }

        const result = await user.save();
        console.log('Documento inserido com sucesso:', result._id);
    } catch (error) {
        console.error('Erro:', error);
    }
}

// async function readAnimals(userId) {
//     try {
//         const user = await readUserById(userId);
//         return user.animals;
//     } catch (error) {
//         console.error('Erro:', error);
//         return [];
//     }
// }

// async function updateAnimalByUser(userId, destAnimalId, newAnimal) {
//     try {
//         var user = await readUserById(userId);
//         if (newAnimal != null) {
//             var animals = user.animals;
//             var find = false;

//             animals.forEach((i) => {
//                 console.log(`i: ${i._id}`);
//                 console.log(`dest: ${destAnimalId}`);
//                 if (i._id.toString() === destAnimalId.toString()) {
//                     find = true;

//                     i.urlImageAnimal = newAnimal.urlImageAnimal;
//                     i.animalName = newAnimal.animalName;
//                     i.specie = newAnimal.specie;
//                     i.race = newAnimal.race;
//                     i.age = newAnimal.age;
//                     i.specialCondition = newAnimal.specialCondition;
//                     i.sex = newAnimal.sex;
//                 }
//             });

//             if (find) {
//                 user.animals = animals;
//                 await user.save();

//                 console.log("Animal atualizado com sucesso.");
//                 return "Animal atualizado com sucesso.";
//             } else {
//                 console.log("Animal não encontrado para atualização.");
//                 return "Animal não encontrado para atualização.";
//             }

//         }

//     } catch (error) {
//         console.log("Erro ao atualizar animal", error);
//         return "Erro ao atualizar animal";
//     }
// }

// async function deleteAnimalByUser(userId, animalId) {

//     try {
//         var user = await readUserById(userId);
//         console.log(user.animals);
//         if (user != null && animalId != null) {
//             var animals = user.animals;

//             const index = animals.findIndex((animal) => animal._id.toString() === animalId.toString());

//             if (index >= 0) {
//                 user.animals.splice(index, 1);
//                 await user.save();

//                 console.log("Animal deletado com sucesso.");
//                 return "Animal deletado com sucesso.";
//             } else {
//                 console.log("Animal não encontrado para deleção.");
//                 return "Animal não encontrado para deleção.";
//             }

//         }
//         console.log("Documento deletado com sucesso:", result);
//     } catch (error) {
//         console.error('Erro ao deletar o animal:', error);
//         return "Erro ao deletar animal";
//     }
// }

module.exports = {
    acceptAdopt
    // readAnimals,
    // updateAnimalByUser,
    // deleteAnimalByUser
};
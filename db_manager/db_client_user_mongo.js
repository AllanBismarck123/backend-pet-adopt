// const mongoose = require('mongoose');
// const { ModelUserClass } = require('../models/model_user');
// const { ObjectId } = require('mongodb');

// mongoose.connect(process.env.MONGO_DB_URI,
//  { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Conexão com o MongoDB estabelecida'))
//     .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// async function saveUser(data) {
//     const dataToInsert = new ModelUserClass(data);
//     try {
//         ModelUserClass.createCollection().then((collection) => {
//             console.log("Collection is created!");
//         });
//         const result = await dataToInsert.save();
//         console.log('Documento inserido com sucesso:', result._id);
//     } catch (error) {
//         console.error('Erro:', error);
//     }
// }

// async function readUser() {
//     try {
//         const data = await ModelUserClass.find().exec();
//         return data;
//     } catch (error) {
//         console.error('Erro:', error);
//         return [];
//     }
// }

// async function readUserById(userId) {
//     try {
//         const user = await ModelUserClass.findById(userId).exec();
//         return user;
//     } catch (error) {
//         console.error('Erro:', error);
//         return null;
//     }
// }

// async function updateUserById(userId, newNgoName, newEmail) {
//     try {
//         var user = await readUserById(userId);
//         user.ngoName = newNgoName == null ? user.ngoName : newNgoName;
//         user.email = newEmail == null ? user.email : newEmail;

//         await user.save();

//         console.log("Usuário atualizado com sucesso.")
//     } catch(error) {
//         console.log("Erro ao atualizar o usuário", error);
//     }
// }

// async function deleteUserById(userId) {
//     try {
//         var userObjId = new ObjectId(userId);
//         const result = await ModelUserClass.deleteOne(userObjId);
//         if(!result) {
//             throw new Error('Documento não encontrado.');
//         }
//         console.log("Documento deletado com sucesso:", result);
//     } catch (error) {
//         console.error('Erro ao deletar o documento:', error);
//         return null;
//     }
// }

// module.exports = {
//     saveUser,
//     readUser,
//     readUserById,
//     updateUserById,
//     deleteUserById
// };
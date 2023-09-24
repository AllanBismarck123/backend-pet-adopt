const mongoose = require('mongoose');
const {modelAnimalObj} = require('./model_animal');
const {modelAdoptObj} = require('./model_adopt');

const modelUserObj = mongoose.Schema({
    ngoName: String,
    email: String,
    animals: [modelAnimalObj],
    adopts: [modelAdoptObj]
});

class ModelUser {
    constructor(ngoName, email, animals, adopts) {
        this.ngoName = ngoName;
        this.email = email;
        this.animals.push(animals);
        this.adopts.push(adopts);
    }
}

const ModelUserClass = mongoose.model('ModelUser', modelUserObj);

module.exports = {
    ModelUserClass
}
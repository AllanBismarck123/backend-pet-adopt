const mongoose = require('mongoose');

const { modelAdopterObj } = require('./model_adopter');

class modelRequestAdopt {
    constructor(adopter, animalId, ngoId) {
        this.adopter = adopter;
        this.animalId = animalId;
    }
}

const modelRequestAdoptObj = mongoose.Schema({
    adopter: modelAdopterObj,
    animalId: String
});

const ModelRequestAdoptClass = mongoose.model('ModelRequestAdopt', modelRequestAdoptObj);

module.exports = {
    ModelRequestAdoptClass,
    modelRequestAdoptObj
}
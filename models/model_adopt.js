const { modelAnimalObj } = require('./model_animal');
const { modelAdopterObj } = require('./model_adopter');
const mongoose = require('mongoose');

class ModelAdopt {
    constructor(animal, adopter) {
        this.animal = animal;
        this.adopter = adopter;
    }
}

const modelAdoptObj = mongoose.Schema({
    animal: modelAnimalObj,
    adopter: modelAdopterObj,
});

const ModelAdoptClass = mongoose.model('ModelAdopt', modelAdoptObj);

module.exports = {
    ModelAdoptClass,
    modelAdoptObj
};
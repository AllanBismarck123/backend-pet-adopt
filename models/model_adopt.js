const { modelAnimalObj } = require('./model_animal');
const mongoose = require('mongoose');

class ModelAdopt {
    constructor(animal, tutor) {
        this.animal = animal;
        this.tutor = tutor;
    }
}

const modelAdoptObj = mongoose.Schema({
    animal: modelAnimalObj,
    tutor: String,
});

const ModelAdoptClass = mongoose.model('ModelAdopt', modelAdoptObj);

module.exports = {
    ModelAdoptClass,
    modelAdoptObj
};
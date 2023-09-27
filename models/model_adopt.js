const { modelAnimalObj } = require('./model_animal');
const { modelTutorObj } = require('./model_tutor');
const mongoose = require('mongoose');

class ModelAdopt {
    constructor(animal, tutor) {
        this.animal = animal;
        this.tutor = tutor;
    }
}

const modelAdoptObj = mongoose.Schema({
    animal: modelAnimalObj,
    tutor: modelTutorObj,
});

const ModelAdoptClass = mongoose.model('ModelAdopt', modelAdoptObj);

module.exports = {
    ModelAdoptClass,
    modelAdoptObj
};
const mongoose = require('mongoose');

const { modelTutorObj } = require('./model_tutor');

class modelRequestAdopt {
    constructor(tutor, animalId, ngoId) {
        this.tutor = tutor;
        this.animalId = animalId;
    }
}

const modelRequestAdoptObj = mongoose.Schema({
    tutor: modelTutorObj,
    animalId: String
});

const ModelRequestAdoptClass = mongoose.model('ModelRequestAdopt', modelRequestAdoptObj);

module.exports = {
    ModelRequestAdoptClass,
    modelRequestAdoptObj
}
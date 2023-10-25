const mongoose = require('mongoose');
const { modelAnimalObj } = require('./model_animal');
const { modelAdoptObj } = require('./model_adopt');
const { modelRequestAdoptObj } = require('./model_request_adopt');

const modelNgoObj = mongoose.Schema({
    ngoName: String,
    email: String,
    animals: [modelAnimalObj],
    adopts: [modelAdoptObj],
    requestsAdopts: [modelRequestAdoptObj]
});

class ModelNgo {
    constructor(ngoName, email, animals, adopts, requestsAdopts) {
        this.ngoName = ngoName;
        this.email = email;
        this.animals.push(animals);
        this.adopts.push(adopts);
        this.requestsAdopts.push(requestsAdopts);
    }
}

const ModelNgoClass = mongoose.model('ModelNgo', modelNgoObj);

module.exports = {
    ModelNgoClass
}
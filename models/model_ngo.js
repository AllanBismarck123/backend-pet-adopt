const mongoose = require('mongoose');
const { modelAnimalObj } = require('./model_animal');
const { modelAdoptObj } = require('./model_adopt');
const { modelRequestAdoptObj } = require('./model_request_adopt');

const modelNgoObj = mongoose.Schema({
    ngoName: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    animals: [modelAnimalObj],
    adopts: [modelAdoptObj],
    requestsAdopts: [modelRequestAdoptObj],
    tokens: [{
        token: {
            type: String,
            required: true,
        },
    }],
});

class ModelNgo {
    constructor(ngoName, email, password, animals, adopts, requestsAdopts) {
        this.ngoName = ngoName;
        this.email = email;
        this.password = password;
        this.animals.push(animals);
        this.adopts.push(adopts);
        this.requestsAdopts.push(requestsAdopts);
    }
}

const ModelNgoClass = mongoose.model('ModelNgo', modelNgoObj);

module.exports = {
    ModelNgoClass
}
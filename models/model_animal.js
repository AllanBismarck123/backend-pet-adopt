const mongoose = require('mongoose');

class ModelAnimal {
    constructor(urlImageAnimal, animalName, specie, race, age, specialCondition) {
        this.urlImageAnimal = urlImageAnimal;
        this.animalName = animalName;
        this.specie = specie;
        this.race = race;
        this.age = age;
        this.specialCondition = specialCondition;
    }
}

const modelAnimalObj = mongoose.Schema({
    urlImageAnimal: String,
    animalName: String,
    specie: String,
    race: String,
    age: String,
    specialCondition: String,
    sex: String
});

const ModelAnimalClass = mongoose.model('ModelAnimal', modelAnimalObj);

module.exports = {
    ModelAnimalClass,
    modelAnimalObj
};
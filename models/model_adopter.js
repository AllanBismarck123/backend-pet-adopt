const mongoose = require('mongoose');

class ModelAdopter {
    constructor(
        urlImageAdopter,
        adopterName, 
        cpf, 
        rg, 
        age, 
        road, 
        numberHouse, 
        neighborhood, 
        city, 
        state, 
        telephone, 
        email
    ) {
        this.urlImageAdopter = urlImageAdopter;
        this.adopterName = adopterName;
        this.cpf = cpf;
        this.rg = rg;
        this.age = age;
        this.road = road;
        this.numberHouse = numberHouse;
        this.neighborhood = neighborhood;
        this.city = city;
        this.state = state;
        this.telephone = telephone;
        this.email = email;
    }
}

const modelAdopterObj = mongoose.Schema({
    urlImageAdopter: String,
    adopterName: String,
    cpf: String,
    rg: String,
    age: String,
    road: String,
    numberHouse: String,
    neighborhood: String,
    city: String,
    state: String,
    telephone: String,
    email: String
});

const ModelAdopterClass = mongoose.model('ModelAdopter', modelAdopterObj);

module.exports = {
    ModelAdopterClass,
    modelAdopterObj
};
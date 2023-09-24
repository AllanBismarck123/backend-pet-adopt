const mongoose = require('mongoose');

class ModelTutor {
    constructor(
        urlImageTutor,
        tutorName, 
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
        this.urlImageTutor = urlImageTutor;
        this.tutorName = tutorName;
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

const modelTutorObj = mongoose.Schema({
    urlImageTutor: String,
    tutorName: String,
    cpf: String,
    rg: String,
    age: String,
    road: String,
    numberHouse: String,
    neighborhood: String,
    city: String,
    state: String,
    telephone: String,
    email: String,
});

const ModelTutorClass = mongoose.model('ModelTutor', modelTutorObj);

module.exports = {
    ModelTutorClass
};
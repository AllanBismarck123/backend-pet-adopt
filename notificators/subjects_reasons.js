function createAcceptanceByMistake(animalName) {
    return {
        subject: 'Aceitação por Engano',
        reason: `Informamos que a adoção do animal ${animalName} foi aceita por engano. Pedimos desculpas por qualquer inconveniente causado e estamos trabalhando para resolver a situação da melhor maneira possível.`
    };
}

function createDevolution(animalName, ngoName) {
    return {
        subject: 'Devolução',
        reason: `O animal ${animalName} foi devolvido à ONG ${ngoName}. Entendemos que as circunstâncias podem mudar, e estamos aqui para apoiar tanto os tutores quanto o animal.`
    };
}

function createMistreatment(animalName) {
    return {
        subject: 'Maus Tratos',
        reason: `Após uma investigação, encontramos indícios de maus-tratos relacionados ao animal ${animalName}. Nossa prioridade é o bem-estar e a segurança de todos os animais, e tomamos medidas para proteger o animal nessa situação.`
    };
}

module.exports = {
    createAcceptanceByMistake,
    createDevolution,
    createMistreatment
};
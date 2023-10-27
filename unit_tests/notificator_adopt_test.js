const { notificatorUndoAdopt } = require('../notificators/notificator_adopt');
const { 
  createAcceptanceByMistake,
  createDevolution,
  createMistreatment
} = require('../notificators/subjects_reasons');

const express = require('express');
const router = express.Router();

var adopt = {
        animal: {
          urlImageAnimal: "url da imagem",
          animalName: "Nome",
          specie: "animal",
          race: "sem raça",
          age: "2",
          specialCondition: "muito bem de saúde",
          sex: "male",
          _id: "6538942427335d080b1163ac"
        },
        adopter: {
          urlImageAdopter: "",
          adopterName: "Nome do tutor 2",
          cpf: "Cpf do tutor2",
          rg: "RG do tutor",
          age: "idade do tutor",
          road: "rua do endereço",
          numberHouse: "numero da casa",
          neighborhood: "bairro",
          city: "Cidade",
          state: "Estado",
          telephone: "telephone",
          email: "allan_b95@outlook.com",
          _id: "6539312c5177eea93b173027"
        },
        _id: "653aa2b9dc888a279ee1eb4f"
      };


async function notificatorUndoAdoptTest() {

    const subjectReasonOne = createAcceptanceByMistake("Nome do animal");
    const subjectReasonTwo = createDevolution("Nome do animal", "nome da ONG");
    const subjectReasonThree = createMistreatment("Nome do animal");

    await notificatorUndoAdopt(
        'nome da ONG',
        adopt,
        subjectReasonOne
    );
}

router.get('/undo_adopt_test', async (req, res) => {
    await notificatorUndoAdoptTest();
    res.send('Teste de notificação de desistência de adoção realizado.');
});

module.exports = router;
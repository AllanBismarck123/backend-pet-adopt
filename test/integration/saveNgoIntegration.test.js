const { ModelNgoClass } = require('../../models/model_ngo');
const { notificatorWelcomeNgo } = require('../../notificators/notificator_ngo');
const { saveNgo } = require('../../db_manager/db_client_ngo_mongo');

describe('saveNgo Integration', () => {

  it('deve salvar uma ONG com sucesso e notificar', async () => {
    const fakeData = {
      ngoName: 'ONG Test',
      email: 'test@example.com',
      animals: [],
      adopts: [],
      requestsAdopts: []
    };

    // Mock para ModelNgoClass.createCollection
    ModelNgoClass.createCollection = jest.fn().mockResolvedValue();

    // Mock para ModelNgoClass.prototype.save
    ModelNgoClass.prototype.save = jest.fn().mockResolvedValue({ _id: 'fakeId' });

    const notificatorWelcomeNgoMock = jest.fn();

    notificatorWelcomeNgoMock();

    // Chama a função saveNgo
    const result = await saveNgo(fakeData);

    // Verificações
    expect(ModelNgoClass.createCollection).toHaveBeenCalledTimes(1);
    expect(ModelNgoClass.prototype.save).toHaveBeenCalledTimes(1);
    expect(notificatorWelcomeNgoMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ statusCode: 201, msg: 'ONG cadastrada com sucesso.' });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve lidar com erro ao salvar ONG', async () => {
    // Dados fictícios
    const fakeData = {
      ngoName: 'ONG Test',
      email: 'test@example.com',
      animals: [],
      adopts: [],
      requestsAdopts: [],
    };

    // Mock para ModelNgoClass.createCollection retornando um erro
    ModelNgoClass.createCollection.mockRejectedValue(new Error('Erro ao criar coleção'));

    // Chama a função saveNgo
    const result = await saveNgo(fakeData);

    // Verificações
    expect(ModelNgoClass.createCollection).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ statusCode: 500, msg: 'Erro ao cadastrar ONG.' });
  });
});
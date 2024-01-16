const { saveNgo } = require('../../db_manager/db_client_ngo_mongo');
const { ModelNgoClass } = require('../../models/model_ngo');

describe('saveNgo Unit', () => {
    it('deve salvar uma ONG com sucesso', async () => {
        const fakeData = {
            ngoName: 'ONG Test',
            email: 'test@example.com',
            animals: [],
            adopts: [],
            requestsAdopts: [],
        };

        ModelNgoClass.createCollection = jest.fn().mockResolvedValue();

        const result = await saveNgo(fakeData);

        // Verificações
        expect(ModelNgoClass.createCollection).toHaveBeenCalledTimes(1);
    }, 15000);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve lidar com erro ao salvar ONG', async () => {
        const fakeData = {
            ngoName: 'ONG Test',
            email: 'test@example.com',
            animals: [],
            adopts: [],
            requestsAdopts: [],
        };

        // Simula um erro ao criar a coleção
        ModelNgoClass.createCollection.mockRejectedValue(new Error('Erro ao criar coleção'));

        const result = await saveNgo(fakeData);

        // Verificações
        expect(ModelNgoClass.createCollection).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ statusCode: 500, msg: 'Erro ao cadastrar ONG.' });
    });
});

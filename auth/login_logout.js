const { ModelNgoClass } = require('../models/model_ngo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.key' });

async function login(email, password) {
    try {

        const ngo = await ModelNgoClass.findOne({ email });

        if (!ngo) {
            return { statusCode: 401, msg: 'Email ou senha inválidas.' };
        }

        const isPasswordValid = await bcrypt.compare(password, ngo.password);

        if (!isPasswordValid) {
            return { statusCode: 401, msg: 'Email ou senha inválidas.' };
        }

        const token = jwt.sign({ _id: ngo._id.toString() }, process.env.JWT_SECRET);

        ngo.tokens = ngo.tokens.concat({ token });
        await ngo.save();

        return { statusCode: 200, msg: token };
    } catch (error) {
        return { statusCode: 500, msg: 'Erro ao fazer login.' };
    }
};

async function logout(token) {
    try {
        var ngo = await ModelNgoClass.findOne({ 'tokens.token': token }).exec();
    
        if(ngo == null) {
            return { statusCode: 404, msg: 'ONG não encontrada.' };
        }

        const index = ngo.tokens.findIndex((DestToken) => DestToken.toString() === token.toString());

        ngo.tokens.splice(index, 1);
        await ngo.save();

        return { statusCode: 200, msg: "Logout realizado com sucesso."};
    } catch (error) {
        return { statusCode: 500, msg: "Erro ao fazer logout."};
    }

}

async function resetPassword(token, newPassword, oldPassword) {

    try {
        if (oldPassword) {
            const ngo = await ModelNgoClass.findOne({ 'tokens.token': token }).exec();
            
            if (!ngo) {
                return { statusCode: 400, msg: 'Token inválido.' };
            }
    
            const isOldPasswordValid = await bcrypt.compare(oldPassword, ngo.password);
    
            if (!isOldPasswordValid) {
                return { statusCode: 401, msg: 'Senha atual incorreta.' };
            }
        }
      
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const ngo = await ModelNgoClass.findOneAndUpdate({ 'tokens.token': token }, { password: hashedPassword, resetToken: null }).exec();
      
        if (ngo) {
          return { statusCode: 200, msg: 'Senha redefinida com sucesso.' };
        } else {
          return { statusCode: 400, msg: 'Token inválido.' };
        }
    } catch(error) {
        return { statusCode: 500, msg: 'Erro ao redefinir senha.'};
    }
}

module.exports = {
    login,
    logout,
    resetPassword
};
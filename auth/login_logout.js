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

        console.log('login', token);

        return { statusCode: 200, msg: token };
    } catch (error) {
        return { statusCode: 500, msg: 'Erro ao fazer login.' };
    }
};

async function logout(res, authToken) {
    try {

        const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);

        res.clearCookie('token');

        return { statusCode: 200, msg: 'Logout bem-sucedido.' };
    } catch (error) {
        if(error.name == 'JsonWebTokenError') {
            return { statusCode: 401, msg: 'Usuário não autenticado.' };
        } else {
            console.error('Erro no logout:', error);
            return { statusCode: 500, msg: 'Erro no logout.' };
        }
    }
};

async function resetPassword(token, newPassword) {
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const ngo = await ModelNgoClass.findOneAndUpdate({ resetToken: token }, { password: hashedPassword, resetToken: null });
  
    if (ngo) {
      return { statusCode: 200, msg: 'Senha redefinida com sucesso.' };
    } else {
      return { statusCode: 400, error: 'Token inválido.' };
    }
  }

module.exports = {
    login,
    logout,
    resetPassword
};
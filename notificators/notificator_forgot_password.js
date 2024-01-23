const { sendEmails } = require('./notificator_config_email');

async function notificatorForgotPassword(email, site) {
    try {
        const subject = 'Redefinição de Senha - Plataforma de Adoção de Animais';

        const text = `
            Prezado Usuário,

            Recebemos uma solicitação para redefinir a senha da sua conta na Plataforma de Adoção de Animais.
            Se você não fez essa solicitação, pode ignorar este e-mail.

            Para redefinir sua senha, clique no link abaixo:
            ${site}

            O link expirará em 1 hora. Se você não redefinir sua senha dentro desse período, será necessário fazer uma nova solicitação.

            Se você tiver alguma dúvida ou precisar de assistência, nossa equipe está aqui para ajudar. Sinta-se à vontade para entrar em contato a qualquer momento.
        `;

        const html = `
        <!DOCTYPE html>
        <html>
      
        <head>
            <title>Redefinição de Senha - Plataforma de Adoção de Animais</title>
        </head>
      
        <body>
            <p>
                <strong>Prezado Usuário,</strong>
            </p>
      
            <p>
                Recebemos uma solicitação para redefinir a senha da sua conta na Plataforma de Adoção de Animais.
                Se você não fez essa solicitação, pode ignorar este e-mail.
            </p>
      
            <p>
                Para redefinir sua senha, clique <a href="${site}" style="display:inline-block; padding: 5px 10px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">aqui</a> com o botão direito e escolha "Abrir link em nova guia".
            </p>
      
            <p>
                O link expirará em 1 hora. Se você não redefinir sua senha dentro desse período, será necessário fazer uma nova solicitação.
            </p>
      
            <p>
                Se você tiver alguma dúvida ou precisar de assistência, nossa equipe está aqui para ajudar. Sinta-se à vontade para entrar em contato a qualquer momento.
            </p>
        </body>
      
        </html>
        `;

        await sendEmails("", subject, text, html, email, true);
    } catch (error) {
        console.error('Erro ao notificar sobre a redefinição de senha:', error);
        throw error;
    }
}

module.exports = { notificatorForgotPassword };
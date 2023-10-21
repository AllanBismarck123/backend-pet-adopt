async function notificatorWelcomeNgo(ngoName, userEmail) {
    try {
        var subject = 'Bem-vindo à Plataforma de Adoção de Animais';
    
        var text = `
            Prezado(a) ${ngoName},
      
            Bem-vindo(a) à nossa plataforma de adoção de animais. Agradecemos por se juntar a nós e por seu comprometimento em fornecer um lar amoroso a animais necessitados.
            
            Nossa plataforma oferece uma maneira eficiente e acessível de gerenciar as adoções, conectar-se com tutores em potencial e fazer a diferença na vida de animais.
            
            Se você tiver alguma dúvida ou precisar de assistência para começar, nossa equipe está aqui para ajudar. Sinta-se à vontade para entrar em contato a qualquer momento.
            
            Obrigado por ser parte da nossa missão de salvar vidas de animais.
            
            Atenciosamente,
            [Notificador de E-mails]
            [Assistente de Adoção]
            ${ngoName}
        `;
    
        var html = `
        <!DOCTYPE html>
        <html>
      
        <head>
            <title>Bem-vindo à Plataforma de Adoção de Animais</title>
        </head>
      
        <body>
            <p>
                <strong>Prezado(a) ${ngoName},</strong>
            </p>
      
            <p>
                Bem-vindo(a) à nossa plataforma de adoção de animais. Agradecemos por se juntar a nós e por seu comprometimento em fornecer um lar amoroso a animais necessitados.
            </p>
      
            <p>
                Nossa plataforma oferece uma maneira eficiente e acessível de gerenciar as adoções, conectar-se com tutores em potencial e fazer a diferença na vida de animais.
            </p>
      
            <p>
                Se você tiver alguma dúvida ou precisar de assistência para começar, nossa equipe está aqui para ajudar. Sinta-se à vontade para entrar em contato a qualquer momento.
            </p>
      
            <p>Atenciosamente,<br>
                <em>Notificador de E-mails</em><br>
                <em>Assistente de Adoção</em><br>
                ${ngoName}
            </p>
        </body>
      
        </html>
        `;
    
        await sendEmails(ngoName, subject, text, html, userEmail);
    } catch (error) {
        console.error('Erro ao notificar sobre a criação de usuário:', error);
        throw error;
    }
}

async function notificatorEditNgo(ngoName, userEmail) {
    try {
        var subject = 'Atenção: Edição de dados';
    
        var text = `
            Prezado(a) ${ngoName},
      
            Seus dados foram atualizados com sucesso.
            
            Se você tiver alguma dúvida ou precisar de assistência para começar, nossa equipe está aqui para ajudar. Sinta-se à vontade para entrar em contato a qualquer momento.
            
            Obrigado por ser parte da nossa missão de salvar vidas de animais.
            
            Atenciosamente,
            [Notificador de E-mails]
            [Assistente de Adoção]
            ${ngoName}
        `;
    
        var html = `
        <!DOCTYPE html>
        <html>
      
        <head>
            <title>Atenção: Edição de dados</title>
        </head>
      
        <body>
            <p>
                <strong>Prezado(a) ${ngoName},</strong>
            </p>
      
            <p>
                Seus dados foram atualizados com sucesso.
            </p>
      
            <p>
                Se você tiver alguma dúvida ou precisar de assistência para começar, nossa equipe está aqui para ajudar. Sinta-se à vontade para entrar em contato a qualquer momento.
            </p>
      
            <p>Atenciosamente,<br>
                <em>Notificador de E-mails</em><br>
                <em>Assistente de Adoção</em><br>
                ${ngoName}
            </p>
        </body>
      
        </html>
        `;
    
        await sendEmails(ngoName, subject, text, html, userEmail);
    } catch (error) {
        console.error('Erro ao notificar sobre a edição de usuário:', error);
        throw error;
    }
}

async function notificatorUserDelete(ngoId, userName, userEmail) {
    try {
        // Primeiro, leia a ONG pelo ID
        const ngo = await readUserById(ngoId);

        // Verifique se a ONG foi encontrada
        if (!ngo) {
            throw new Error('ONG não encontrada.');
        }

        const subject = 'Usuário Deletou Sua Conta na Plataforma de Adoção de Animais';
        const text = `
            Prezado(a) ${ngo.ngoName},

            Queremos informar que o usuário ${userName} (${userEmail}) deletou sua conta na nossa plataforma de adoção de animais.

            Por favor, esteja ciente dessa alteração em seu sistema.

            Se você tiver alguma dúvida ou precisar de assistência relacionada a essa ação, não hesite em entrar em contato conosco.

            Atenciosamente,
            Notificador de E-mails
            Assistente de Adoção
            ${ngo.ngoName}
        `;

        const html = `
            <!DOCTYPE html>
            <html>

            <head>
                <title>Usuário Deletou Sua Conta</title>
            </head>

            <body>
                <p>
                    <strong>Prezado(a) ${ngo.ngoName},</strong>
                </p>

                <p>
                    Queremos informar que o usuário ${userName} (${userEmail}) deletou sua conta na nossa plataforma de adoção de animais.
                </p>

                <p>
                    Por favor, esteja ciente dessa alteração em seu sistema.
                </p>

                <p>
                    Se você tiver alguma dúvida ou precisar de assistência relacionada a essa ação, não hesite em entrar em contato conosco.
                </p>

                <p>Atenciosamente,<br>
                    <em>Notificador de E-mails</em><br>
                    <em>Assistente de Adoção</em><br>
                    ${ngo.ngoName}
                </p>
            </body>

            </html>
        `;

        // Envie o e-mail de notificação
        await sendEmails(ngo.ngoName, subject, text, html, ngo.email);

    } catch (error) {
        console.error('Erro ao notificar sobre a exclusão de usuário:', error);
        throw error;
    }
}

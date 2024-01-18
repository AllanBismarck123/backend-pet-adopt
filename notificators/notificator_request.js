const { sendEmails, afterEmail, afterEmailHtml } = require('./notificator_config_email');

async function notificatorSendRequestAdopter(ngoName, adopterName, adopterEmail, animalName) {
    try {
      
        var subject = 'Solicitação de Adoção de Animal';
      
        var text = `
          Prezado [${adopterName}],
      
          Obrigado por demonstrar interesse em adotar um animal em nossa plataforma de adoção de animais. Valorizamos seu comprometimento em fornecer um lar amoroso a um de nossos animais necessitados.
          
          Sua solicitação para adotar [${animalName}] foi recebida e encaminhada para a ONG [${ngoName}]. Eles entrarão em contato com você em breve para discutir os próximos passos do processo de adoção.
          
          Enquanto isso, sinta-se à vontade para verificar nossa plataforma para obter informações sobre os cuidados com animais e como preparar seu lar para receber um novo membro da família peludo.
          
          Obrigado por escolher a adoção e por fazer a diferença na vida de um animal.
          
          ${afterEmail(ngoName)}
        `;
      
        var html = `
        <!DOCTYPE html>
        <html>
        
        <head>
            <title>Confirmação de Solicitação de Adoção</title>
        </head>
        
        <body>
            <p>Prezado <strong>[${adopterName}]</strong>,</p>
        
            <p>Obrigado por demonstrar interesse em adotar um animal em nossa plataforma de adoção de animais. Valorizamos seu comprometimento em fornecer um lar amoroso a um de nossos animais necessitados.</p>
        
            <p>Sua solicitação para adotar <strong>[${animalName}]</strong> foi recebida e encaminhada para a ONG <strong>[${ngoName}]</strong>. Eles entrarão em contato com você em breve para discutir os próximos passos do processo de adoção.</p>
        
            <p>Enquanto isso, sinta-se à vontade para verificar nossa plataforma para obter informações sobre os cuidados com animais e como preparar seu lar para receber um novo membro da família peludo.</p>
        
            <p>Obrigado por escolher a adoção e por fazer a diferença na vida de um animal.</p>
        
            ${afterEmailHtml(ngoName)}
        </body>
        
        </html>  
        `;
      
        await sendEmails(ngoName, subject, text, html, adopterEmail, false);
    } catch (error) {
        console.error('Erro ao notificar sobre a solicitação de adoção ao tutor:', error);
        throw error;
    }
  
  }
  
  async function notificatorSendRequestNgo(ngoName, ngoEmail, adopterName, animalName) {
    try {
      
        var subject = 'Nova Solicitação de Adoção';
      
        var text = `
          Prezados Membros da Equipe da ONG [${ngoName}],
      
          Gostaríamos de informar que uma nova solicitação de adoção foi recebida em nossa plataforma. O usuário [${adopterName}] demonstrou interesse em adotar o animal [${animalName}] sob os cuidados da nossa organização.
          
          Agradecemos por seu incrível trabalho em cuidar dos animais e fornecer a eles um ambiente seguro e amoroso. Por favor, entre em contato com o usuário [${adopterName}] o mais rápido possível para discutir os detalhes da adoção e agendar uma visita, se necessário.
          
          Lembramos que a segurança e o bem-estar do animal são nossa prioridade. Certifique-se de seguir nossos procedimentos padrão de adoção e garantir que o novo lar seja adequado para o animal.
          
          Se você tiver alguma dúvida ou precisar de assistência adicional, não hesite em entrar em contato conosco.
          
          Obrigado por tudo o que você faz para ajudar nossos animais necessitados.
          
          ${afterEmail(ngoName)}
        `;
      
        var html = `
        <!DOCTYPE html>
        <html>
      
        <head>
            <title>Nova Solicitação de Adoção</title>
        </head>
      
        <body>
            <p>Prezados Membros da Equipe da ONG <strong>[${ngoName}]</strong>,</p>
      
            <p>Gostaríamos de informar que uma nova solicitação de adoção foi recebida em nossa plataforma. O usuário <strong>[${adopterName}]</strong> demonstrou interesse em adotar o animal <strong>[${animalName}]</strong> sob os cuidados da nossa organização.</p>
      
            <p>Agradecemos por seu incrível trabalho em cuidar dos animais e fornecer a eles um ambiente seguro e amoroso. Por favor, entre em contato com o usuário <strong>[${adopterName}]</strong> o mais rápido possível para discutir os detalhes da adoção e agendar uma visita, se necessário.</p>
      
            <p>Lembramos que a segurança e o bem-estar do animal são nossa prioridade. Certifique-se de seguir nossos procedimentos padrão de adoção e garantir que o novo lar seja adequado para o animal.</p>
      
            <p>Se você tiver alguma dúvida ou precisar de assistência adicional, não hesite em entrar em contato conosco.</p>
      
            <p>Obrigado por tudo o que você faz para ajudar nossos animais necessitados.</p>
      
            ${afterEmailHtml(ngoName)}
        </body>
      
        </html>
        `;
      
        await sendEmails(ngoName, subject, text, html, ngoEmail, false);
    } catch (error) {
        console.error('Erro ao notificar sobre a solicitação de adoção do tutor à ONG:', error);
        throw error;
    }
  
  }

  module.exports = {
    notificatorSendRequestAdopter,
    notificatorSendRequestNgo
  }
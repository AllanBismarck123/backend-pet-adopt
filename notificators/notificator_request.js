const { sendEmails, afterEmail, afterEmailHtml } = require('./notificator_config_email');

const { readNgoById } = require('../db_manager/db_client_ngo_mongo');
const { readAnimalById } = require('../db_manager/db_client_animals');

async function notificatorSendRequestAdopter(request, ngoId) {
    try {
        var animal = await readAnimalById(ngoId, request.animalId);
        var ngo = await readNgoById(ngoId).msg;
      
        var subject = 'Solicitação de Adoção de Animal';
      
        var text = `
          Prezado [${request.adopter.adopterName}],
      
          Obrigado por demonstrar interesse em adotar um animal em nossa plataforma de adoção de animais. Valorizamos seu comprometimento em fornecer um lar amoroso a um de nossos animais necessitados.
          
          Sua solicitação para adotar [${animal.animalName}] foi recebida e encaminhada para a ONG [${ngo.ngoName}]. Eles entrarão em contato com você em breve para discutir os próximos passos do processo de adoção.
          
          Enquanto isso, sinta-se à vontade para verificar nossa plataforma para obter informações sobre os cuidados com animais e como preparar seu lar para receber um novo membro da família peludo.
          
          Obrigado por escolher a adoção e por fazer a diferença na vida de um animal.
          
          ${afterEmail(ngo.ngoName)}
        `;
      
        var html = `
        <!DOCTYPE html>
        <html>
        
        <head>
            <title>Confirmação de Solicitação de Adoção</title>
        </head>
        
        <body>
            <p>Prezado <strong>[${request.adopter.adopterName}]</strong>,</p>
        
            <p>Obrigado por demonstrar interesse em adotar um animal em nossa plataforma de adoção de animais. Valorizamos seu comprometimento em fornecer um lar amoroso a um de nossos animais necessitados.</p>
        
            <p>Sua solicitação para adotar <strong>[${animal.animalName}]</strong> foi recebida e encaminhada para a ONG <strong>[${ngo.ngoName}]</strong>. Eles entrarão em contato com você em breve para discutir os próximos passos do processo de adoção.</p>
        
            <p>Enquanto isso, sinta-se à vontade para verificar nossa plataforma para obter informações sobre os cuidados com animais e como preparar seu lar para receber um novo membro da família peludo.</p>
        
            <p>Obrigado por escolher a adoção e por fazer a diferença na vida de um animal.</p>
        
            ${afterEmailHtml(ngo.ngoName)}
        </body>
        
        </html>  
        `;
      
        await sendEmails(ngo.ngoName, subject, text, html, request.adopter.email, false);
    } catch (error) {
        console.error('Erro ao notificar sobre a solicitação de adoção ao tutor:', error);
        throw error;
    }
  
  }
  
  async function notificatorSendRequestNgo(request, ngoId) {
    try {
        var animal = await readAnimalById(ngoId, request.animalId);
        var ngo = await readNgoById(ngoId).msg;
      
        var subject = 'Nova Solicitação de Adoção';
      
        var text = `
          Prezados Membros da Equipe da ONG [${ngo.ngoName}],
      
          Gostaríamos de informar que uma nova solicitação de adoção foi recebida em nossa plataforma. O usuário [${request.adopter.adopterName}] demonstrou interesse em adotar o animal [${animal.animalName}] sob os cuidados da nossa organização.
          
          Agradecemos por seu incrível trabalho em cuidar dos animais e fornecer a eles um ambiente seguro e amoroso. Por favor, entre em contato com o usuário [${request.adopter.adopterName}] o mais rápido possível para discutir os detalhes da adoção e agendar uma visita, se necessário.
          
          Lembramos que a segurança e o bem-estar do animal são nossa prioridade. Certifique-se de seguir nossos procedimentos padrão de adoção e garantir que o novo lar seja adequado para o animal.
          
          Se você tiver alguma dúvida ou precisar de assistência adicional, não hesite em entrar em contato conosco.
          
          Obrigado por tudo o que você faz para ajudar nossos animais necessitados.
          
          ${afterEmail(ngo.ngoName)}
        `;
      
        var html = `
        <!DOCTYPE html>
        <html>
      
        <head>
            <title>Nova Solicitação de Adoção</title>
        </head>
      
        <body>
            <p>Prezados Membros da Equipe da ONG <strong>[${ngo.ngoName}]</strong>,</p>
      
            <p>Gostaríamos de informar que uma nova solicitação de adoção foi recebida em nossa plataforma. O usuário <strong>[${request.adopter.adopterName}]</strong> demonstrou interesse em adotar o animal <strong>[${animal.animalName}]</strong> sob os cuidados da nossa organização.</p>
      
            <p>Agradecemos por seu incrível trabalho em cuidar dos animais e fornecer a eles um ambiente seguro e amoroso. Por favor, entre em contato com o usuário <strong>[${request.adopter.adopterName}]</strong> o mais rápido possível para discutir os detalhes da adoção e agendar uma visita, se necessário.</p>
      
            <p>Lembramos que a segurança e o bem-estar do animal são nossa prioridade. Certifique-se de seguir nossos procedimentos padrão de adoção e garantir que o novo lar seja adequado para o animal.</p>
      
            <p>Se você tiver alguma dúvida ou precisar de assistência adicional, não hesite em entrar em contato conosco.</p>
      
            <p>Obrigado por tudo o que você faz para ajudar nossos animais necessitados.</p>
      
            ${afterEmailHtml(ngo.ngoName)}
        </body>
      
        </html>
        `;
      
        await sendEmails(ngo.ngoName, subject, text, html, ngo.email, false);
    } catch (error) {
        console.error('Erro ao notificar sobre a solicitação de adoção do tutor à ONG:', error);
        throw error;
    }
  
  }

  module.exports = {
    notificatorSendRequestAdopter,
    notificatorSendRequestNgo
  }
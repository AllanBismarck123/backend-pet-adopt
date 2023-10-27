const { sendEmails, afterEmail, afterEmailHtml } = require('./notificator_config_email');

const { readNgoById } = require('../db_manager/db_client_ngo_mongo');
const { readAnimalById } = require('../db_manager/db_client_animals');

async function notificatorAcceptAdoptAdopter(ngoId, adopt) {
    try {
        var ngo = await readNgoById(ngoId);

        var subject = 'Sua Solicitação de Adoção foi Aceita!';

        var text = `
            Prezado(a) [${adopt.adopter.adopterName}],

            Temos o prazer de informar que sua solicitação de adoção foi aceita pela ONG [${ngo.ngoName}]! Você está prestes a dar um novo lar amoroso a [${adopt.animal.animalName}].

            Parabéns por sua dedicação em adotar um animal necessitado e fazer a diferença em suas vidas. Esta é uma jornada emocionante que trará muita alegria para sua família e para o animal que você está prestes a acolher.

            A equipe da ONG [${ngo.ngoName}] entrará em contato com você em breve para discutir os próximos passos do processo de adoção, incluindo a data e hora para você conhecer seu novo membro da família.

            Enquanto aguarda a adoção, você pode começar a preparar seu lar para receber o [${adopt.animal.animalName}]. Certifique-se de seguir as orientações de cuidado e atenção necessárias para garantir uma transição suave.

            Agradecemos por escolher a adoção e por abrir seu coração e lar para um animal em necessidade.

            Se você tiver alguma dúvida ou precisar de informações adicionais, não hesite em entrar em contato conosco.

            Parabéns novamente e obrigado por tornar um animal feliz!

            ${afterEmail(ngo.ngoName)}
            `;

        var html = `
            <!DOCTYPE html>
            <html>

                <head>
                    <title>Sua Solicitação de Adoção foi Aceita!</title>
                </head>

                <body>
                    <p><strong>Assunto: Sua Solicitação de Adoção foi Aceita!</strong></p>

                    <p>Prezado(a) [${adopt.adopter.adopterName}],</p>

                    <p>Temos o prazer de informar que sua solicitação de adoção foi aceita pela ONG [${ngo.ngoName}]! Você está prestes a dar um novo lar amoroso a [${adopt.animal.animalName}].</p>

                    <p>Parabéns por sua dedicação em adotar um animal necessitado e fazer a diferença em suas vidas. Esta é uma jornada emocionante que trará muita alegria para sua família e para o animal que você está prestes a acolher.</p>

                    <p>A equipe da ONG [${ngo.ngoName}] entrará em contato com você em breve para discutir os próximos passos do processo de adoção, incluindo a data e hora para você conhecer seu novo membro da família.</p>

                    <p>Enquanto aguarda a adoção, você pode começar a preparar seu lar para receber o [${adopt.animal.animalName}]. Certifique-se de seguir as orientações de cuidado e atenção necessárias para garantir uma transição suave.</p>

                    <p>Agradecemos por escolher a adoção e por abrir seu coração e lar para um animal em necessidade.</p>

                    <p>Se você tiver alguma dúvida ou precisar de informações adicionais, não hesite em entrar em contato conosco.</p>

                    <p>Parabéns novamente e obrigado por tornar um animal feliz!</p>

                    ${afterEmailHtml(ngo.ngoName)}

                </body>

            </html>
        `;

        await sendEmails(ngo.ngoName, subject, text, html, adopt.adopter.email, false);
    } catch (error) {
        console.error('Erro ao notificar sobre a confirmação de adoção ao tutor:', error);
        throw error;
    }

}

async function notificatorAcceptAdoptNgo(ngoId, adopt) {
    try {
        var ngo = await readNgoById(ngoId);

        var subject = 'Confirmação de Aceitação de Solicitação de Adoção';

        var text = `
                        Prezados Membros da Equipe da ONG [${ngo.ngoName}],

                        Gostaríamos de informar que a solicitação de adoção para o animal [${adopt.animal.animalName}] foi aceita. O usuário [${adopt.adopter.adopterName}] demonstrou interesse em adotar o animal e nós aprovamos a solicitação.

                        Agradecemos por seu incrível trabalho em cuidar dos animais e fornecer a eles um ambiente seguro e amoroso. Por favor, entre em contato com o usuário [${adopt.adopter.adopterName}] o mais rápido possível para discutir os detalhes da adoção e agendar uma visita, se necessário.

                        Lembramos que a segurança e o bem-estar do animal são nossa prioridade. Certifique-se de seguir nossos procedimentos padrão de adoção e garantir que o novo lar seja adequado para o animal.

                        Se você tiver alguma dúvida ou precisar de assistência adicional, não hesite em entrar em contato conosco.

                        Obrigado por tudo o que você faz para ajudar nossos animais necessitados.

                        ${afterEmail(ngo.ngoName)}
                        `;

        var html = `
                        <!DOCTYPE html>
                        <html>

                            <head>
                                <title>Confirmação de Aceitação de Solicitação de Adoção</title>
                            </head>

                            <body>
                                <p>
                                    <strong>Prezados Membros da Equipe da ONG [${ngo.ngoName}],</strong>
                                </p>

                                <p>
                                    Gostaríamos de informar que a solicitação de adoção para o animal <strong>[${adopt.animal.animalName}]</strong> foi aceita. O usuário <strong>[${adopt.adopter.adopterName}]</strong> demonstrou interesse em adotar o animal e nós aprovamos a solicitação.
                                </p>

                                <p>
                                    Agradecemos por seu incrível trabalho em cuidar dos animais e fornecer a eles um ambiente seguro e amoroso. Por favor, entre em contato com o usuário <strong>[${adopt.adopter.adopterName}]</strong> o mais rápido possível para discutir os detalhes da adoção e agendar uma visita, se necessário.
                                </p>

                                <p>
                                    Lembramos que a segurança e o bem-estar do animal são nossa prioridade. Certifique-se de seguir nossos procedimentos padrão de adoção e garantir que o novo lar seja adequado para o animal.
                                </p>

                                <p>
                                    Se você tiver alguma dúvida ou precisar de assistência adicional, não hesite em entrar em contato conosco.
                                </p>

                                <p>
                                    Obrigado por tudo o que você faz para ajudar nossos animais necessitados.
                                </p>

                                ${afterEmailHtml(ngo.ngoName)}

                            </body>

                        </html>
                    `;

        await sendEmails(ngo.ngoName, subject, text, html, ngo.email, false);
    } catch (error) {
        console.error('Erro ao notificar sobre a confirmação de adoção à ONG:', error);
        throw error;
    }

}

async function notificatorRejectAdopt(ngoId, request) {
    try {
        var animal = await readAnimalById(ngoId, request.animalId);
        var ngo = await readNgoById(ngoId);

        var subject = 'Recusa da Solicitação de Adoção para [Nome do Animal]';

        var text = `
                    Prezado [${request.adopter.adopterName}],

                    Lamentamos informar que sua solicitação de adoção para o animal [${animal.animalName}] foi recusada pela ONG [${ngo.ngoName}]. Agradecemos por seu interesse em adotar um animal e por considerar a adoção como uma opção.

                    Entendemos que essa notícia pode ser decepcionante, mas a decisão foi baseada em avaliações cuidadosas para garantir o bem-estar do animal. Por favor, não desanime, pois existem muitos outros animais que estão aguardando um lar amoroso.

                    Se você tiver alguma dúvida ou precisar de mais informações, não hesite em entrar em contato com a ONG [${ngo.ngoName}].

                    Agradecemos por seu comprometimento com a causa da adoção de animais e por considerar fazer a diferença na vida de um animal necessitado.

                    ${afterEmail(ngo.ngoName)}
                `;

        var html = `
                <!DOCTYPE html>
                <html>

                    <head>
                        <title>Recusa de Solicitação de Adoção</title>
                    </head>

                    <body>
                        <p>
                            <strong>Prezado(a) [${request.adopter.adopterName}],</strong>
                        </p>

                        <p>
                            Lamentamos informar que sua solicitação para adotar o animal <strong>[${animal.animalName}]</strong> foi recusada. A ONG [${ngo.ngoName}] revisou sua solicitação, mas, infelizmente, não podemos prosseguir com a adoção neste momento.
                        </p>

                        <p>
                            Continuamos valorizando seu comprometimento em fornecer um lar amoroso a animais necessitados. Por favor, não desanime. Outros animais aguardam adoção e podem ser a combinação perfeita para você.
                        </p>

                        <p>
                            Agradecemos seu interesse e apoio à causa da adoção de animais. Se você tiver alguma dúvida ou precisar de mais informações, não hesite em entrar em contato conosco.
                        </p>

                        ${afterEmailHtml(ngo.ngoName)}
                    </body>

                </html>
                    `;

        await sendEmails(ngo.ngoName, subject, text, html, request.adopter.email, false);
    } catch (error) {
        console.error('Erro ao notificar sobre a rejeição da solicitação de adoção ao tutor:', error);
        throw error;
    }

}

async function notificatorUndoAdopt(ngoName, adopt, subjectReason) {
    try {
        var animal = adopt.animal;
    
        var subject = `${subjectReason.subject} do Animal [${animal.animalName}]`;
    
        var text = `
            Prezado(a) [${adopt.adopter.adopterName}],
    
            Gostaríamos de informar que houve uma alteração na adoção do animal [${animal.animalName}] sob os cuidados da ONG [${ngoName}].
    
            [${subjectReason.reason}].
    
            Se você tiver alguma dúvida ou precisar de mais informações sobre essa situação, não hesite em entrar em contato conosco. O nosso objetivo principal é o cuidado e segurança dos animais.
    
            Agradecemos por seu comprometimento com a causa da adoção de animais e por considerar fazer a diferença na vida de um animal necessitado.
    
            ${afterEmail(ngoName)}
        `;
    
        var html = `
            <!DOCTYPE html>
            <html>
    
            <head>
                <title>${subjectReason.subject} do Animal ${animal.animalName}</title>
            </head>
    
            <body>
                <p>
                    <strong>Prezado(a) [${adopt.adopter.adopterName}],</strong>
                </p>
    
                <p>
                    Gostaríamos de informar que houve uma alteração na adoção do animal <strong>[${animal.animalName}]</strong> sob os cuidados da ONG <strong>[${ngoName}]</strong>.
                </p>
    
                <p>
                    [${subjectReason.reason}].
                </p>
    
                <p>
                    Se você tiver alguma dúvida ou precisar de mais informações sobre essa situação, não hesite em entrar em contato conosco. O nosso objetivo principal é o cuidado e segurança dos animais.
                </p>
    
                ${afterEmailHtml(ngoName)}
            </body>
    
            </html>
        `;
    
        await sendEmails(ngoName, subject, text, html, adopt.adopter.email, false);
    } catch (error) {
        console.error('Erro ao notificar sobre a alteração na adoção ao tutor:', error);
        throw error;
    }
    
}

module.exports = {
    notificatorAcceptAdoptAdopter,
    notificatorAcceptAdoptNgo,
    notificatorRejectAdopt,
    notificatorUndoAdopt
};  
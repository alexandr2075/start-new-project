import {nodemailerService} from "../adapters/nodemailer";
import {UUID} from "node:crypto";

export const businessService = {

    async sendConfirmationCodeToEmail(email: string, confCode: UUID) {

        const htmlEmail = `<h1>Thanks for your registration</h1>
                           <p>To finish registration please follow the link below:
                           <a href="https://it-incubator.io/confirm-email?code=${confCode}">complete registration</a>
                           </p>`;

        const info = await nodemailerService.sendEmail(//отправить сообщение на почту юзера с кодом подтверждения
            email,
            htmlEmail
        ).catch((error) => {
            console.log('error in nodemailer:', error)
        })
    }
}

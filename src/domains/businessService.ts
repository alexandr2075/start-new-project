import {nodemailerService} from "../adapters/nodemailer";

export const businessService = {

    async sendCodeToEmail(email: string, htmlEmail: string) {

        nodemailerService.sendEmail(//отправить сообщение на почту юзера с кодом подтверждения
            email,
            htmlEmail
        ).catch((error) => {
            console.log('error in nodemailer:', error)
        })
    }
}

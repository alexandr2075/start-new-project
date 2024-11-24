import {SETTINGS} from "../settings";

const nodemailer = require("nodemailer");

export const nodemailerService = {

    async sendEmail(email: string, template: string) {
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: SETTINGS.SENDER_EMAIL,
                    pass: SETTINGS.SENDER_PASSWORD,
                },
            });

            const info = await transporter.sendMail({
                from: `Good boy <${SETTINGS.SENDER_EMAIL}>`,
                to: email,
                subject: "Hello ✔",
                html: template,
            });

            console.log(`Message sent: ${info.messageId}`);
            return info
        } catch (error) {
            console.log('console', error);

        }
    }

}

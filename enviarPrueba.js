require('dotenv').config();
const nodemailer = require('nodemailer');

async function enviarCorreoPrueba() {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_USER,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN
        }
    });

    const htmlContent = `
        <h1 style="color: #d1b17b;">Prueba de Email HTML desde Espacio Carus</h1>
        <p>Este es un email de prueba para verificar el formato <strong>HTML</strong>.</p>
        <p>Si ves este texto en negrita, ¡funciona!</p>
        <p>📞 Teléfono: <a href="tel:+34635826520">635 82 65 20</a></p>
        <p>📧 Email: <a href="mailto:espaciocarus@gmail.com">espaciocarus@gmail.com</a></p>
        <p>💛 Gracias por confiar en Espacio Carus.</p>
    `;

    try {
        await transporter.sendMail({
            from: `"Espacio Carus" <${process.env.EMAIL_USER}>`,
            to: 'ramongomeznunez1@gmail.com',
            subject: 'Prueba de Email HTML - Espacio Carus',
            html: htmlContent
        });

        console.log('Correo enviado correctamente');
    } catch (error) {
        console.error('Error enviando el correo:', error);
    }
}

enviarCorreoPrueba();

require('dotenv').config();
const nodemailer = require('nodemailer');

async function enviarPrueba() {
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

    try {
        const info = await transporter.sendMail({
            from: `"Espacio Carus" <${process.env.EMAIL_USER}>`,
            to: 'ramongomeznunez1@gmail.com',  // Cambia por el correo al que quieres enviar
            subject: '✅ Prueba Gmail OAuth2 - Espacio Carus',
            html: `
                <h1 style="color:#d1b17b;">Prueba Exitosa</h1>
                <p>Este es un <strong>email HTML</strong> enviado usando OAuth2 con Gmail.</p>
                <p>Si ves el formato, ¡ya funciona correctamente!</p>
            `
        });

        console.log('Correo enviado:', info.response);
    } catch (error) {
        console.error('Error al enviar:', error);
    }
}

enviarPrueba();

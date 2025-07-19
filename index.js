require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

async function checkAvailability(startTime, endTime) {
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const res = await calendar.events.list({
        calendarId: process.env.CALENDAR_ID,
        timeMin: startTime,
        timeMax: endTime,
        singleEvents: true,
        orderBy: 'startTime'
    });

    return res.data.items.length === 0;
}

async function createEvent(event) {
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    return await calendar.events.insert({
        calendarId: process.env.CALENDAR_ID,
        resource: event
    });
}

async function sendEmail(to, subject, text) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: `"Espacio Carus" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text
    });
}

app.post('/reservar', async (req, res) => {
    console.log('Petición recibida:', req.body);

    const { nombre, email, tratamiento, telefono, fecha, hora } = req.body;
    const startDateTime = new Date(`${fecha}T${hora}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

    try {
        const disponible = await checkAvailability(startDateTime.toISOString(), endDateTime.toISOString());

        if (!disponible) {
            return res.status(409).send('Hora no disponible');
        }

        const event = {
            summary: `${nombre} - ${tratamiento}`,
            description: `Teléfono: ${telefono}\nEmail: ${email}`,
            start: { dateTime: startDateTime.toISOString() },
            end: { dateTime: endDateTime.toISOString() }
        };

        await createEvent(event);

        await sendEmail(email, 'Confirmación de Reserva - Espacio Carus',
            `Hola ${nombre}, tu reserva para ${tratamiento} el ${fecha} a las ${hora} ha sido confirmada.`);

        res.send('Reserva confirmada');
    } catch (err) {
        console.error('Error en la reserva:', err);
        res.status(500).send('Error al reservar');
    }
});

// puerto 4000
app.listen(4000, () => console.log('Servidor funcionando en puerto 4000'));


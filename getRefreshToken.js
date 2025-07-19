const { google } = require('googleapis');
require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
});

console.log('Abre este enlace en tu navegador y acepta los permisos:\n');
console.log(authUrl);

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

readline.question('\nPega aquí el código que te da Google: ', async (code) => {
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        console.log('\nTU REFRESH TOKEN ES:\n');
        console.log(tokens.refresh_token);
    } catch (error) {
        console.error('Error al obtener el refresh token', error);
    }
    readline.close();
});

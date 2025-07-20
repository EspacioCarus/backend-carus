require('dotenv').config();
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
);

const SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/gmail.send'
];

const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
});

console.log('Autoriza esta URL en tu navegador:', authUrl);

// Luego sigue el proceso para obtener el código, y ejecuta el siguiente paso manualmente:
getToken('4/0AVMBsJhnPAeK0Kf9uqrJqEiYDZ5rVPs_na1YRh5vKDu-BrLXn3C5fzUjhMi6iPj52J1EGQ');


async function getToken(code) {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log('Tu nuevo refresh token es:', tokens.refresh_token);
}


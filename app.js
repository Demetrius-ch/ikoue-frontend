const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = 3000;
const nodemailer = require('nodemailer');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//configuration du tranporteur SMTP (FAKeSMTP)
const transporter = nodemailer.createTransport({
    host: 'localhost',    // FakeSMTP écoute sur localhost
    port: 1025,           // Port configuré dans FakeSMTP
    secure: false,        // Pas de SSL pour FakeSMTP
    tls: {
        rejectUnauthorized: false
    }
});
//Page HTML pour recueillir les informations
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="fontawesome-free-6.5.2-web/css/all.min.css">
        <link rel="stylesheet" href="style.css">
        <title>Formulaire de Contact</title>
    </head>
    <body>
        <form action="/send" method="POST">
            <h1>Contact us</h1>
            <div class="separation"></div>
            <div class="corps-formulaire">
                <div class="gauche">
                    <div class="groupe">
                        <label>Votre Nom</label>
                        <input name="nom" type="text" >
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="groupe">
                        <label>Votre prénom</label>
                        <input name="prenom" type="text" >
                        <i class="fas fa-user"></i>

                    </div>
                    
                    <div class="groupe">
                        <label>Votre adresse</label>
                        <input name="adresse" type="email" >
                        <i class="fas fa-envelope"></i>
                    </div>
                </div>
                <div class="droite">
                    <div class="groupe">
                        <label>Message</label>
                        <textarea name="message"></textarea>
                    </div>
                </div>
            </div>
            <div class="pied-formulaire" align="center">
                <button type="submit">Envoyer le message</button>
            </div>
        </form>
    </body>
</html>`)
});

// Route POST pour gérer l'envoi du formulaire
app.post('/send', (req, res) => {
    const { name, email, address, message } = req.body;

  // Options de l'email
    const mailOptions = {
        from: email,               // Expéditeur
        to: 'lgdemetrius@gmail.com', 
        subject: `Message de ${name}`,
        text: `Adresse: ${address}\n\nMessage:\n${message}`
    };

    // Envoi de l'email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erreur lors de l\'envoi:', error);
            return res.send('Erreur lors de l\'envoi de l\'email.');
        }
        console.log('Email envoyé:', info.response);
        res.send('Email envoyé avec succès !');
    });
});
// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});

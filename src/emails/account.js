
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)



const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to : email,
        from : 'itarunduhan@gmail.com',
        subject : 'Thanks for joining in!',
        text: `Welcome to the alpha-task-manager app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to : email,
        from : 'itarunduhan@gmail.com',
        subject : `Sorry to see you go!`,
        text : `Goodbye , ${name}. I hope to see back sometime soon.`
    })
}



module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
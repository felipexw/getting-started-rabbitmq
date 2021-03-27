console.log("loading mongoose")
const mongoose = require('mongoose');
console.log("finished loading mongoose")

mongoose.connect('mongodb://localhost/order_db', { useNewUrlParser: true, useUnifiedTopology: true })//
    .then(e => {
        console.log('conectou')
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            console.log("conectado")
        });
    })//
    .catch(error => {
        console.log(error)
    })



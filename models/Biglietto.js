const mongoose = require('mongoose');



const Biglietto = new mongoose.Schema(

    {
        titolo: {
            type: String,
            required: true,

        },
        idUtente:{
            type: String,
            required: true,
        },
        idEvento: {
            type: String,
            required: true,

        },
        immagine: {
            type: String,
            required: true,

        },
        prezzo: {
            type: Number,
            required: true,
        },
        quantita: {
            type: Number,
            required: true,
        }
       


    },
    {
        timestamps: true,
        strict: true,
    }

)

module.exports = mongoose.model('Biglietto', Biglietto, 'Biglietti');
const mongoose = require('mongoose');

const Evento = new mongoose.Schema(
    {
        titolo: {
            type: String,
            required: true,

        },
        luogo: {
            type: String,
            required: true,

        },
        immagine: {

            type: String,
            required: true,

        },
        descrizione: {
            type: String,
            required: true,
        },
        prezzo: {
            type: Number,
            required: true,
        },
        datetime:{
            type: String,
            required: true,
        }

    },
    {
        timestamps: true,
        strict: true,
    }

)
module.exports = mongoose.model('Evento', Evento, 'Eventi');
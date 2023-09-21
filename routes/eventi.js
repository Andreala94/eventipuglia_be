const express = require('express');
const mongoose = require('mongoose');
const Evento = require('../models/Evento');
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require('multer')

const EventiR = express.Router()


cloudinary.config({ 
    cloud_name: 'dsmb3mzsp', 
    api_key: '871683394519529', 
    api_secret: 'Wss9FCpQptIISb-boHhBFiw3nQM' 
  });



const cloudStorage = new CloudinaryStorage({
     cloudinary: cloudinary,
     params: {
        folder: 'CapstoneEpicode/imgEvents',
        format: async ( req, file, cb)=> 'png',
        public_id: (req, file) => file.name,
     }
    
});

const cloudUpload = multer ({ storage: cloudStorage }) // caricare immagine incloud

EventiR.post("/events/cloudUpload", cloudUpload.single("img"), async (req, res) => {
    try {
        res.status(200).json({ imgUrl: req.file.path });
    } catch (error) {
        console.error("File upload failed:", error);
        res.status(500).json({ error: "File upload failed" });
    }
}
);

EventiR.post("/newevents/create", async (req, res)=>{

    const newEvent = new Evento({
        titolo: req.body.titolo,
        luogo: req.body.luogo,
        immagine: req.body.immagine,
        descrizione: req.body.descrizione,
        prezzo: req.body.prezzo,
        datetime: req.body.datetime
    })

    try {
        const evento = await newEvent.save();

        res.status(201).send({
            statusCode: 201,
            message: "Event saved successfully",
            evento,
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server Error",
            error,
        });
    }
})

EventiR.get("/eventi",    async (req, res) => {

    const totalEventi = await Evento.count();

    try {
        const eventi = await Evento.find()

        res.status(200).send({
            statusCode: 200,
            message:"ciao",
            totalEventi: totalEventi,
            eventi: eventi,
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server Error",
            error,
        });
    }

})

EventiR.get('/eventi/:id', async (req, res) => {
    const { id } = req.params

    
    try {
        const evento = await Evento.findById(id)

        if (!evento) {
            return res.status(404).send({
                statusCode: 404,
                message: ` post with id ${id} not found!`
            })}

        res.status(200).send({
            statusCode: 200,
            evento: evento,
        });


    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server Error",
            error,
        });
    }

})



module.exports = EventiR
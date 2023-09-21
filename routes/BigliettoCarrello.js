const express = require('express');
const Biglietto = require('../models/Biglietto')


const BigliettoR = express.Router()

BigliettoR.post("/shop/biglietto", async (req, res)=>{

    const failed=false;

     req.body.carrello.forEach(async (biglietto) => {
        const newBiglietto = new Biglietto({
            titolo: biglietto.titolo,
            idEvento: biglietto.id,
            immagine: biglietto.immagine,
            prezzo: biglietto.prezzo,
            quantita: biglietto.quantita,
            idUtente: req.body.idUtente
        })
    
        try {
             await newBiglietto.save();
     }catch(error){
       console.log(error);
       failed=true;
     }
    });
    
 if(failed){
    res.status(500).send({
        statusCode: 500,
        message: "internal server Error"
        
    });
 }else{
    res.status(201).send({
        statusCode: 201,
        message: "Tickets bought successfully"
        
    });
 }

})


BigliettoR.get("/shop/biglietto",    async (req, res) => {

    const totalBiglietti = await Biglietto.count();

    try {
        const biglietti = await Biglietto.find()

        res.status(200).send({
            statusCode: 200,
            message:"ciao",
            totalBiglietti: totalBiglietti,
            biglietto: biglietti,
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server Error",
            error,
        });
    }

})


BigliettoR.get('/shop/biglietto/:idUtente', async (req, res) => {
    const { idUtente } = req.params

    
    try {
        const biglietto = await Biglietto.find({ idUtente: idUtente });

        if (!biglietto) {
            return res.status(404).send({
                statusCode: 404,
                message: ` post with id ${ idUtente} not found!`
            })}

        res.status(200).send({
            statusCode: 200,
            biglietto: biglietto,
        });


    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server Error",
            error,
        });
    }

})

module.exports = BigliettoR
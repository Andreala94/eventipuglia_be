const express = require('express');
const Biglietto = require('../models/Biglietto')


const BigliettoR = express.Router()


BigliettoR.post("/shop/biglietto", async (req, res)=>{

    const failed=false;  // Inizializza una variabile booleana per indicare se si è verificato un errore.
    
     req.body.carrello.forEach(async (biglietto) => {
        // Crea un nuovo oggetto Biglietto con le proprietà dell'oggetto biglietto corrente.
        const newBiglietto = new Biglietto({
            titolo: biglietto.titolo,
            idEvento: biglietto.id,
            immagine: biglietto.immagine,
            prezzo: biglietto.prezzo,
            quantita: biglietto.quantita,
            idUtente: req.body.idUtente
        })
        // Salva l'oggetto Biglietto nel database.
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
        const biglietti = await Biglietto.find() // Recupera tutti i biglietti dal database.
        // Se i biglietti vengono recuperati correttamente, invia una risposta di successo 200.
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
    // Estrae l'ID dell'utente dai parametri della richiesta utilizzando il metodo req.params.
    const { idUtente } = req.params

    
    try {
        const biglietto = await Biglietto.find({ idUtente: idUtente }); // Recupera tutti i biglietti acquistati dall'utente dal database.

        // Se non vengono trovati biglietti per l'utente specificato, invia una risposta di errore 404.
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
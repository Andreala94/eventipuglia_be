const express = require('express');
const mongoose = require('mongoose');
const Autore = require('../models/Autore');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require('multer')

const autoriR = express.Router()



cloudinary.config({ 
    cloud_name: 'dsmb3mzsp', 
    api_key: '871683394519529', 
    api_secret: 'Wss9FCpQptIISb-boHhBFiw3nQM' 
  });



const cloudStorage = new CloudinaryStorage({
     cloudinary: cloudinary,
     params: {
        folder: 'CapstoneEpicode',
        format: async ( req, file, cb)=> 'png',
        public_id: (req, file) => file.name,
     }
    
});


const cloudUpload = multer ({ storage: cloudStorage }) // caricare immagine incloud

autoriR.post("/authors/cloudUpload", cloudUpload.single("avatar"), async (req, res) => {
    try {
        res.status(200).json({ avatar: req.file.path });
    } catch (error) {
        console.error("File upload failed:", error);
        res.status(500).json({ error: "File upload failed" });
    }
}
);

autoriR.post("/register/authors", async (req, res)=>{
    
    const user = await Autore.findOne({ email: req.body.email });

    if(user){
        return res.status(500).send({
            statusCode: 500,
            message: "Email già esistente!",
        });
    }

    const newAuthor = new Autore({
        name: req.body.name,
		surname: req.body.surname,
        password: req.body.password,
		email: req.body.email,
		dob: req.body.dob,
		avatar: req.body.avatar,
    })

    try {
        const author = await newAuthor.save();

        res.status(201).send({
            statusCode: 201,
            message: "Author saved successfully",
            author,
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server Error",
            error,
        });
    }
})

autoriR.get("/authors", async (req, res) => {

    try {
        const posts = await AuthorModel.find().populate("posts");

        res.status(200).send({
            statusCode: 200,
            posts: posts,
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "internal server Error",
            error,
        });
    }

})

autoriR.post("/login/authors", async (req,res)=>{

    const user = await Autore.findOne({ email: req.body.email });
   
    if (!user) {
        return res.status(404).send({
            statusCode: 404,
            message: "Email o Password errati",
        });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
        return res.status(404).send({
            statusCode: 404,
            message: "Email o Password errati",
        });
    }

    // generare token
    const token = jwt.sign(
        {
        name: user.name,
        surname: user.surname,
        email: user.email,
        dob: user.dob,
        avatar: user.avatar
        },

        process.env.JWT_SECRET,
        { expiresIn: "24h" } // dopo quando deve scadere il token
    );

    res.header('Authorization', token).status(200).send({
        statusCode: 200,
        message: "Login effettuato con successo!",
        token,
        avatar: user.avatar,
        name: user.name,
        idUtente: user._id
    })
})

module.exports = autoriR;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const Autore = new mongoose.Schema(

    {
      name: {
        type: String,
        required: true,
       
      },
      surname: {
        type: String,
        required: true,
        
      },
      password: {
        type: String,
        required: true,
       
      },
      email: {
        type: String,
        required: true,
        index:{
          unique: true,
          dropDups: true,
        }
      },
  
      avatar: {
        type: String,
        required: true,
        
      },
      dob: {
        type: String,
        required: true,
        
      }
      
  
    },
    {
      timestamps: true,
      strict: true,
    }
  
  )

  Autore.pre('save', async function(next){
    const user = this
    try {
      const salt = await bcrypt.genSalt(10) //Password min 10 caratteri
      const hash = await bcrypt.hash(user.password, salt)
      user.password= hash
      next()
    } catch (error) {
      console.log(error);
    }
  })
  module.exports = mongoose.model('Autore', Autore, 'Autori');
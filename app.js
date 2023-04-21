//jshint esversio
require('dotenv').config()
const express= require("express")
const ejs=require("ejs")
const bodyParser=require("body-parser")
const mongoose =require("mongoose")
const app= express()
const encrypt = require('mongoose-encryption');


const PORT=3000||process.env.PORT

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.set('view engine',"ejs")

const uri='mongodb://127.0.0.1:27017/userDB'

const MongoConnect=async()=>{
    try {
        await mongoose.connect(uri);
        console.log("Connected Succesfully")
    }
     catch (error) {
        console.log(error);
    }
    
}
const userSchema= new mongoose.Schema({
    email:String,
    password:String
})



userSchema.plugin(encrypt, { secret:process.env.SECRET ,encryptedFields: ['password']  });

 const user= new mongoose.model("user",userSchema)


app.route("/")

.get((req,res)=>{
res.render("home")
})


app.route("/login")

.get((req,res)=>{
res.render("login")
})

.post((req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    user.findOne({email:username}).exec()
    .then((found)=>{
        if(found)
        {
            if(found.password===password)
            res.render("secrets")
        }
    })
    .catch(err=>{
        console.log(err)
    })

})

app.route("/register")

.get((req,res)=>{
res.render("register")
})

.post((req,res)=>
{
    const newUser= new user(
        {
            email:req.body.username,
            password:req.body.password
        }
    )
    newUser.save()
    .then(()=>{
        res.render("secrets")
    })
    .catch(err=>{
        console.log(err)
    })
})

MongoConnect(). then(()=>{
    app.listen(PORT,()=>
    {
        console.log("Server is Running on port 3000")
    })

})
.catch((err)=>{
   console.log(err)

})

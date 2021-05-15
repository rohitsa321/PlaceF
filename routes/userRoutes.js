const userRouter=require("express").Router();
const user = require('../models/user.js');

/*
userRouter.get('/',(req,res)=>{
    user.find()
    .then(users=>res.json(users))
    .catch(err=>res.status(400).json("Error: "+err));
});*/

userRouter.get('/alluser',(req,res)=>{
     user.find().then((doc)=>res.send(doc)).catch((err)=>res.send("Error: "+err))
});



userRouter.post('/login',(req,res)=>{
     const email=req.body.email;
     const password=req.body.password;

     user.findOne({email})
     .then((doc)=>{
          if(doc){
              if(doc.password===password){
                 res.status(202).send(doc);
               }else{
                   res.status(200);
                   res.send("incorrect password");
               } 
          }else{
              res.status(200);
              res.send("you don't have an account"); 
          }
     }).catch((err)=>
         res.status(400).send("Error: "+err));
});


userRouter.post('/signin',(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    const email=req.body.email;
    user.findOne({email})
    .then((doc)=>{
        if(doc){
                 res.status(200).send("You already have an account");
        }else{
               const newuser=new user({username,password,email});
                 newuser.save()
                .then((doc)=>res.status(201).send(doc))
                .catch((err)=>{
                 res.status(400).send("Error:" +err);}
                 );
        }
    })
    .catch((err)=>{
         res.status(400).send("error")
    });
    
});


module.exports=userRouter;
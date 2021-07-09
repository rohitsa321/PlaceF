const placeRouter=require("express").Router();
const userPlace=require('../models/userPlace.js');
const moment=require('moment');
const multer=require('multer');
const fs=require('fs');
const path=require("path");

//for random names of image
const {nanoid}=require('nanoid');

let resultHandler = function (err) {
                if (err) {
                    console.log("unlink failed", err);
                } else {
                    console.log("file deleted");
                }
            }

const storage=multer.diskStorage({
     destination:function(req,file,callBack){
         callBack(null,'./uploads/');
     },
     filename:function(req,file,callBack){
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
       callBack(null, nanoid()+'.'+extension);
    }
});
const upload=multer({storage:storage});


//for getting all places
placeRouter.get('/',(req,res)=>{
       let places=[];
       userPlace.find()
      .then((userplace)=>{
             userplace.forEach((user)=>{
                   user.place.forEach((p)=>places.push(p));
             });
            res.send(places);
      })
      .catch((err)=>res.send("Error: "+err));
});

//for getting user specific places
placeRouter.get('/:userId',(req,res)=>{
     const userId=req.params.userId;
     let places=[];
     
     userPlace.findOne({userId})
     .then((doc)=>{
         if(doc){
             doc.place.forEach((p)=>places.push(p));
           }
            res.send(places); 
     }).catch((err)=>res.send("Error: "+err));
});

//for posting new place
placeRouter.post('/:userId/add', upload.single("file") ,(req,res)=>{
      
    //if file is not uploded in ./uploads
    if(!req.file){
        res.send("please upload file");
     }
     
      const userId=req.params.userId;
      const location=req.body.location;
      const about=req.body.about;
      const date=moment().format('h:mma DD-MM-YY');
      
       const image_path=req.file.path.substr(8);
       userPlace.findOne({userId})
       .then((doc)=>{
            if(doc){
                 doc.place.push({
                     location:location,
                     about:about,
                     image_path:image_path,
                     date:date
                    });
                doc.save()
                .then((d)=>{
                    res.send(d.place[d.place.length-1]);})
                .catch((err)=>res.send(err));
               }
            else{
                //creting userPlace for new user
                const newUserplace=new userPlace({
                    userId:userId,
                    place:{
                        location:location,
                        about:about,
                        image_path:image_path,
                        date:date
                    }});
                newUserplace.save()
                .then((d)=>res.send(d.place[d.place.length-1]))
                .catch((err)=>res.send(err));
              }
        }).catch((err)=>res.send("Error: "+err));
});

//for deleting place for user specific
placeRouter.delete('/:userId/del',(req,res)=>{
    console.log(req.body);
       const userId=req.params.userId;
       const image_path=req.body.image_path;
       const place_id=req.body._id;
       userPlace.findOne({userId:userId})
       .then((doc)=>{
           /*  doc.place.forEach((p)=>{
                 if(p.image_path===image_path){
                       place_id=p._id;
                   }
               });*/
            doc.place.pull({_id:place_id});
            doc.save()
            .then(()=>{
                fs.unlink(`./uploads/${image_path}`,resultHandler);
                res.send("file deleted");
            })
            .catch((er)=>res.send("Error: "+er));
       }).catch((er)=>res.send("Error: "+er));
})



module.exports=placeRouter;
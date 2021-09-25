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
placeRouter.post('/:userId', upload.single("file") ,(req,res)=>{
      
    //if file is not uploded in ./uploads
    if(!req.file){
        res.send("please upload file");
     }
     
      const userId=req.params.userId;
      const location=req.body.location;
      const about=req.body.about;
      const lat=req.body.lat;
      const lng=req.body.lng;
      const date=moment().format('h:mma DD-MM-YY');
      
       const image_path=req.file.path.substr(8);
       userPlace.findOne({userId})
       .then((doc)=>{
            if(doc){
                 doc.place.push({
                     location:location,
                     lat:lat,
                     lng:lng,
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
                        lat:lat,
                        lng:lng,
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
placeRouter.delete('/:userId',(req,res)=>{
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
            .catch((err)=>res.send("Error: "+err));
       }).catch((err)=>res.send("Error: "+err));
})

//for updating place content not image
placeRouter.put('/:userId',(req,res)=>{
    const date=moment().format('h:mma DD-MM-YY');
    const query={userId:`${req.params.userId}`,"place._id":`${req.body._id}`};
    const updateDocument = {
        $set: { 
            "place.$.lat":`${req.body.la}`,
            "place.$.lng":`${req.body.lng}`,
            "place.$.about": `${req.body.about}`,
            "place.$.location": `${req.body.location}`,
            "place.$.date": `${date}`,
             },
      };
    
    userPlace.updateOne(query, updateDocument)
    .then((result)=>{
         res.send("updated!");
    }).catch((err)=>res.send(err));

});



//for updating place with image as well
placeRouter.put('/:userId/file', upload.single("file"),(req,res)=>{
        
        const date=moment().format('h:mma DD-MM-YY');
        
        const prev_image_path=req.body.prev_image_path;
        const image_path=req.file.path.substr(8);
        const query={userId:`${req.params.userId}`,"place._id":`${req.body._id}`};
        const updateDocument = {
            $set: { 
                "place.$.image_path": `${image_path}`,
                "place.$.lat":`${req.body.lat}`,
                "place.$.lng":`${req.body.lng}`,
                "place.$.about": `${req.body.about}`,
                "place.$.location": `${req.body.location}`,
                "place.$.date": `${date}`,
                 },
        };


        userPlace.updateOne(query, updateDocument)
        .then((result)=>{
            if(prev_image_path){
                fs.unlink(`./uploads/${prev_image_path}`,resultHandler);
                res.send(image_path);
             }
        })
        .catch((err)=>res.send(err));
      
});



module.exports=placeRouter;
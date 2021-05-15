import React,{useState, useEffect} from 'react'
import './ShowCard.css'
import {GrAdd} from 'react-icons/gr'
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import resizeImage from './imageresize';


export default  function ShowCard({_id,add,about,location,image_path}) {
    const [image,setImage]=useState(null);

    useEffect(()=>{
      async function resize(url){
          let blob= await fetch(url).then(img => img.blob())
          const img=await resizeImage(blob,270,240);
          setImage(img);
      }
      if(_id){
        resize(`http://localhost:3001/uploads/${image_path}`);
      }
    },[_id,image_path]);

    return (
       
        <div className="card"> 
          { add ? (
            
             <Button component={Link} to="/profile/add">
               <GrAdd size="100"/>
            </Button>
            
          ) : (
          <Link  to={{
              pathname:'/Info',
              info:{image_path,location,about }
            }}
            style={{textDecoration:"none"}}
            >
            <div  className="card" >
                <div className="card_img">  
                     <img src={image} alt="img" />
                </div>
                <div className="card_info">
                   <h5>{location.substring(0,30)}</h5>
                 </div> 
            </div>
          </Link>  
        )}
        </div>
    
    )
}

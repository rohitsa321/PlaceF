import React,{useState, useEffect} from 'react'
import './ShowCard.css'
import { Link } from 'react-router-dom';
import {AiFillDelete} from 'react-icons/ai'
import axios from 'axios';
import { useStateContext } from './StateProvider';
import imageResize from './imageresize';

export default  function ShowCard({data,updation}) {
    const [image,setImage]=useState(null);
    const [{user,userplaces,places},dispatch]=useStateContext();
    useEffect(()=>{
      async function fetchImage(){
      if(data._id){
        const file= await fetch(`http://localhost:3001/uploads/${data.image_path}`).then(r => r.blob());
        const resizedImage=await imageResize(file,280,260);
        setImage(resizedImage);
      }}
      fetchImage();
    },[data._id,data.image_path]);

    const deletePlace= async()=>{
         await axios.delete(`http://localhost:3001/${user._id}`,{data:new Object({image_path:data.image_path,_id:data._id})})
               .then((res)=>{
                
                //deleting from userplaces
                const updatedUserplaces = userplaces.filter((item) => item._id !== data._id);
                dispatch({
                  type:"setuserplaces",
                  userplaces:updatedUserplaces
                });
                
                //deleting from places
                const updatedPlaces = places.filter((item) => item._id !== data._id);
                dispatch({
                  type:"setplaces",
                  places:updatedPlaces
                });

                alert("deleted");
               }).catch((err)=>{
                 alert(err);
               });
    }

    return (
       
        <div> 
                {updation?
                 (<button onClick={deletePlace}><AiFillDelete size="25"/> </button>)
                 :null
                 }
         <div  className="card">
             <Link  to={{
                      pathname:'/info',
                      info:{data,updation}
                    }}
                  style={{textDecoration:"none"}}
                  >
                  <div  className="card" >
                      <div className="card_img">  
                              <img src={image} alt="img" />
                          </div>
                          <div className="card_info">
                            <h5>{data.location.length<25?data.location:data.location.substring(0,25)}</h5>
                          </div> 
                  </div>
            </Link> 
          </div>
        </div>
    
    )
}

import React,{useState, useEffect} from 'react'
import './ShowCard.css'
import {GrAdd} from 'react-icons/gr'
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import {AiFillDelete} from 'react-icons/ai'
import axios from 'axios';
import { useStateContext } from './StateProvider';

export default  function ShowCard({_id,add,about,location,image_path,del}) {
    const [image,setImage]=useState(null);
    const [{user,userplaces,places},dispatch]=useStateContext();

    useEffect(()=>{
      if(_id){
        setImage(`http://localhost:3001/uploads/${image_path}`);
      }
    },[_id,image_path]);

    const deletePlace= async()=>{
         await axios.delete(`http://localhost:3001/${user._id}/del`,{data:new Object({image_path:image_path,_id:_id})})
               .then((res)=>{
                
                //deleting from userplaces
                const updatedUserplaces = userplaces.filter((item) => item._id !== _id);
                dispatch({
                  type:"setuserplaces",
                  userplaces:updatedUserplaces
                });
                
                //deleting from places
                const updatedPlaces = places.filter((item) => item._id !== _id);
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
       
        <div className="card"> 
          { add ? (
            
             <Button component={Link} to="/profile/add">
               <GrAdd size="100"/>
            </Button>
            
          ) : (
          <div>
            {del?
                 (<button onClick={deletePlace}><AiFillDelete size="25"/> </button>)
                 :null
                 }
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
          </div>
        )}
        </div>
    
    )
}

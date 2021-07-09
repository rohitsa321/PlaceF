
import React,{useState,useEffect} from 'react'
import "./ShowAllInfo.css"
import useStyle from './theme/style';
import { useLocation } from 'react-router';
import { Button } from '@material-ui/core';


export default function ShowAllInfo(props) {
     
    const path=useLocation();
    const theme=useStyle();
    const [image,setImage]=useState();
    useEffect(() => {
        if(path.info){
           setImage(`http://localhost:3001/uploads/${path.info.image_path}`);
        }
    }, [])

    

    return (
        <div className="show" >
            <div className="show_img">
                  {image?<img src={image} alt="img" />:null}
            </div>
            <div className="show_info">

              <div className="show_info_text"> 
                 <h5>Location</h5>
                 <p>{path.info.location}</p>
              </div>
              <div className="show_info_text">
                  <h5>About</h5>
                  <p>{path.info.about}</p>
              </div>
            </div>
        </div>
    )
}

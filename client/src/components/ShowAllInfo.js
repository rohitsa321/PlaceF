import {  TextField, Typography } from '@material-ui/core'
import React,{useState,useEffect} from 'react'
import "./ShowAllInfo.css"
import useStyle from './theme/style';
import resizeImage from './imageresize';
import { useLocation } from 'react-router';

export default function ShowAllInfo(props) {
     
    const path=useLocation();

    const theme=useStyle();
    const [image,setImage]=useState();
    useEffect(() => {
       async function resize(url){
            let blob= await fetch(url).then(img => img.blob())
            const img=await resizeImage(blob,400,400);
            setImage(img);
        }
        if(path.info){
           resize(`http://localhost:3001/uploads/${path.info.image_path}`);
           console.log(path.info);
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

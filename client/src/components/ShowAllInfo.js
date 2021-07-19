
import React,{useState,useEffect} from 'react'
import "./ShowAllInfo.css"
import useStyle from './theme/style';
import { useLocation } from 'react-router';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default function ShowAllInfo(props) {
     
    const path=useLocation();
    const theme=useStyle();
    const [image,setImage]=useState();
    const [data,setData]=useState({image_path:"",about:"",location:"",_id:"",date:""});
    
    useEffect(() => {
        if(path.info.data){
           setImage(`http://localhost:3001/uploads/${path.info.data.image_path}`);
           setData(
                    {
                    image_path:path.info.data.image_path,
                    location:path.info.data.location,
                    about:path.info.data.about,
                    _id:path.info.data._id,
                    date:path.info.data.date
                    }
                 )
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
                 <p>{data.location}</p>
              </div>
              <div className="show_info_text">
                  <h5>About</h5>
                  <p>{data.about}</p>
              </div>
              <div className="show_info_text">
                  <h5>Posted on</h5>
                  <p>{data.date}</p>
              </div>
              {path.info.del?
              (<Button component={Link} to={{
                  pathname:'/profile/add',
                  updateData:{data},
                  }}
                 size="large" variant="contained" color="primary" >edit</Button>
                 ):null}
            </div>
        </div>
    )
}

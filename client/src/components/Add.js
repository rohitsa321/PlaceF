import { Button, TextField } from '@material-ui/core'
import React,{useState,useEffect} from 'react'
import './Add.css'
import { useStateContext } from './StateProvider';
import useStyle from './theme/style';
import resizeImage from './imageresize';
import axios from 'axios';

const headers={ 'Content-Type': 'multipart/form-data',}

export default function Add() {
    const theme=useStyle();
    const [{user},dispatch]=useStateContext();
    const [data,setData]=useState({location:"",about:"",image:""});
    const [image,setImage]=useState();
    useEffect(() => {
        console.log(data);
    }, [data])

    const handleChange = async(e) =>{
         setData({...data,image:e.target.files[0]});
        const img=await resizeImage(e.target.files[0],250,330);
        setImage(img);
    };

    const handleClick = async() =>{
         var formdata=new FormData();
         formdata.append("location",data.location);
         formdata.append("about",data.about);
         formdata.append("file",data.image);
          await axios.post(`http://localhost:3001/${user._id}/add`,formdata)
                .then((res)=>{
                      alert(res.data);
                })
                .catch((err)=>{
                     alert("ErrorF: "+err);
                });
    }

    return (
        <div className="add_outer" >
          {user?( 
          <div className="add"> 
            <div className="add_img">
               <div className="add_img_block">
                   {image?<img src={image} alt="img" />:null}
               </div>
               <input type="file" accept="image/*"  onChange={handleChange}/>
            </div>
            <div className="add_info">
              <div className="add_info_text">
                <h5>Location </h5>
                <textarea
                   required={true}
                   onChange={(e)=>setData({...data,location:e.target.value.trim()})}
                />
                <h5>About</h5>
                <textarea
                     cols="30"
                     rows="10"
                     onChange={(e)=>setData({...data,about:e.target.value.trim()})}
                />
              </div>
               <Button onClick={handleClick}  size="large" variant="contained" color="primary" >add</Button>
             </div>   
           </div> 
            ):(
              <h3>Bad request</h3>
            )}
        </div>
    )
}

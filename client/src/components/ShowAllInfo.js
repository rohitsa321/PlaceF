
import React,{useState,useEffect} from 'react'
import "./ShowAllInfo.css"
import { useLocation } from 'react-router';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import {
    GoogleMap,
    LoadScript,
    Marker
 } from '@react-google-maps/api';
import imageResize from './imageresize';



export default function ShowAllInfo(props) {
     
    const path=useLocation();
    const [image,setImage]=useState();
    const [data,setData]=useState({img:"",image_path:"",about:"",location:"",lat:"",lng:"",_id:"",date:""});
    
    useEffect(() => {
        async function fetchImage(){
                if(path.info.data){
                    // decoding binary image data
                    var buffer = new Buffer.from(path.info.data.img, 'base64')
                    var byteString = atob(buffer)
                    // write the bytes of the string to an ArrayBuffer
                    var array_buffer = new ArrayBuffer(byteString.length);
                    var ia = new Uint8Array(array_buffer);
                    for (var i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    // write the ArrayBuffer to a blob
                    var blob = new Blob([array_buffer]);
                    const resizedImage=await imageResize(blob,500,390);
                    setImage(resizedImage);
                    setData({
                      img: path.info.data.img,
                      image_path: path.info.data.image_path,
                      location: path.info.data.location,
                      lat: path.info.data.lat,
                      lng: path.info.data.lng,
                      about: path.info.data.about,
                      _id: path.info.data._id,
                      date: path.info.data.date,
                    });
                    }
        }
        fetchImage();
    }, [])


    return (
        <div className="show_outer">
            <div className="show"> 
                <div className="showr1">
                    <div className="showr1_img">
                        <div className="showr1_img_block">
                            {image?<img src={image} alt="img" />:<h5>No picture!</h5>}
                        </div>
                    </div>
                    <div className="showr1_info">
                        <div className="showr1_info_text">
                                    <div className="showr1_info_text_block"> 
                                        <h5>Location</h5>
                                        <p>{data.location}</p>
                                    </div>
                                    <div className="showr1_info_text_block">
                                        <h5>About</h5>
                                        <p>{data.about}</p>
                                    </div>
                                    <div className="showr1_info_text_block">
                                        <h5>Posted on</h5>
                                        <p>{data.date}</p>
                                    </div>
                        </div>
                    </div>
                </div> 
                <div className="showr2">
                <div className="show2_map">
                    <LoadScript   googleMapsApiKey="AIzaSyC8azJx1iRGXtWNLkPkEFrHn5NsY2n6Wwg">
                        <GoogleMap 
                        mapContainerStyle={{height: "60vh",width: "40vw"}}
                        zoom={8}
                        center={{lat:data.lat,lng:data.lng}}>
                           <Marker 
                            position={{lat:data.lat,lng:data.lng}} 
                            />
                        </GoogleMap>
                    </LoadScript>
                </div>
                {path.info.updation?
                    (<Button component={Link} to={{
                        pathname:'/profile/add',
                        updateData:{data},
                        }}
                        size="large" variant="contained" color="primary" >edit</Button>
                        ):null}
                </div>
            </div> 
        </div>
    )
}

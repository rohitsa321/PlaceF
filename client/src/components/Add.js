import { Button} from '@material-ui/core'
import React,{useState,useEffect} from 'react'
import './Add.css'
import { useStateContext } from './StateProvider';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';
import {BsFillImageFill} from 'react-icons/bs';
import {
   GoogleMap,
   LoadScript,
   Marker
} from '@react-google-maps/api';
import imageResize from './imageresize';


export default function Add() {
    const [{user,userplaces,places},dispatch]=useStateContext();
    const [data,setData]=useState({location:"",lat:23.246816,lng:77.502370,about:"",image:""});
    const path=useLocation();
    const [image,setImage]=useState();
    const [update,setUpdate]=useState(false);

   

    //assigning data(from path) if we are updating existing post
    useEffect(() => {
         if(path.updateData&&!update){
           setData(
             {
               ...data,
              location:path.updateData.data.location,
              about:path.updateData.data.about,
              lat:path.updateData.data.lat,
              lng:path.updateData.data.lng
            }
           );
           setImage(`http://localhost:3001/uploads/${path.updateData.data.image_path}`);
           setUpdate(!update);
         }
    }, [update])

    const handleChange = async(e) =>{
      const file=e.target.files[0];
      const resizedImage=await imageResize(file,300,350);
         setData({...data,image:e.target.files[0]});
         setImage(resizedImage);
    };


    //for adding or updating post after submit
    const handleClick = async() =>{
         var formdata=new FormData();
         formdata.append("location",data.location);
         formdata.append("about",data.about);
         formdata.append("file",data.image);
         formdata.append("lat",data.lat);
         formdata.append("lng",data.lng);
         //if you updated old post 
         if(update){
              formdata.append("_id",path.updateData.data._id);
              
              //updated image also
              if(data.image!==""){
                console.log(data);
                    formdata.append("prev_image_path",path.updateData.data.image_path);
                   
                    await axios.put(`http://localhost:3001/${user._id}/file`,formdata)
                    .then((res)=>{
                      //updating into  global places
                      var updatedPlaces=places;
                      updatedPlaces.forEach(element => {
                        if(element._id===path.updateData.data._id){
                          element.location=data.location;
                          element.about=data.about;
                          element.image_path=res.data;
                          element.lat=data.lat;
                          element.lng=data.lng;
                        }
                      });
                      dispatch({
                        type:"setplaces",
                        places:updatedPlaces
                      });
                      
                      //updating into user specific places
                      var updatedUserplaces=userplaces;
                      updatedUserplaces.forEach(element => {
                        if(element._id===path.updateData.data._id){
                          element.location=data.location;
                          element.about=data.about;
                          element.image_path=res.data;
                          element.lat=data.lat;
                          element.lng=data.lng;
                        }
                      });
                      dispatch({
                        type:"setuserplaces",
                        userplaces:updatedUserplaces
                      });
                      alert("updated");
                    }).catch((err)=>alert("Error while updating, try again!"));
              }else{
                   //image not updated
                   axios.put(`http://localhost:3001/${user._id}`,new Object(
                        {
                          _id:path.updateData.data._id,
                          about:data.about,
                          location:data.location,
                          lat:data.lat,
                          lng:data.lng
                        }
                    ))
                   .then((res)=>{
                        var updatedPlaces=places;
                        updatedPlaces.forEach(element => {
                          if(element._id==path.updateData.data._id){
                            element.location=data.location;
                            element.about=data.about;
                            element.lat=data.lat;
                            element.lng=data.lng;
                          }
                        });
                        dispatch({
                          type:"setplaces",
                          places:updatedPlaces
                        });
                        
                        //updating into user specific places
                        var updatedUserplaces=userplaces;
                        updatedUserplaces.forEach(element => {
                          if(element._id==path.updateData.data._id){
                            element.location=data.location;
                            element.about=data.about;
                            element.lat=data.lat;
                            element.lng=data.lng;
                          }
                        });
                        dispatch({
                          type:"setuserplaces",
                          userplaces:updatedUserplaces
                        });
                        alert("updated");
                   }).catch((err)=>alert("Error while updating, try again!"))
              }
         }else{
           //if you adding new post
                //if lat lng is empty than ask user to change it
                if(data.lat==23.246816){
                        alert("locate on map as well");
                }else{
                    await axios.post(`http://localhost:3001/${user._id}`,formdata)
                    .then((res)=>{
                          //adding into  global places
                          var updatedPlaces=places;
                          updatedPlaces.push(res.data);
                          dispatch({
                            type:"setplaces",
                            places:updatedPlaces
                          });

                          //adding into user specific places
                          var updatedUserplaces=userplaces;
                          updatedUserplaces.push(res.data);
                          dispatch({
                            type:"setuserplaces",
                            userplaces:updatedUserplaces
                          });
                          alert("added");
                    })
                    .catch((err)=>{
                        alert("Error while adding, try again!");
                    });
                }
              }
    }

    return (
        <div className="add_outer" >
          {user?( 
          <div className="add_body"> 
             <div className="addr1">
               <div className="addr1_img">
                    <div className="addr1_img_block">
                        {image?<img src={image} alt="img" />:<BsFillImageFill color="white" size="300"/>}
                    </div>
                    <input type="file" accept="image/*"  onChange={handleChange}/>
               </div>
               <div className="addr1_info">
                    <div className="addr1_info_text">
                      <h5>Location </h5>
                      <textarea
                        value={data.location}
                        required={true}
                        onChange={(e)=>setData({...data,location:e.target.value.trim()})}
                      />
                      <h5>About</h5>
                      <textarea
                          value={data.about}
                          cols="30"
                          rows="10"
                          onChange={(e)=>setData({...data,about:e.target.value.trim()})}
                      />
                    </div>
                </div>
             </div> 
             <div className="addr2">
                <h5>Locate on map </h5>
                <div className="addr2_map">
                    <LoadScript   googleMapsApiKey="AIzaSyC8azJx1iRGXtWNLkPkEFrHn5NsY2n6Wwg">
                       <GoogleMap 
                       mapContainerStyle={{height: "60vh",width: "40vw"}}
                       zoom={8} 
                       center={{lat:data.lat,lng:data.lng}} 
                       onClick={()=>alert("Drag the marker!")} >
                         <Marker 
                            position={{lat:data.lat,lng:data.lng}} 
                            onDragEnd={(e)=>setData({...data,lat:Number(e.latLng.lat()),lng:Number(e.latLng.lng())})}
                            draggable={true}
                          />
                       </GoogleMap>
                    </LoadScript>
                </div>
                <Button component={Link} to="/profile" onClick={handleClick}  size="large" variant="contained" color="primary" >{update?'update':'add'}</Button>
             </div>
           </div> 
            ):(
              <h3>Bad request</h3>
            )}
        </div>
    )
}

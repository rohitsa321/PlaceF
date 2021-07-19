import { Button, TextField } from '@material-ui/core'
import React,{useState,useEffect} from 'react'
import './Add.css'
import { useStateContext } from './StateProvider';
import useStyle from './theme/style';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router';

const headers={ 'Content-Type': 'multipart/form-data',}

export default function Add() {
    const theme=useStyle();
    const [{user,userplaces,places},dispatch]=useStateContext();
    const [data,setData]=useState({location:"",about:"",image:""});
    const path=useLocation();
    const [image,setImage]=useState();
    const [update,setUpdate]=useState(false);
    console.log(path);
    useEffect(() => {
         if(path.updateData&&!update){
           setData(
             {
               ...data,
              location:path.updateData.data.location,
              about:path.updateData.data.about,
            }
           );
           setImage(`http://localhost:3001/uploads/${path.updateData.data.image_path}`);
           setUpdate(!update);
         }
    }, [update])

    const handleChange = async(e) =>{
         setData({...data,image:e.target.files[0]});
         setImage(URL.createObjectURL(e.target.files[0]));
    };

    const handleClick = async() =>{
         var formdata=new FormData();
         formdata.append("location",data.location);
         formdata.append("about",data.about);
         formdata.append("file",data.image);
         //if you updated old post 
         if(update){
              formdata.append("_id",path.updateData.data._id);
              
              //updated image also
              if(data.image!=""){
                console.log(data);
                    formdata.append("prev_image_path",path.updateData.data.image_path);
                   
                    await axios.put(`http://localhost:3001/${user._id}/file`,formdata)
                    .then((res)=>{
                      //updating into  global places
                      var updatedPlaces=places;
                      updatedPlaces.forEach(element => {
                        if(element._id==path.updateData.data._id){
                          element.location=data.location;
                          element.about=data.about;
                          element.image_path=res.data;
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
                          element.image_path=res.data;
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
                          location:data.location
                        }
                    ))
                   .then((res)=>{
                        var updatedPlaces=places;
                        updatedPlaces.forEach(element => {
                          if(element._id==path.updateData.data._id){
                            element.location=data.location;
                            element.about=data.about;
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
               <Button component={Link} to="/profile" onClick={handleClick}  size="large" variant="contained" color="primary" >{update?'update':'add'}</Button>
             </div>   
           </div> 
            ):(
              <h3>Bad request</h3>
            )}
        </div>
    )
}

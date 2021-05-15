import { Avatar, Typography } from '@material-ui/core'
import axios from 'axios';
import React, { useEffect } from 'react'
import './Profile.css'
import ShowCard from './ShowCard';
import { useStateContext } from './StateProvider';
import useStyle from './theme/style'

export default function Profile() {
    const theme=useStyle();
    const [{user,userplaces},dispatch]=useStateContext();
   
       useEffect(() => {
          //call get method to get all user specific places
        async function fetchdata(){
           const res=await axios.get(`http://localhost:3001/${user._id}`);
           console.log(res);
           dispatch({
              type:"setuserplaces",
              userplaces:res.data,
           }); 
          }
          if(user){
         fetchdata();
        }
       },[]);

    return (
      <div>
        {user?(
          <div className="profile">
            <div className="profile_info">
                 <Avatar className={theme.profile_avatar}/>
                 <Typography variant="h6" className={theme.profile_text} >{user.name}</Typography>
                 <Typography variant="h6" className={theme.profile_text}>({user.email})</Typography>
            </div>
            <div style={{paddingTop:"20px"}}>
             <Typography variant="h5" className={theme.profile_text} >added by you</Typography>
            </div>
            <div className="profile_data">
              <ShowCard add={true}/>
              {userplaces?
                userplaces.map(data=>
                   <ShowCard key={data._id} _id={data._id} about={data.about} location={data.location} image_path={data.image_path} />
                    ) 
                 :null}
            </div>
        </div>):(
            <h3>Bad request</h3>
        )}
     </div>
    )
}

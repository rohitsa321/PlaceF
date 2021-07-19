import { Avatar, Button, Typography } from '@material-ui/core'
import axios from 'axios';
import React, { useEffect } from 'react'
import './Profile.css'
import ShowCard from './ShowCard';
import { useStateContext } from './StateProvider';
import useStyle from './theme/style'
import { Link } from 'react-router-dom';

export default function Profile() {
    const theme=useStyle();
    const [{user,userplaces},dispatch]=useStateContext();
   
       useEffect(() => {
          //call get method to get all user specific places
        async function fetchdata(){
           const res=await axios.get(`http://localhost:3001/${user._id}`);
           dispatch({
              type:"setuserplaces",
              userplaces:res.data,
           }); 
          }
          if(userplaces==null){
            fetchdata();
          }
       },[userplaces]);

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
             <Typography variant="h5" className={theme.profile_text} >
                <Button component={Link} to="profile/add" className={theme.button_center} size="large" variant="contained" color="primary" >
                Add</Button>
                {userplaces!==null?'added by you':null}
                </Typography>
            </div>
            
            <div className="profile_data">
              {userplaces?
                userplaces.map(data=>
                   <ShowCard key={data._id} data={data} del={true} />
                    ) 
                 :null}
            </div>
        </div>):(
            <h3>Bad request</h3>
        )}
     </div>
    )
}

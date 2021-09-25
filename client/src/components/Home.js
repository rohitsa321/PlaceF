import {  Typography } from '@material-ui/core'
import React,{useEffect} from 'react'
import ShowCard from './ShowCard';
import './Home.css'
import useStyle from './theme/style';
import { useStateContext } from './StateProvider';

export default function Home() {
       const styles=useStyle();

       const [{places},dipatch]=useStateContext();
      
        useEffect(()=>{
        },[places]);
     
    return (
        <div className="home">
             <div className="home_body1">
                   <Typography variant="h4" className={styles.home_text}>Looking for a Camping place!</Typography>         
             </div>
             <div className="home_body2">
                {places!=null?
                places.map(data=>
                   <ShowCard key={data._id} data={data} updation={false} />
                    ) 
                 :null}
             </div>
        </div>
    )
}

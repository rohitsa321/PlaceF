import React,{useState,useEffect} from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useStyle from './theme/style';
import {  Button} from '@material-ui/core';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Modal from 'react-awesome-modal';
import Login from './Login';
import { useStateContext } from './StateProvider';
import { Link } from 'react-router-dom';

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}



function Navbar() {
    const styles=useStyle();
    const [{user},dispatch]=useStateContext();
    const[popUpSignIn,setPopUpSignIn]=useState(false);

    useEffect(() => {
      if(user){
          setPopUpSignIn(false);
        }
    }, [user])
   
    const logOut=()=>{
       dispatch({
         type:"log_out"
       })
    }
   

    return (
        <div className="nav">
            <ElevationScroll>
            <AppBar className={styles.navbar}>
             <Toolbar>   
                  <Typography component={Link} to="/" variant="h6" className={styles.navbar_title}>PlaceF</Typography>
                   {
                    user?
                    null
                    :
                    <Button color="inherit" className={styles.navbar_button} onClick={()=>setPopUpSignIn(!popUpSignIn)} >Sign in</Button>
                   }
                 {user?
                 <Button component={Link} className={styles.navbar_button} to="/profile" color="inherit">
                    {user.username}
                 </Button>
                   :null
                 }
                 {user?
                 <Button component={Link} className={styles.navbar_button} onClick={logOut} to="/" color="inherit">
                    log out
                 </Button>
                   :null
                  }
                  
            </Toolbar>
            </AppBar>
            </ElevationScroll>
            <Toolbar/>


            <Modal
             visible={popUpSignIn}
             effect="fadeInUp" onClickAway={() =>setPopUpSignIn(false) }
            >
              <Login />
            </Modal>
        </div>
    )
}

export default Navbar

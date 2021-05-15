import {  Button, TextField } from '@material-ui/core'
import axios from 'axios';
import React,{useState,useEffect, useContext} from 'react'
import './Login.css'
import { useStateContext } from './StateProvider';
import useStyle from './theme/style';
import validator from 'email-validator';



function Login() {

     const [{},dispatch]=useStateContext();

    const [data, setData] = useState({name:"",email:"",password:""})
    const [signIn,setSignIn]=useState(false);

    //for checking value is filled or not it
    const [name,setName]=useState(false);
    const [email,setEmail]=useState(false);
    const [password,setPassword]=useState(false);
    const theme=useStyle();

    
    const handleClick= async()=>{
        if(signIn){
            //for first time signin
         if(!data.name||data.name.length<5)setName(true);
         else if(!data.email||!validator.validate(data.email))setEmail(true);
         else if(!data.password)setPassword(true);
         else if(data.name&&data.email&&data.password){
              console.log(data);
              //call post method to add user
             await axios.post("http://localhost:3001/signin",data)
              .then((res)=>{
                 if(res.status==201) {
                     dispatch({
                      type: "setuser",
                      user:res.data,
                     });
                 }else{
                     alert(res.data);
                 }
              })
              .catch((err)=>alert(err));

             setData({name:"",email:"",password:""});
         }
        }else{
            //for login purpose
         if(!data.email)setEmail(true);
         else if(!data.password)setPassword(true);
         else if(data.email&&data.password){
             //call post method for checking user
             //and if genuine user than dispatch
              await axios.post("http://localhost:3001/login",new Object({email:data.email,password:data.password}))
              .then((res)=>{
                 if(res.status!=200) {
                     dispatch({
                      type: "setuser",
                      user:res.data,
                     });
                     console.log(res.data);
                 }else{
                     alert(res.data);
                 }
              })
              .catch((err)=>alert(err));
              setData({name:"",email:"",password:""});
            }
        }
    }
    
    //for switching to login page
    const goOnLogin=()=>{
        setSignIn(false);
        setData({name:"",email:"",password:""});
        setName(false);
        setEmail(false);
        setPassword(false);
    }

    //for switching to sign page
    const goOnSignIn=()=>{
        setSignIn(true);
        setData({name:"",email:"",password:""});
        setName(false);
        setEmail(false);
        setPassword(false);
    }
    
    return (
        <div className="login">
        {signIn?<h3>Sign ln</h3>:<h3>Login</h3>}
        {signIn?
        <TextField
          error={name}
          value={data.name}
          label="Full Name"
          InputProps={{maxLength:20,minLength:5}}
          onChange={(e)=>{setData({...data,name:e.target.value.trim()});if(name)setName(false); }}
          variant="standard"
        />:null
         }
        <TextField
          label="Email"
          value={data.email}
          error={email}
          onChange={(e)=>{
              setData({...data,email:e.target.value.trim()});
              if(email){
                setEmail(false);
                }
          }}
          variant="standard"
        />
        <TextField
           error={password}
           label="Password"
           type="password"
           value={data.password}
           onChange={(e)=>{setData({...data,password:e.target.value.trim()});if(password)setPassword(false); }}
           variant="standard"
        />
        {signIn?
          <Button onClick={handleClick} size="large"  variant="contained" color="primary" >Sign In</Button>
          :
           <Button onClick={handleClick} size="large" variant="contained" color="primary" >Login</Button>
         }
         {signIn?
         <h5>Already have an account!<span onClick={goOnLogin} >Click here</span></h5>
          :
          <h5>Don't have an account!<span onClick={goOnSignIn} >Click here</span></h5>
         }
         
        </div>
    )
}

export default Login

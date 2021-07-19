import { makeStyles} from '@material-ui/core'


const useStyle=makeStyles((theme)=>({
      navbar:{
          flexGrow:1,
          background:'linear-gradient(270deg, rgb(37, 39, 39) 0%, rgb(107, 192, 218) 160% )',
          color:'white',
        },
     navbar_title:{
         flexGrow:1,
         textDecoration:'none',
         color:'white',
         fontFamily: [
             'Chilanka',
              'cursive',
           ].join(','),
          [theme.breakpoints.up('xs')]: {
            fontSize:'15px',
          },[theme.breakpoints.up('sm')]: {
            fontSize:'25px',
          },
         [theme.breakpoints.up('md')]: {
        fontSize:'30px',
        },
     },
     home_text:{
         color:'white',
         fontFamily:[
             'Chilanka',
              'cursive',
           ].join(','),
          [theme.breakpoints.up('xs')]: {
            fontSize:'20px',
         },
         [theme.breakpoints.up('sm')]: {
            fontSize:'25px',
        },
         [theme.breakpoints.up('md')]: {
        fontSize:'30px',
        },
     },
     navbar_button:{
        fontFamily:[
             'Chilanka',
              'cursive',
           ].join(','),
         [theme.breakpoints.up('xs')]: {
            fontSize:'10px',
         },
        [theme.breakpoints.up('sm')]: {
            fontSize:'13px',
        },
         [theme.breakpoints.up('md')]: {
        fontSize:'15px',
        },
     },
     profile_avatar:{
        width:"100px",
        height:"100px",
        marginBottom:"10px",
     },
     profile_text:{
       color:'white',
       display:"grid",
        placeContent:"center"
     },
     button_center:{
         display:"grid",
        placeContent:"center",
     }
}));

export default useStyle;
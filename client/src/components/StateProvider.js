import React,{ createContext, useContext, useReducer } from "react";

export const StateContext=createContext();
export const reducer=(state,action)=>{
     switch (action.type) {

         case "setplaces":
             return{
                 ...state,
                 places:action.places,
             }
         case "setuser":
             return {
                 ...state,
                 user:action.user,
             }
         case "setuserplaces":
             return{
             ...state,
             userplaces: action.userplaces,
            }
         case "log_out":
            return{
                ...state,
               user:null, 
               userplaces:null,
             }
         default:
             return state;
     }

}

export const intialState={
    user:null,
    places:null,
    userplaces:null,
};

export const StateProvider=({reducer,intialState, children})=>(
     <StateContext.Provider value={useReducer(reducer,intialState)} >
         {children}
     </StateContext.Provider>
);

export const useStateContext=()=>useContext(StateContext);
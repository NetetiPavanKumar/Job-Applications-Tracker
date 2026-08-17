import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRef } from "react";

export default function Header({loggedin,setLoggedin,getMe}){

    const nav=useNavigate();
    const logoutRef=useRef();

    async function doLogOut(){
        try{
            let response=await axios.post("http://localhost:3000/logout",{},{
                withCredentials:true,
            })
            setLoggedin(false);
            console.log(response.data);
        }
        catch(err){
            console.log("Error while Logging out",err.response?.data);
            if(err.response?.data.includes("Empty Token")){
                console.log("Error while Logging out");
                logoutRef.current.style.display="block";
                setTimeout(()=>{
                    logoutRef.current.style.display="none";
                },2000)
            }
            else{
                setLoggedin(false);
            }
        }
    }

    return(
        <>
            <div id="header">
                <h3 className="app-title" onClick={()=>{
                    nav("/")
                }}>💼JobTracker</h3>
                <div id="header-btns">
                    <div ref={logoutRef}><button className="unauth">You are not allowed to do this action</button></div>
                    <div>
                        <button className="header-btn" onClick={()=>{
                            loggedin?doLogOut():nav("/signin");
                        }}>
                            {loggedin?`Sign Out`:`Sign In`}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
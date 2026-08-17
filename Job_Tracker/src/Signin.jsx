import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios";
import api from "./app";


export default function Signin({getMe}){

    const nav=useNavigate();

    const [logs,setLogs]=useState({userEmail:"",userPassword:""})
    const [showPass,setShowPass]=useState(false);

    const emailref=useRef();
    const passref=useRef();
    const invalidref=useRef();


    function validateEmail(){
        if(/^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]+$/.test(logs.userEmail)){
            emailref.current.style.display="none";
            return true;
        }
        emailref.current.style.display="block";
        return false;
    }


    function validatePassword(){
        if(logs.userPassword!=""){
            passref.current.style.display="none";
            return true;
        }
        passref.current.style.display="block";
        return false;

    }

    function validateData(){
        invalidref.current.style.display="none";
        let res1=validateEmail();
        let res2=validatePassword();
        
        if(res1 && res2){
            return true;
        }
        return false;
    }

    async function doLogin(){
        try{
            // let response=await axios.post("http://localhost:3000/login",{
            let response=await api.post("/login",{
                ...logs,
            },{
                withCredentials:true,
            })
            invalidref.current.style.display="none";
            console.log(response.data);
            await getMe();
            return true;
        }
        catch(err){
            invalidref.current.style.display="block";
            console.log("Loggin Failed, Enter correct credentials",err);
            return false;
        }
    }

    return(
        <>
        <div id="signup-css">
            <div id="signup-box">
                <span style={{color:"rgb(67, 56, 202)",cursor:"pointer"}} onClick={()=>{
                    nav("/")
                }}>{`<--`}Back to Home</span>
                <div id="signup-head">
                    <h2 className="app-title" onClick={()=>{
                    nav("/")
                }}>💼JobTracker</h2>
                <p>Start tracking your search</p>
                </div>
                <div id="signup-div">

                    <div className="one-inp">
                        <label htmlFor="user-email" className="label-inp">Email Address</label>
                        <input type="text" id="user-email" className="input-box" placeholder="pavankumarneteti717@gmail.com" value={logs.userEmail} onChange={(e)=>{
                            let logCopy={...logs}
                            logCopy["userEmail"]=e.target.value;
                            setLogs(logCopy);
                        }}></input>
                        <div className="err-class" ref={emailref} >* Enter a valid email</div>
                    </div>

                    <div className="one-inp">
                        <label htmlFor="user-pass" className="label-inp">Password</label>
                        <input type={showPass?"text":"password"} id="user-pass" className="input-box" placeholder="........." value={logs.userPassword} onChange={(e)=>{
                            let logCopy={...logs}
                            logCopy["userPassword"]=e.target.value;
                            setLogs(logCopy);
                        }}></input>
                        <div className="err-class" ref={passref}>* Please Enter your Password</div>
                        <div style={{margin:"5px"}}><input type="checkbox" id="show-pass" onChange={(e)=>{
                            if(e.target.checked===true){
                                setShowPass(true);
                            }
                            else{
                                setShowPass(false);
                            }
                        }}></input><label htmlFor="show-pass" style={{cursor:"pointer",backgroundColor:"rgb(232 231 237)",padding:"2px 5px",borderRadius:"2px"}}>Show Password</label></div>
                    </div>
                    <div className="err-class" ref={invalidref} style={{textAlign:"center"}}>* Invalid Email or Password</div>
                    <button id="create-acc-btn" onClick={async()=>{
                        if(validateData()){
                            let res=await doLogin();
                            if(res){
                                nav("/");
                            }
                        }
                    }}>Sign In</button>

                    <p style={{textAlign:"center"}}>Don't have an Account? <span style={{color:"rgb(67, 56, 202)",fontWeight:"bold",cursor:"pointer",}} onClick={()=>{
                        nav("/signup")
                    }}>Sign Up</span></p>

                </div>
            </div>
        </div>
    </>
    )
}
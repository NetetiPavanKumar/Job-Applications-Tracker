import { useState } from "react";
import "./SignUp.css"
import { useNavigate } from "react-router-dom"
import { useRef } from "react";
import axios from "axios";


export default function Signup(){

    const nav=useNavigate();

    const [userData,setUserData]=useState({userName:"",userEmail:"",userPassword:"",confirmPass:""});
    const [showPass,setShowPass]=useState(false);
    const [showConfirm,setShowConfirm]=useState(false);

    const nameref=useRef();
    const emailref=useRef();
    const passref=useRef();
    const confirmref=useRef();

    //Validations

    function validateName(){
        if(userData.userName.length<=2){
            nameref.current.style.display="block";
            return false;
        }
        nameref.current.style.display="none";
        return true;
    }

    function validateEmail(){
        if(/^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]+$/.test(userData.userEmail)){
            emailref.current.style.display="none";
            return true;
        }
        emailref.current.style.display="block";
        return false;
    }


    function validatePassword(){
        if(userData.userPassword.length>=8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}|:"<>?]).+$/.test(userData.userPassword)){
            passref.current.style.display="none";
            return true;
        }
        else if(userData.userPassword<8){
            passref.current.style.display="block";
            return false;
        }
        else{
            passref.current.style.display="block";
            return false;
        }
    }

    function validateConfirmPass(){
        if(userData.userPassword===userData.confirmPass){
            confirmref.current.style.display="none";
            return true;
        }
        else{
            confirmref.current.style.display="block";
            return false;
        }
    }




    function validateUserData(){
        let res1=validateName();
        let res2=validateEmail();
        let res3=validatePassword();
        let res4=validateConfirmPass();
        if(res1 && res2 && res3 && res4){
            return true;
        }
        return false;
    }


    async function sendUserData(){
        try{
            console.log("posting....")
            let response=await axios.post("http://localhost:3000/users",{
                ...userData,
            })
            console.log(response.data);
        }
        catch(err){
            console.log("Error while creating a user",err)
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
                        <label htmlFor="user-name" className="label-inp">Name *</label>
                        <input type="text" id="user-name" className="input-box" placeholder="Pavan Kumar Neteti" value={userData.userName} onChange={(e)=>{
                            let userCopy={...userData}
                            userCopy["userName"]=e.target.value;
                            setUserData(userCopy);
                        }}></input>
                        <div className="err-class" ref={nameref}>* Name should have atleast two characters</div>
                    </div>

                    <div className="one-inp">
                        <label htmlFor="user-email" className="label-inp">Email Address *</label>
                        <input type="text" id="user-email" className="input-box" placeholder="pavankumarneteti717@gmail.com" value={userData.userEmail} onChange={(e)=>{
                            let userCopy={...userData}
                            userCopy["userEmail"]=e.target.value;
                            setUserData(userCopy);
                        }}></input>
                        <div className="err-class" ref={emailref}>* Enter a valid email</div>
                    </div>

                    <div className="one-inp">
                        <label htmlFor="user-pass" className="label-inp">Password *</label>
                        <input type={showPass?"text":"password"} id="user-pass" className="input-box" placeholder="........." value={userData.userPassword} onChange={(e)=>{
                            let userCopy={...userData}
                            userCopy["userPassword"]=e.target.value;
                            setUserData(userCopy);
                        }}></input>
                        <div className="err-class" ref={passref}>{`* Password must contain atleast 8 characters 
                        including Capitals, Smalls, Digits and
                        Special Characters.`}</div>
                        <div style={{margin:"5px"}}><input type="checkbox" id="show-pass" onChange={(e)=>{
                            if(e.target.checked===true){
                                setShowPass(true);
                            }
                            else{
                                setShowPass(false);
                            }
                        }}></input><label htmlFor="show-pass" style={{cursor:"pointer",backgroundColor:"rgb(232 231 237)",padding:"2px 5px",borderRadius:"2px"}}>Show Password</label></div>
                    </div>

                    <div className="one-inp">
                        <label htmlFor="confirm-pass" className="label-inp">Confirm Password *</label>
                        <input type={showConfirm?"text":"password"} id="confirm-pass" className="input-box" placeholder="........." value={userData.confirmPass  } onChange={(e)=>{
                            let userCopy={...userData}
                            userCopy["confirmPass"]=e.target.value;
                            setUserData(userCopy);
                        }}></input>
                        <div className="err-class" ref={confirmref}>* Password Mismatched</div>
                        <div style={{margin:"5px"}}><input type="checkbox" id="confirm-show-pass" onChange={(e)=>{
                            if(e.target.checked===true){
                                setShowConfirm(true);
                            }
                            else{
                                setShowConfirm(false);
                            }
                        }}></input><label htmlFor="confirm-show-pass" style={{cursor:"pointer",backgroundColor:"rgb(232 231 237)",padding:"2px 5px",borderRadius:"2px"}}>Show Password</label></div>
                    </div>

                    <button id="create-acc-btn" onClick={async()=>{
                        if(validateUserData()){
                            console.log("Sending Data to Backend")
                            await sendUserData();
                            console.log("User Data sent to Backend")
                        }
                    }}>Create Account</button>

                    <p style={{textAlign:"center"}}>Already have an Account? <span style={{color:"rgb(67, 56, 202)",fontWeight:"bold",cursor:"pointer",}} onClick={()=>{
                        nav("/signin")
                    }}>Sign In</span></p>

                </div>
            </div>
        </div>
    </>
    )
}
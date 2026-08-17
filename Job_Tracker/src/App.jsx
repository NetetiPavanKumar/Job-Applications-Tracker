import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from "./Home"
import Signin from "./Signin"
import SignUp from "./SignUp"
import Applications from "./Applications"
import AddApp from "./AddApp"
import EditApp from "./EditApp"
import { useState } from "react"
import { useEffect } from "react"
import axios from "axios"
import "./App.css"


export default function App(){

  const [nameOfUser,setNameOfUser]=useState("");
  const [emailOfUser,setEmailOfUser]=useState("");
  const [loggedin,setLoggedin]=useState(false);
  const [loading,setLoading]=useState(true);

  async function getMe(){
    try{
      setLoading(true);
      let response=await axios.get("http://localhost:3000/me",{
        withCredentials:true,
      });
      let user=response.data;
      setNameOfUser(user.userName);
      setEmailOfUser(user.userEmail);
      setLoggedin(true);
    }
    catch(err){
      setLoggedin(false);
      console.log("Error while Authenticating",err);
    }
    finally{
      setLoading(false);
    }
  }


  useEffect(()=>{
    getMe();
  },[])

  if(loading){
    return(
        <div className="loading-screen">
          <div className="loader"></div>
          <p>Loading...</p>
        </div>
    )
  }

  return(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home loggedin={loggedin} setLoggedin={setLoggedin} getMe={getMe} />} />
      <Route path="/signin" element={<Signin getMe={getMe} />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/applications" element={loggedin?<Applications loggedin={loggedin} setLoggedin={setLoggedin} getMe={getMe} />:<Signin getMe={getMe} />} />
      <Route path="/addapplication" element={loggedin?<AddApp loggedin={loggedin} setLoggedin={setLoggedin} getMe={getMe} />:<Signin getMe={getMe} />} />
      <Route path="/editapplication/:appid" element={loggedin?<EditApp loggedin={loggedin} setLoggedin={setLoggedin} getMe={getMe} />:<Signin getMe={getMe} />} />

    </Routes>
  </BrowserRouter>
  )
}
import "./Home.css"
import Header from "./Header.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
export default function Home({loggedin,setLoggedin,getMe}){
    const nav=useNavigate();
    return(
        <div>
            <Header loggedin={loggedin} setLoggedin={setLoggedin} getMe={getMe} />
            <div id="body-home">
                    <h1>Your entire job search,
                        <span style={{display:"block",textAlign:"center",color:"#d1c7c7"}}>finally organised</span></h1>
                    <p style={{fontSize:"18px",fontFamily:"Arial, Helvetica, sans-serif",color:"rgb(148, 163, 184)"}}>
                        Track applications, prep for interviews, monitor skill progress
                        <span style={{display:"block",textAlign:"center",margin:"5px"}}>and analyse your pipeline — all in one free, private tool.</span>
                    </p>
                    <div>
                    <button className="body-btn" onClick={()=>{
                        loggedin?nav("/applications"):nav("/signin");
                    }}>
                        {loggedin? `Get Started ->` : `Start Free ->`}
                    </button>
                    {loggedin || <button className="body-btn" onClick={()=>{
                        nav("/signup")
                    }}>
                        Sign Up
                    </button>}
                    </div>
            </div>
            <div id="below-body">
                <p style={{color:"blue",fontSize:"14px",fontWeight:"bold",fontFamily:"Arial, Helvetica, sans-serif"}}>EVERYTHING YOU NEED</p>
                <h1>One app for your entire search</h1>
                <p style={{fontSize:"18px",fontFamily:"Arial, Helvetica, sans-serif",color:"GrayText"}}>From the first application to signing the offer letter, 
                <span style={{display:"block",textAlign:"center",margin:"5px"}}>JobTrack has every stage covered.</span></p>
            </div>
            <div id="cards">
                <div className="card">
                    <h3>Application Pipeline</h3>
                    <p>Track every job from Applied to Offer in one place.
                    Never lose track of a follow-up or miss a deadline again.</p>
                </div>
                <div className="card">
                    <h3>Smart Analytics</h3>
                    <p>Visualise your job search with response rates,
                    interview conversion, and source performance charts.</p>
                </div>
                <div className="card">
                    <h3>Interview Calendar</h3>
                    <p>See all assessments, interviews, deadlines, and
                    follow-ups on a clean monthly calendar.</p>
                </div>
                <div className="card">
                    <h3>Smart Reminders</h3>
                    <p>Get notified before interviews, OA deadlines, and
                    offer expirations so nothing falls through.</p>
                </div>
            </div>

            <div id="body-bottom">
                    <h1>Ready to take control of
                        <span style={{display:"block",textAlign:"center",}}>your job search?</span></h1>
                    <p style={{fontSize:"18px",fontFamily:"Arial, Helvetica, sans-serif",color:"rgb(148, 163, 184)"}}>
                        Join hundreds of developers using JobTrack to land their next role faster.
                    </p>
                    <button className="body-btn" onClick={()=>{
                        loggedin?nav("/applications"):nav("/signin");
                    }}>
                        Get Started --- It's Free {`->`}
                    </button>
            </div>
        </div>  
    )
}
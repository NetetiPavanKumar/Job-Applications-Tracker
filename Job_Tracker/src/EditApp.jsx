import { useEffect, useState } from "react";
import "./AddApp.css"
import Header from "./Header"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios";
import { useRef } from "react";
import api from "./app";

export default function EditApp({loggedin, setLoggedin, getMe}){

    const params=useParams();
    const app_id=params.appid;

    const nav=useNavigate();
    const [refer,setRefer]=useState(false);
    const [other,setOther]=useState(false);
    const [editApp,setEditApp]=useState({
        companyName:"",jobTitle:"",location:"",lpa:"",appClose:"",
        appliedOn:"",source:"",status:"",nextAction:"",nextActionDate:"",
        jobID:"",jobLink:"",remarks:"",referreeName:"",otherSource:""
    })
    const [loading,setLoading]=useState(true);


    const compref=useRef();
    const jobtitleref=useRef();
    const sourceref=useRef();
    const statusref=useRef();
    const nextref=useRef();

    function validateApp(){
        let validated=true;
        if(editApp.companyName===""){
            compref.current.style.display="block";
            validated=false
        }
        else{
            compref.current.style.display="none";
        }
        if(editApp.jobTitle===""){
            jobtitleref.current.style.display="block";
            validated=false
        }
        else{
            jobtitleref.current.style.display="none";
        }
        if(editApp.source===""){
            sourceref.current.style.display="block";
            validated=false
        }
        else{
            sourceref.current.style.display="none";
        }
        if(editApp.status===""){
            statusref.current.style.display="block";
            validated=false
        }
        else{
            statusref.current.style.display="none";
        }
        if(editApp.nextAction===""){
            nextref.current.style.display="block";
            validated=false
        }
        else{
            nextref.current.style.display="none";
        }
        return validated;
    }

    async function getApp(){
        try{
            setLoading(true);
            console.log("Sending...")
            // let response=await axios.get(`http://localhost:3000/app/${app_id}`,{
            let response=await api.get(`/app/${app_id}`,{
                withCredentials:true,
            });
            setEditApp(response.data);
            if(response.data.referreeName){
                setRefer(true);
            }
            if(response.data.otherSource){
                setOther(true);
            }
            console.log(response.data);
        }
        catch(err){
            console.log("Error while fetching app");
            if(err.response?.data.includes("Please Login")){
                setLoggedin(false);
                window.alert("Session Expired, Please Login Again");
                nav("/signin");
            }
        }
        finally{
            setLoading(false);
        }
    }


    async function updateAppData(){
        try{
            setLoading(true);
            // let response=await axios.put(`http://localhost:3000/updateapp/${app_id}`,{
            let response=await api.put(`/updateapp/${app_id}`,{
                ...editApp
            },{
                withCredentials:true,
            })
            console.log(response.data);
        }
        catch(err){
            console.log("Error while saving",err);
            if(err.response?.data.includes("Please Login")){
                setLoggedin(false);
                window.alert("Session Expired, Please Login Again");
                setTimeout(()=>{
                    nav("/signin");
                },3000);
            }
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        getApp();
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
        <>
        <Header loggedin={loggedin} setLoggedin={setLoggedin} getMe={getMe} />
        <div id="main-add-app">
            
            <div id="add-app">
                <span style={{color:"rgb(67, 56, 202)",cursor:"pointer",marginBottom:"20px"}} onClick={()=>{
                    nav("/applications")
                    }}>{`<--`}Back to Applications</span>
                <div>
                    <h1>Update Application</h1>
                    <p>Edit your Job Application</p>
                </div>
                <div id="total-inp">
                <div className="app-cont">
                    <div className="lab-inp">
                        <label htmlFor="comp-name">Company Name *</label>
                        <input type="text" id="comp-name" className="inp-box" placeholder="CodeTantra" value={editApp.companyName} onChange={(e)=>{
                            let appCopy={...editApp};
                            appCopy["companyName"]=e.target.value;
                            setEditApp(appCopy);
                        }}></input>
                        <div className="err-class" ref={compref}>* Company name is required field</div>
                    </div>
                    <div className="lab-inp">
                        <label htmlFor="job-name">Job Title *</label>
                        <input type="text" id="job-name" className="inp-box" placeholder="Software Developer" value={editApp.jobTitle} onChange={(e)=>{
                            let appCopy={...editApp};
                            appCopy["jobTitle"]=e.target.value;
                            setEditApp(appCopy);
                        }}></input>
                        <div className="err-class" ref={jobtitleref}>* Job title is required field</div>

                    </div>
                </div>
                <div className="app-cont">
                    <div className="lab-inp">
                        <label htmlFor="location">Location</label>
                        <input type="text" id="location" className="inp-box" placeholder="Hyderabad" value={editApp.location} onChange={(e)=>{
                            let appCopy={...editApp};
                            appCopy["location"]=e.target.value;
                            setEditApp(appCopy);
                        }}></input>
                    </div>
                    <div className="lab-inp">
                        <label htmlFor="lpa">LPA</label>
                        <input type="text" id="lpa" className="inp-box" placeholder="7-20 LPA" value={editApp.lpa} onChange={(e)=>{
                            let appCopy={...editApp};
                            appCopy["lpa"]=e.target.value;
                            setEditApp(appCopy);
                        }}></input>
                    </div>
                </div>
                <div className="app-cont">
                    <div className="lab-inp">
                        <label htmlFor="closing">Application Closing Date</label>
                        <input type="date" id="closing" className="inp-box" value={editApp.appClose ? editApp.appClose.split("T")[0] : ""} onChange={(e)=>{
                            let appCopy={...editApp};
                            appCopy["appClose"]=e.target.value;
                            setEditApp(appCopy);
                        }}></input>
                    </div>
                    <div className="lab-inp">
                        <label htmlFor="applied-on">Applied On</label>
                        <input type="date" id="applied-on" className="inp-box" value={editApp.appliedOn ? editApp.appliedOn.split("T")[0] : ""} onChange={(e)=>{
                            let appCopy={...editApp};
                            appCopy["appliedOn"]=e.target.value;
                            setEditApp(appCopy);
                        }}></input>
                    </div>
                </div>
                <div className="app-cont">
                    <div className="lab-inp">
                        <label htmlFor="source">Source *</label>
                        <select className="inp-box" value={editApp.source} onChange={(e)=>{
                            if(e.target.value==="Referral"){
                                setRefer(true);
                                setOther(false);
                            }
                            else if(e.target.value==="Other"){
                                setOther(true);
                                setRefer(false);
                            }
                            else{
                                setRefer(false);
                                setOther(false);
                            }
                            
                            let appCopy={...editApp};
                            appCopy["source"]=e.target.value;
                            setEditApp(appCopy);
                        }}>
                            <option value={""}>==Select Source==</option>
                            <option value={"Linked in"}>Linked in</option>
                            <option value={"Naukari"}>Naukari</option>
                            <option value={"Referral"}>Referral</option>
                            <option value={"Other"}>Other</option>
                        </select>
                        <div className="err-class" ref={sourceref}>* Source is required field</div>
                    </div>
                    <div className="lab-inp">
                        <label htmlFor="status">Status *</label>
                        <select className="inp-box" value={editApp.status} onChange={(e)=>{
                            let appCopy={...editApp};
                            appCopy["status"]=e.target.value;
                            setEditApp(appCopy);
                        }}>
                            <option value={""}>==Select Status==</option>
                            <option value={"Not Applied Yet"}>Not Applied Yet</option>
                            <option value={"Applied"}>Applied</option>
                            <option value={"Assessment/Written"}>Assesment/Written</option>
                            <option value={"Interview"}>Interview</option>
                            <option value={"Selected"}>Selected</option>
                            <option value={"Offer Letter"}>Offer Letter</option>
                            <option value={"Rejected"}>Rejected</option>
                            <option value={"Onboarding"}>Onboarding</option>
                            <option value={"Joining Letter"}>Joining Letter</option>
                        </select>
                        <div className="err-class" ref={statusref}>* Status is required field</div>

                    </div>
                </div>
                {(refer || other) && <div className="app-link-inp">
                    <div className="lab-inp">
                        <label htmlFor="app-link">{refer?"Refferee Name":other?"Other Source Name":""}</label>
                        <input type="text" id="app-link" className="inp-box-1" placeholder={refer?"Pavan Kumar Neteti":other?"Whatsapp Channel Name/Friends/etc....":""} value={refer?editApp.referreeName:editApp.otherSource} onChange={(e)=>{
                            let appCopy={...editApp};
                            if(refer){
                                appCopy["referreeName"]=e.target.value;
                            }
                            else if(other){
                                appCopy["otherSource"]=e.target.value;
                            }
                            setEditApp(appCopy);
                        }}></input>
                    </div>
                </div>}
                <div className="app-cont">
                    <div className="lab-inp">
                        <label htmlFor="status">Next Action *</label>
                        <select className="inp-box" value={editApp.nextAction} onChange={(e)=>{
                            let appCopy={...editApp};
                            appCopy["nextAction"]=e.target.value;
                            setEditApp(appCopy);
                        }}>
                            <option value={""}>==Select Next Action==</option>
                            <option value={"Apply"}>Apply</option>
                            <option value={"notReq"}>Not Required</option>
                            <option value={"Assessment/Written"}>Assesment/Written</option>
                            <option value={"Interview"}>Interview</option>
                            <option value={"Offer Letter"}>Waiting for Offer Letter</option>
                            <option value={"Onboarding"}>Waiting for Onboarding Process</option>
                            <option value={"Joining Letter"}>Waiting Joining Letter</option>
                        </select>
                        <div className="err-class" ref={nextref}>* Next Action is required field</div>
                        
                    </div>
                    <div className="lab-inp">
                        <label htmlFor="next-action">Next Action Date</label>
                        <input type="date" id="next-action" className="inp-box" value={editApp.nextActionDate ? editApp.nextActionDate.split("T")[0] : ""} onChange={(e)=>{
                            let appCopy={...editApp};
                            appCopy["nextActionDate"]=e.target.value;
                            setEditApp(appCopy);
                        }}></input>
                    </div>
                </div>
                <div className="app-link-inp">
                    <div className="lab-inp">
                        <label htmlFor="job-id">Job ID</label>
                        <input type="text" id="job-id" className="inp-box" placeholder="TCS2025XXXXX" value={editApp.jobID} onChange={(e)=>{
                            let appCopy={...editApp};
                            appCopy["jobID"]=e.target.value;
                            setEditApp(appCopy);
                        }}></input>
                    </div>
                </div>
                <div className="app-link-inp">
                    <div className="lab-inp">
                        <label htmlFor="app-link">Application Link</label>
                        <input type="text" id="app-link" className="inp-box-1" placeholder="Paste the Job Application Link" value={editApp.jobLink} onChange={(e)=>{
                            let appCopy={...editApp};
                            appCopy["jobLink"]=e.target.value;
                            setEditApp(appCopy);
                        }}></input>
                    </div>
                </div>
                <div className="app-link-inp">
                <div className="lab-inp">
                    <label htmlFor="remarks">Remarks</label>
                    <textarea rows={10} id="remarks" className="text-area" placeholder="Write your Remarks here" value={editApp.remarks} onChange={(e)=>{
                            let appCopy={...editApp};
                            appCopy["remarks"]=e.target.value;
                            setEditApp(appCopy);
                        }}/>
                </div>
                </div>
                <div style={{textAlign:"center"}}><button id="add-app-btn" onClick={async ()=>{
                    if(validateApp()){
                        await updateAppData();
                        nav("/applications")
                    }
                }}>Update Application</button></div>
                </div>
            </div>
        </div>
        </>
    )
}
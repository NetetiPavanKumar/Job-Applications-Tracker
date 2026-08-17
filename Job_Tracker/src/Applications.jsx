import { useEffect, useState } from "react";
import "./Applications.css"
import Header from "./Header"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2, Pencil } from "lucide-react";


export default function Applications({loggedin, setLoggedin, getMe}){

    
    const nav=useNavigate();
    const filters=["All", "Not Applied Yet", "Applied", "Assessment/Written", "Interview", "Selected", "Offer Letter", "Rejected", "Onboarding", "Joining Letter"];
    const [apps,setApps]=useState([]);
    const [dummmyapps,setDummyApps]=useState([]);
    const statusValues={"Rejected":0, "Not Applied Yet":1, "Applied":2, "Assessment/Written":3, "Interview":4, "Selected":5, "Offer Letter":6, "Onboarding":7, "Joining Letter":8};
    const [paginatedApps,setPaginatedApps]=useState([]);
    const [noOfApps,setNoOfApps]=useState(5);
    const [sfs,setSFS]=useState([]);
    const [currPage,setCurrPage]=useState(1);
    const [activeFilter, setActiveFilter] = useState("All");
    const [search,setSearch]=useState("");
    const [filterby,setFilterBy]=useState("All");
    const [sortby,setSortBy]=useState("");
    const [loading,setLoading]=useState(true);




    function searchRes(aps,inp){
        let dapps=[...aps];
        if(inp.trim()!=""){
            const dumapps=dapps.filter((app)=>{
                if(app.companyName.toLowerCase().includes(inp.toLowerCase()) ||
                app.jobTitle.toLowerCase().includes(inp.toLowerCase()) ||
                app.jobID.toLowerCase().includes(inp.toLowerCase())){
                    return true;
                }
                return false;
            })
            return dumapps;
        }
        return dapps;
    }

    function sortBy(sortapps,sortedby){
        if(sortedby==="Closing Date(asc)"){
            sortapps.sort((a,b)=>{
                return new Date(a.appClose)- new Date(b.appClose);
            })
        }
        else if(sortedby==="Status(asc)"){
            sortapps.sort((a,b)=>{
                console.log(statusValues[a.status])
                return statusValues[a.status]-(statusValues[b.status])
            })
        }
        else if(sortedby==="lpa(asc)"){
            sortapps.sort((a,b)=>{
                return Number(a.lpa)-Number(b.lpa);
            })
        }
        else if(sortedby==="Closing Date(desc)"){
            sortapps.sort((a,b)=>{
                return new Date(b.appClose)- new Date(a.appClose);
            })
        }
        else if(sortedby==="Status(desc)"){
            sortapps.sort((a,b)=>{
                return statusValues[b.status]-(statusValues[a.status])
            })
        }
        else if(sortedby==="lpa(desc)"){
            sortapps.sort((a,b)=>{
                return Number(b.lpa)-Number(a.lpa);
            })
        }
        console.log(sortapps);
        return sortapps;
    }

    function filteredBy(filterApps,btnName){
        let filteredapps=[...filterApps];
        if(btnName==="All"){
            return filteredapps;
        }
        if(btnName!=""){
            let filterapps=filteredapps.filter((app)=>{
                if(app.status===btnName){
                    return true;
                }
                return false;
            })
            return filterapps;
        }
        return filteredapps;
    }

    function applyChanges(aps,searchInp,sortInp,filterInp){
        let res;
        res=searchRes(aps,searchInp);
        console.log("Search Inp", searchInp);
        console.log("Search Res", res);
        res=sortBy(res,sortInp);
        console.log("SortInp", sortInp);
        console.log("Sort Res", res);
        res=filteredBy(res,filterInp);
        console.log("Filter Inp", filterInp);
        console.log("Filter Res",res)
        setPaginatedApps(res);
        paginate(noOfApps,1,res);
        setCurrPage(1);
    }

    async function getApps(){
        try{
            setLoading(true);
            let response=await axios.get("http://localhost:3000/apps",{
                withCredentials:true,
            });
            setApps(response.data);
            setDummyApps(response.data);
            // setPaginatedApps(response.data);
            // paginate(5,1,response.data);
            applyChanges(response.data,search,sortby,filterby);
            console.log("Apps",response.data);
        }
        catch(err){
            console.log("Error while fetching Apps", err.response?.data);
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

    function showPageBtns(){
        let page_btns=[];
        let noOfPages=Math.ceil(paginatedApps.length/noOfApps);
        console.log(noOfPages,page_btns);
        for(let i=0; i<noOfPages; i++){
            page_btns.push(i+1);
        }
        let page_btns_array=[]
        let btns=[]
        page_btns_array.push(<button className={currPage<=1?"page-btns-disabled":"page-btns"} onClick={(e)=>{
            if(currPage>1){
            paginate(noOfApps,currPage-1,paginatedApps);
            let cp=currPage-1;
            setCurrPage(cp);
            }
        }}>{"<--Prev"}</button>)
        if(noOfPages>2){
            btns=page_btns.slice(0,2).map((btn,ind)=>{
                return(
                    <>
                        <button key={ind} className={currPage===btn?"page-btns-active":"page-btns"} onClick={(e)=>{
                            paginate(noOfApps,btn,paginatedApps);
                            setCurrPage(Number(btn));
                        }}>{btn}</button>
                    </>
                )
            })
            btns.push(<><button className={currPage>2 && currPage<page_btns.length?"page-btns-active":"page-btns"}>...</button><button className={currPage===page_btns.length?"page-btns-active":"page-btns"} onClick={(e)=>{
                paginate(noOfApps,page_btns.length,paginatedApps);
                setCurrPage(page_btns.length)
            }}>{page_btns.length}</button></>);
        }
        else{
            btns=page_btns.map((btn,ind)=>{
                return(
                    <>
                        <button key={ind} className={currPage===btn?"page-btns-active":"page-btns"} onClick={(e)=>{
                            paginate(noOfApps,btn,paginatedApps);
                            setCurrPage(Number(btn))
                        }}>{btn}</button>
                    </>
                )
        })
    }
        page_btns_array.push(btns);
        page_btns_array.push(<button className={currPage>=noOfPages?"page-btns-disabled":"page-btns"} onClick={(e)=>{
            if(currPage<noOfPages){
            paginate(noOfApps,currPage+1,paginatedApps);
            let cp=currPage+1;
            setCurrPage(cp);
            }
        }}>{"Next-->"}</button>);
        return page_btns_array;
    }

    function paginate(fields,curr_page,pagableApps){
        let start=(curr_page-1)*fields;
        let end=curr_page*fields;
        let dumapps=pagableApps.slice(start,end);
        setDummyApps(dumapps);
    }


    async function deleteApp(id){
        try{
            let response=await axios.delete(`http://localhost:3000/delapp/${id}`,{
                withCredentials:true,
            });
            getApps();
            console.log(response.data);
        }
        catch(err){
            console.log("Error while deleting app",err);
            if(err.response?.data.includes("Please Login")){
                setLoggedin(false);
                window.alert("Session Expired, Please Login Again");
                nav("/signin");

            }
        }
        
    }

    useEffect(()=>{
        getApps();
    },[]);


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
            <div id="apps-main">
                <div id="apps-head">
                    <div>
                        <h2>Job Applications</h2>
                        <p>Track your job applications and stay organized throughout your job search.</p>
                    </div>
                    <div id="apps-btn"><button style={{marginBottom:"15px"}} onClick={()=>{
                        nav("/addapplication")
                    }}>Add New Application</button></div>
                </div>
                <div id="apps-table">
                    <div id="search-sort">
                    
                        <input type="search" placeholder="Search by Job ID, Company, Role" id="apps-search" onChange={(e)=>{
                            setSearch(e.target.value);
                            applyChanges(apps,e.target.value,sortby,filterby);
                        }}></input>
                        <div id="select-sort">
                            <select onChange={(e)=>{
                                setSortBy(e.target.value);
                                applyChanges(apps,search,e.target.value,filterby);
                            }}>
                                <optgroup>
                                    <option value={""}>==Sort By==</option>
                                </optgroup>
                                <optgroup>
                                    <option value={"Closing Date(asc)"}>Closing Date ↑ asc</option>
                                    <option value={"Closing Date(desc)"}>Closing Date ↓ desc</option>
                                </optgroup>
                                <optgroup>
                                    <option value={"Status(asc)"}>Status ↑ asc</option>
                                    <option value={"Status(desc)"}>Status ↓ desc</option>
                                </optgroup>
                                <optgroup>
                                    <option value={"lpa(asc)"}>LPA ↑ asc</option>
                                    <option value={"lpa(desc)"}>LPA ↓ desc</option>
                                </optgroup>
                            </select>
                            <select id="page-size" onChange={(e)=>{
                                paginate(e.target.value,1,paginatedApps);
                                setNoOfApps(e.target.value);
                            }}>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                            </select>
                        </div>
                    </div>
                    <div style={{marginBottom:"50px"}}>
                    {
                        filters.map((btn, ind)=>{
                            return(
                                <button className={`filter-btns ${activeFilter === btn ? "active-filter" : ""}`}key={ind} value={btn} onClick={(e)=>{
                                    setActiveFilter(btn);
                                    setFilterBy(e.target.value);
                                    applyChanges(apps,search,sortby,e.target.value);
                                }}>{btn}</button>
                            )
                        })
                    }
                    </div>
                    <div id="table-container">
                    <table id="table-data">
                        <colgroup>
                            <col style={{width:"5%"}} />
                            <col style={{width:"5%"}} />
                            <col style={{width:"10%"}} />
                            <col style={{width:"10%"}} />
                            <col style={{width:"10%"}} />
                            <col style={{width:"10%"}} />
                            <col style={{width:"10%"}} />
                            <col style={{width:"10%"}} />
                            <col style={{width:"10%"}} />
                            <col style={{width:"10%"}} />
                            <col style={{width:"5%"}} />
                            <col style={{width:"20%"}} />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Edit</th>
                                <th>Delete</th>
                                <th>Sl.No</th>
                                <th>Job ID</th>
                                <th>Company</th>
                                <th>Role</th>
                                <th>Location</th>
                                <th>Closing Date</th>
                                <th>Applied on</th>
                                <th>Source</th>
                                <th>Status</th>
                                <th>Application Link</th>
                                <th>LPA</th>
                                <th>Remarks</th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dummmyapps && dummmyapps.map((app,ind)=>{
                                    return(
                                        <tr key={app._id}>
                                            <td><button id="edit-btn" onClick={()=>{
                                                nav(`/editapplication/${app._id}`);
                                            }}><Pencil size={14} strokeWidth={2.2} /></button></td>
                                            <td><button id="delete-btn" onClick={()=>{
                                                deleteApp(app._id);
                                            }}><Trash2 size={14} strokeWidth={2} /></button></td>
                                            <td>{(currPage-1)*noOfApps+ind+1}</td>
                                            <td>{app.jobID || "No ID"}</td>
                                            <td>{app.companyName}</td>
                                            <td>{app.jobTitle}</td>
                                            <td>{app.location || "No Info"}</td>
                                            <td>{app.appClose?new Date(app.appClose).toLocaleDateString(): "No Info"}</td>
                                            <td>{app.appliedOn?new Date(app.appliedOn).toLocaleDateString():"NA"}</td>
                                            <td>{app.source}</td>
                                            <td>{app.status}</td>
                                            <td>{app.jobLink?<a href={app.jobLink} target="_blank" style={{textDecoration:"none",fontWeight:600}}>Click here</a>:"NA"}</td>
                                            <td>{app.lpa || "NA"}</td>
                                            <td>{app.remarks || "NA"}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                        {dummmyapps.length==0?<div id="no-data">No data found</div>:""}
                    </div>
                    <div id="pages-area">{showPageBtns()}</div>
                </div>
            </div>
        </>
    )
}
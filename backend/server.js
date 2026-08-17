const express=require("express");
const app=express();
const mongoose=require("mongoose");
const cors=require("cors");
const cookieParser=require("cookie-parser");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
require("dotenv").config();


app.listen(process.env.PORT_NO,()=>{
    console.log("Server Running on Port 3000....");
})

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MDB_CONNECTION_STR).then(()=>{
    console.log("MongoDB connected Successfully....");
})

const UserSchema=mongoose.Schema({
    userName:{
        type:String,
        required:true,
    },
    userEmail:{
        type:String,
        required:true,
        unique:true,
    },
    userPassword:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})


const AppsSchema = mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true,
    },
    companyName:{
        type:String,
        required:true,
    },
    jobTitle:{
        type:String,
        required:true,
    },
    location:{
        type:String,
    },
    lpa:{
        type:Number,
    },
    appClose:{
        type:Date,
    },
    appliedOn:{
        type:Date,
    },
    source:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
    nextAction:{
        type:String,
        required:true,
    },
    nextActionDate:{
        type:Date,
    },
    jobID:{
        type:String,
    },
    jobLink:{
        type:String,
    },
    remarks:{
        type:String,
    },
    referreeName:{
        type:String,
    },
    otherSource:{
        type:String,
    }
})

const Users=mongoose.model("User", UserSchema);
const Apps=mongoose.model("App",AppsSchema);



function authMiddleWare(req,res,next){
    try{
        const tok=req.cookies.token;
        if(tok){
            let decoded= jwt.verify(tok,process.env.SECRET_KEY);
            req.user=decoded;
            console.log("ReqdotUser",req.user);
            next();
        }
        else {
            return res.status(401).json("Empty token, Please Login");
        }
    }
    catch(err){
        console.log("Wrong Token or Token Expired, Please Login Again....",err);
        res.status(401).json("Token Expired, Please Login");
    }
}


app.post("/users",async(req,res)=>{
    try{
        console.log("creating User...")
        const {userName,userEmail,userPassword}=req.body;
        let encryptedPass=await bcrypt.hash(userPassword,12);
        let userExists=await Users.findOne({userEmail});
        if(userExists){
            console.log("User already Existed....")
            return res.status(201).json("User already Exist");
        }
        await Users.create({
            userName,
            userEmail,
            userPassword:encryptedPass,
        })
        console.log("User created....");
        res.status(201).json("User Created")
    }
    catch(err){
        console.log("Error while adding to user to Users....",err);
        res.status(500).json("Something went wrong, please try again")
    }
})



app.post("/login",async(req,res)=>{
    try{
    const {userEmail,userPassword}=req.body;
    let user=await Users.findOne({userEmail});
    if (!user) {
        return res.status(401).json("Invalid Credentials");
    }
    const pass=await bcrypt.compare(userPassword,user.userPassword);
    console.log("Pass",pass)
    if(user && pass){
        let userName=user.userName
        const token=jwt.sign({userName,userEmail},process.env.SECRET_KEY,{
            expiresIn:"1d",
        });
        res.cookie("token",token,{
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })
        console.log("Token", token)
        return res.status(200).json("Successfully Logged in");
    }
    else{
        console.log("Login Failed....");
        return res.status(402).json("Invalid Creds");
    }
}
catch(err){
    console.log("Something wrong....");
    return res.status(402).json("Bad Request");
}
})

app.get("/me",authMiddleWare,(req,res)=>{
    res.status(200).json(req.user);
})

app.post("/logout",authMiddleWare,(req,res)=>{
    try{
        res.clearCookie("token",{
                httpOnly: true,
                secure: true,
                sameSite: "none"
            });
        res.status(200).json("Logged Out successfully");
    }
    catch(err){
        res.status(400).json("Bad Request, Try again to Logout");
    }
})

app.post("/saveapp",authMiddleWare,async (req,res)=>{
    try{
        console.log("saving")

        console.log("reqbody",req.body);
        const {companyName,jobTitle,jobID,jobLink,source,
            status,location,lpa,appClose,appliedOn,nextAction,
            nextActionDate,remarks,referreeName,otherSource} = req.body;
        const email=req.user.userEmail;
        const user_id=await Users.findOne({userEmail:email});
        await Apps.create({
            userID:user_id,
            companyName,jobTitle,jobID,jobLink,source,
            status,location,lpa,appClose,appliedOn,nextAction,
            nextActionDate,remarks,referreeName,otherSource
        });
        console.log("saved");
        res.status(200).json("App Saved");
    }
    catch(err){
        console.log("Error while saving app",err);
        res.status(400).json("Please try again")
    }
})

app.get("/apps",authMiddleWare,async(req,res)=>{
    try{
        const applications=await Apps.find();
        res.status(201).json(applications);
    }
    catch(err){
        console.log("Error while fetching apps",err);
        res.status(500).json("Something went wrong");
    }
})

app.get("/app/:appID",authMiddleWare,async (req,res)=>{
    try{
        const appid=req.params.appID;
        console.log(appid);
        const app=await Apps.findOne({_id:appid});
        console.log("App",app);
        res.status(201).json(app)
    }
    catch(err){
        console.log("Error while fetching app",err);
        res.status(404).json("App not found");
    }
})

app.put("/updateapp/:appid",authMiddleWare,async (req,res)=>{
    try{
        // const {companyName,jobTitle,jobID,jobLink,source,
        //     status,location,lpa,appClose,appliedOn,nextAction,
        //     nextActionDate,remarks,referreeName,otherSource} = req.body;
        const appid=req.params.appid;
        const app=await Apps.findOneAndUpdate({_id:appid},{$set:{...req.body}});
        console.log("Updated the App....");
        res.status(201).json("Updated Successfully....")
    }
    catch(err){
        console.log("Error while updating App",err);
        res.status(500).json("Updating App failed->Something went wrong, please try again.");
    }
})


app.delete("/delapp/:id",authMiddleWare,async(req,res)=>{
    try{
        console.log("Deleting....");
        const app=req.params.id;
        await Apps.findOneAndDelete({_id:app});
        console.log("Deleted....");
        res.status(201).json("Deleted Successfully....");
    }
    catch(err){
        console.log("Error while deleting....");
        res.status(500).json("Something went wrong....")
    }
})
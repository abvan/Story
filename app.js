const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express()

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.mail;

    const data = {
        members: [
            {
                email_address : email,
                status : "subscribed" ,
                merge_fields :{
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us12.api.mailchimp.com/3.0/lists/4a9df398b3"
    const options = {
        method: "POST",
        auth: "abvan1:1fd314df0717db50ad2c51bfdd0eaafae-us12"
    }
    
    const request = https.request(url,options,function(response){
        
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){
            const serverResponse = JSON.parse(data);
            console.log(serverResponse);
        })
    })
    
    request.write(jsonData);
    request.end();
    console.log(firstName , lastName , email);
})

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(req,res){
    console.log("This server is up and running");
})

//api key
//fd314df0717db50ad2c51bfdd0eaafae-us12

//list id
//4a9df398b3
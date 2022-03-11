/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Klaus Cepani    Student ID: 157246208 Date: 3/09/2020
*
* Online (Heroku) Link: https://warm-hollows-70854.herokuapp.com/
*
********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const path = require("path");
const userMod = require("./modules/collegeData.js");
var app = express();
app.use(express.static("public"));
// setup a 'route' to listen on the default url path
app.use((req,res,next)=>{

let userAgent=req.get("user-agent");
console.log(userAgent);
next();
})

app.use(express.urlencoded({extended: true}));



app.get("/students", (req,res)=>{

    if(req.query.course){
        userMod.getStudentsByCourse(req.query.course).then(students=>{
            res.json(students); // or res.send() would work here too
            console.log(students.length);
        }).catch(err=>{
           
            res.json({message:"no results"}); // show the error to the user
        })
    }else{
        userMod.getAllStudents().then(students=>{
            res.json(students); // or res.send() would work here too
        }).catch(err=>{
            res.senc({message:"no results"}); // show the error to the user
        });
    }
});

app.get("/tas", (req,res)=>{
        userMod.getTAs().then(tas=>{
            res.json(tas); // or res.send() would work here too
        }).catch(err=>{
            res.json({message:"no results"}); // show the error to the user
        });
   });

   app.get("/courses", (req,res)=>{
    userMod.getCourses().then(courses=>{
        res.json(courses); // or res.send() would work here too
    }).catch(err=>{
        res.json({message:"no results"}); // show the error to the user
    });
});

app.get("/student/:num", (req,res)=>{
    //res.send("TODO: GET User By Id: " + req.params.id);
    userMod.getStudentByNum(req.params.num).then(user=>{
        res.json(user);
    }).catch(err=>{
        
        res.json({message:"no results"}); // show the error to the user
    });
});

app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname, "/views/home.html"));
    
});

app.get("/htmlDemo", (req,res)=>{
    res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
});

app.get("/home", (req,res)=>{
    res.sendFile(path.join(__dirname, "/views/home.html"));
});
app.get("/easter", (req,res)=>{
    res.sendFile(path.join(__dirname, "/views/easteregg.html"));
});

app.get("/students/add", (req,res)=>{
    res.sendFile(path.join(__dirname, "/views/addStudent.html"));
});

app.get("/about", (req,res)=>{ 
    
    res.sendFile(path.join(__dirname, "/views/about.html"));
   
});
app.post("/students/add", (req,res)=>{
    req.body.TA = (req.body.TA) ? true : false;   
      userMod.addStudent(req.body).then(()=>{
        res.redirect("/students");
        }).catch((err)=>{
        
        res.json("Error");
    });
    
});

app.use((req,res,next)=>{
    res.status(404).sendFile(path.join(__dirname, "/views/route.html"))// .sendFile(), .json(), etc or .end() (sends nothing back)
});

userMod.initialize().then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log("server listening on: " + HTTP_PORT);
    });
}).catch(err=>{
    console.log(err)
});

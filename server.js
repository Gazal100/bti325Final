var express = require("express")
var final = express()
var data = require("./final")
var path = require("path")
var HTTP_PORT = process.env.PORT ||4040

function onHttpStart(){
    console.log("Express http server listening on " + HTTP_PORT);
}

final.get("/", function(req, res){
    res.sendFile(path.join(__dirname,'/views/home.html' ))
});

final.get("/register", function(req, res){
    res.render("register")
});

final.post("/register", function(req, res){
    data.register(req.body)
      .then(() => {res.render("register", { successMessage: "User created" })})
      .catch((err) => {
        res.render("register", {
          errorMessage: err,
          userName: req.body.userName,
        });
    });
});

final.get("/signIn", function(req, res){
    res.render("signIn")
});

final.post("/signIn", function(req, res){
    req.body.userAgent = req.get("User-Agent");
    data.login(req.body)
      .then((user) => {
        req.session.user = {
          userName: user.userName, 
          email: user.email, 
        };
      })
      .catch((err) => {
        res.render("login", { errorMessage: err, userName: req.body.userName });
      });
});

data.startDB().then(()=>{
    final.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
    console.log(err);
})
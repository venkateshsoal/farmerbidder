const express = require('express')
const app = express()
const { pool } = require("./dbConfig");

const port = 3000

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false})); 

app.get('/', (req, res) => {
    res.render("index");
});

app.get("/users/register",(req, res) => {
    res.render("register");
});

app.get("/users/login",(req, res) => {
    res.render("login");
});

app.get("/users/dashboard",(req, res) => {
    res.render("dashboard", {user: "venki"});
});

app.post("/users/register",(req, res) => {
    let { name, email, phonenumber, catg } = req.body;
    
    console.log({
        name,
        email,
        phonenumber,
        catg
    })
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
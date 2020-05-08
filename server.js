const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const { pool } = require("./dbConfig");
// const flash = require("express-flash");
// const session = require("express-session");


const port = 3000
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false})); 
//app.use(flash());

// app.use(
//     session({
//       // Key we want to keep secret which will encrypt all of our information
//       secret: process.env.SESSION_SECRET,
//       // Should we resave our session variables if nothing has changes which we dont
//       resave: false,
//       // Save empty value if there is no vaue which we do not want to do
//       saveUninitialized: false
//     })
//   );

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

app.post("/users/register",async(req, res) => {
    let { name, email, phonenumber, catg } = req.body;
    //console.log(req);
    //console.log('@@@@@@',req.body);
    console.log({
        name,
        email,
        phonenumber,
        catg
    });
     
    let errors = [];
    if(!name || !email || !phonenumber){
        errors.push({meassage: "please enter all the fields"});
    }

    if(phonenumber.length != 10){
        errors.push({message: "enter 10 digit mobile number"});
    }

    if(errors.length > 0) {
        res.render("register",{errors});
    } else {
        pool.query(`SELECT * FROM users WHERE email =$1`,
        [email], (err, results) => {
            if (err) {
              console.log(err);
            }
            console.log(results.rows);

            if(results.length.rows >0){
                errors.push({message: "email already registerd"});
                res.render("register", {errors});
            }
            else {
                pool.query(
                  `INSERT INTO users (name, email, phonenumber, catg)
                      VALUES ($1, $2, $3, $4)
                      RETURNING id`,
                  [name, email, phonenumber, catg],
                  (err, results) => {
                    if (err) {
                      throw err;
                    }
                    console.log(results.rows);
                    req.flash("success_msg", "You are now registered. Please log in");
                    res.redirect("/users/login");
                  }
                );
              }
        });
        
    }

});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
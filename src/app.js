const express = require("express")
const c = require('../routes/c')

const favicon = require('serve-favicon');

const app = express()
const bodyParser = require('body-parser')

const session = require('express-session');
const flash = require('connect-flash');
const { check, validationResult } = require('express-validator');

const { Handlebars } = require('handlebars');

const nodemailer = require('nodemailer');

const path = require("path")
const hbs = require("hbs")

require("./db/conn")
const Register = require("./models/registers")
const Contact = require("./models/contact")
const port = 3000


const static_path = path.join(__dirname, "../public")
const templates_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")

app.use('/c-notes', c)

app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(static_path))


app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 } // Adjust the cookie settings as needed
}));
app.use(flash());

app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));



app.set("view engine", "hbs")
app.set("views", templates_path)
hbs.registerPartials(partials_path)

app.get("/", (req, res) => {
    res.render("home")

})

app.get("/register", (req, res) => {
    res.render("registration")

})
app.get("/login", (req, res) => {
    res.render("login")

})
app.get("/contactt", (req, res) => {
    res.render("contact")

})
app.get("/about", (req, res) => {
    res.render("about")

})
app.get("/home", (req, res) => {
    res.render("home")

})


app.post("/register", [
    check('name').notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be up to 3 charactors'),
    check('email').isEmail().withMessage('Invalid Email Address'),
    check('password').notEmpty().withMessage('password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        console.log("Validation Errors:", errors.array());


        res.render('registration', { errors: errors.mapped() });
    }
    else {


        try {
            console.log(req.body.name);
            console.log(req.body.email);
            console.log(req.body.password);

            const userRegister = new Register({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            const duplicateEmail = await Register.findOne({ email: req.body.email });
            if (duplicateEmail) {
                // Display alert box
                res.send("<script>alert('Email already exists. Please choose a different email.'); window.location.href='/register';</script>");
            } else {
                const registered = await userRegister.save();
                res.status(201).render("home");

            }

        } catch (error) {
             /*if (error.code === 11000) {
                console.log("Duplicate Key Error:", error);
                res.status(400).send({ error: 'Duplicate key error', message: 'Email already exists' });*/
            res.status(400).send(error);
             }
        
    }
});

app.post("/login", [
    check('email').isEmail().withMessage('Invalid Email address'),
    check('password').notEmpty().withMessage('Password Invalid')
], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        console.log("Validation Errors:", errors.array());

        res.render('login', { errors: errors.mapped() });
    }
    else {

    try {
        console.log(req.body.email);
        console.log(req.body.password);

        const email = req.body.email
        const password = req.body.password

        const useremail = await Register.findOne({ email })

        if (useremail.password == password) {
            res.status(201).render("home");
        }
        else {
            return res.render('login', { passwordInvalid: true });
        }

    } catch (error) {
        res.status(400).send(error);
    }
}

})

app.post("/contact", [
    check('name').notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be up to 3 charactors'),
    check('phone').notEmpty().withMessage('Phone Number Is Required').isLength({ min: 10 }).withMessage('Invalid Phone Number'),
    check('email').isEmail().withMessage('Invalid Email Address'),
    check('text').notEmpty().withMessage('Text field is Required')

], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        console.log("Validation Errors:", errors.array());

        res.render('contact', { errors: errors.mapped() });
    }
    else {


        try {
            console.log(req.body.name);
            console.log(req.body.email);
            console.log(req.body.phone);
            console.log(req.body.text);

            const userContact = new Contact({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                text: req.body.text
            });

            const contactSaved = await userContact.save();
            res.status(201).render("contact");
        } catch (error) {
            res.status(400).send(error);
        }
    }
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const usersSchema = new mongoose.Schema({
    email: String,
    password: String
});

usersSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model('User', usersSchema);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    User.findOne({ email }, (err, foundUser) => {
        if (!err && foundUser) {
            if (foundUser.password === password) {
                return res.render('secrets');
            }
        }
        console.log('Error - Login Failed.');
    });
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const user = new User({
        email: req.body.username,
        password: req.body.password
    });

    user.save((err) => {
        if (!err) {
            res.render('secrets');
        } else {
            console.log(err);
        }
    });
});


app.listen(3000, () => {
    console.log('Server started on port 3000.');
});

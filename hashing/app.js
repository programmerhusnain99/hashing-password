require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const md5 = require('md5');

const User = require('./Schema/User');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/Udemy_Authentications_3', { useNewUrlParser: true });
mongoose.connection.once('open', () => {
    console.log('Database is connected');
});

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/views/home.html')
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/login.html')
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/views/register.html')
});

// user registration
app.post('/register', (req, res) => {
    const newUser = User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save((err) => {
        if (err) {
            console.log(err);
        } else {
            res.sendFile(__dirname + '/views/secrets.html');
        };
    });
});

// user login
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({ email: username }, (err, found) => {
        if (err) {
            console.log(err);
        } else if (found) {
            if (found.password === password){
                res.sendFile(__dirname + '/views/secrets.html');
            } else {
                res.send('password is not correct')
            }
        } else {
            res.send('email or password is not correct');
        };
    });
});

app.listen(4000, () => {
    console.log('Port is connected at 4000');
});


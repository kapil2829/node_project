const express = require('express');
const server = express();
const mongoose = require('mongoose');
const passport = require("passport");
const session = require('express-session');
const localStrategy = require('passport-local').Strategy;

require('dotenv').config();

const url = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.1dvin2f.mongodb.net/`;

mongoose
.connect(url)
	.then(() => {
		console.log('db working');
	})
	.catch((err) => {
		console.log(err);
	});


// ! SESSION SETUP
const SESSION_PASS = process.env.SESSION_PASS;
server.use(
  session({
    secret: SESSION_PASS,
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      // secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

//PASSPORT SETUP

const User = require('./models/user_db');
server.use(passport.initialize());
server.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


server.set('view engine', 'ejs');
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//routes
server.get('/login', async (req, res) => {

	res.render('../views/login.ejs')

});


server.post('/login',passport.authenticate('local', {

	failureRedirect: '/login'
}),
(req, res) => {
	let redirectUrl = req.session.returnTo || '/';
	delete req.session.returnTo;

	res.redirect('/home');

}
);




server.post('/register', async (req, res) => {
	try {
		let user = new User({
            username : req.body.username,
			email: req.body.email,
            address : req.body.address,
            latitude : req.body.latitude,
            longitude : req.body.longitude,
            status : req.body.status
            

		});
		// console.log(user)
		let registeredUser = await User.register(user, req.body.password);
		req.login(registeredUser, function(err) {
			if (err) {
				console.log(error);
				return res.redirect('/register');
			}
			
			res.redirect('/login');
		});
		
		await user.save();	
	} catch (error) {
	
		console.log(error);
		return res.redirect('/register');
	}
});




server.get('/all_user', async (req,res)=>{

	try {
		const data = await User.find({});
		
        res.json(data);
		// res.render('../views/alldata.ejs',{data});
		
	} catch (error) {
		console.log("error")
		
	}
	
	

});





server.get('/register', (req,res) => {
    res.render('../views/register.ejs');
})


const port = process.env.PORT;



server.get('/', (req,res)=>{
	res.render('../views/home.ejs')
})

server.listen(port,() =>{
    console.log("server Start");

});



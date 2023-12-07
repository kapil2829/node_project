const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new mongoose.Schema({
    
    
     username : String,
     email : String,
     password : String,
     address : String,
     latitude : Number,
     longitude : Number,
     status : Number


	
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('user', userSchema);
module.exports = User;
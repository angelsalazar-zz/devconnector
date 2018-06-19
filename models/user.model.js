const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const options = require('./schemaOptions');
const { Schema } = mongoose;

const userSchema = new Schema ({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true,
        select : false
    },
    avatar : {
        type : String
    } 
}, options);

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) { return next(); }

    bcrypt.genSalt(10, (salt_err, salt) => {
        bcrypt.hash(user.password, salt, (hash_err, hashedPassword) => {
            if (hash_err) { return next(err) };
            user.password = hashedPassword;
            next();
        });
    });
});

// Instance methods
userSchema.methods.generateAuthToken = function () {
    const user = this;
    const { _id, name, email } = user;
  
    return jwt.sign({
      _id : _id.toHexString(),
      name,
      email
    }, process.env.JWT_SECRET, {
      expiresIn : 60 * 60
    });
}

// Model methods
userSchema.statics.findByCredentials = function (email, password) {
    const ERROR_MESSAGE = 'email or password incorrect';
  
    const User = this;
  
    return User.findOne({ email }, 'name email password').then((userRecord) => {
        if (!userRecord) return Promise.reject(ERROR_MESSAGE);
  
        return new Promise ((resolve, reject) => {
            bcrypt.compare(password, userRecord.password, (err, result) => {
                if (result) {
                    resolve(userRecord);
                } else {
                    reject(ERROR_MESSAGE)
                }
            })
        })
    });
}

module.exports = mongoose.model('User', userSchema);
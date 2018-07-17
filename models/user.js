const mongoose = require('mongoose');

mongoose.Promise= global.Promise; 

const Schema = mongoose.Schema;

const bcrypt=require('bcrypt-nodejs');

const nodemailer = require('nodemailer');

let emailLengthChecker=(email)=>{
  if(!email){
    return false;
  }else{
    if(email.length<5 || email.length>30){
      return false;
    }else{
      return true;
    }
  }
}


const emailValidators=[
  {
    validator:emailLengthChecker,
    message:'E-mail must be at least 5 characters but no more than 30'
  }
]

const userSchema = new Schema({
  email:{type:String,required:true,unique:true,lowercase:true,validate:emailValidators},
  username:{type:String,required:true,unique:true,lowercase:true},
  password:{type:String,required:true}
});

userSchema.pre('save',function(next){
  if(!this.isModified('password')){
    return next();
  }else{
    bcrypt.hash(this.password,null,null,(err,hash)=>{
      if(err){
        return next(err);
      }else{
        this.password=hash;
        next();
      }
    })
  }
})

//methods to compare password

userSchema.methods.comparePassword=function(password){
  return bcrypt.compareSync(password, this.password); // reurn true or false from db
}

// userSchema.methods.senEmail = function(req){

//   link="http://"+req.get('host')+"/verify?id="+rand;

//   var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'rajaDemo123@gmail.com',
//       pass: 'rajaDemo@123'
//     }
//   });
  
//   var mailOptions = {
//     from: 'rajaDemo123@gmail.com',
//     to: 'rajalingam299@gmail.com',
//     subject: 'Please confirm your Email account',
//     html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
//   };
  
//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
// }

module.exports=mongoose.model('User',userSchema);
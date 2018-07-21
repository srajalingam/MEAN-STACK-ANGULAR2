const User = require('../models/user');

const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');

const confiq = require ('../config/database');
const path =require('path');

module.exports=(router)=>{

    router.post('/register',(req,res)=>{
        console.log(req.body)
      if(!req.body.email){
          res.json({success:false,message:'You must provide an e-mail'});
      }else if(!req.body.username){
        res.json({success:false,message:'You must provide an username'});
      }else if(!req.body.password){
        res.json({success:false,message:'You must provide an password'});
      }else{
          
          let user=new User({
              email:req.body.email.toLowerCase(),
              username:req.body.username.toLowerCase(),
              password:req.body.password
          });

          user.save((err)=>{
              if(err){
                  console.log(err);
                  if(err.code==11000){
                    res.json({success:false,message:'username or email already exists'})
                  }else{
                    res.json({success:false,message:'user not saved '+ err})
                  }
              }else{
                  res.json({success:true,message:"user saved successfully"})
              }
          })
      }
    })

    router.get('/checkEmail/:email',(req,res)=>{
        if(!req.params.email){
            res.json({success:false,message:'Email was not provided'})
        }else{
            User.findOne({
                email:req.params.email
            },(err,user)=>{
                console.log(user)
                if(err){
                    res.json({success:false,message:err});
                }else{
                    if(user){
                        res.json({success:false,message:'Email is already taken'})
                    }else{
                        res.json({success:true,message:'Email is available'})
                    }
                }
            })
        }
    })
 
    router.get('/checkUsername/:username',(req,res)=>{
        if(!req.params.username){
            res.json({success:false,message:'Usernmae was not provided'})
        }else{
            User.findOne({
                username:req.params.username
            },(err,user)=>{
                if(err){
                    res.json({success:false,message:err});
                }else{
                    if(user){
                        res.json({success:false,message:'username is already taken'})
                    }else{
                        res.json({success:true,message:'username is available'})
                    }
                }
            })
        }
    })

    router.post('/login',(req,res)=>{
       if(!req.body.username){
           res.json({success:false,message:'No username provided'});
       }else{
           if(!req.body.password){
               res.json({success:false,message:'No password provided'});
           }else{
               User.findOne({
                   username:req.body.username.toLowerCase()
               },(err,user)=>{
                   if(err){
                       res.json({success:false,message:err});
                   }else{
                        if(!user){
                            res.json({success:false,message:"username not found"});
                        }else{
                            const validPassword=user.comparePassword(req.body.password);
                            if(!validPassword){
                                res.json({success:false,message:'Password Invalid'});
                            }else{
                                console.log(user.activated)
                                if(user.activated==1){
                                    const token = jwt.sign({userId:user._id},confiq.secret,{expiresIn:'24h'});
                                    res.json({success:true,message:'Success',token,user:{username:user.username}});
                                }else if(user.activated==0){
                                    res.json({success:false,message:'User not Verified Plese verify your account check your mail',user:user});
                                }
                            }
                        }
                   }
               })
           }
       }
    })

    router.post('/send',(req,res)=>{
        //rand=Math.floor((Math.random() * 100) + 54);
        link="http://"+req.get('host')+"/authentication/verify?user="+req.body.username;
        const emailId=req.body.email;
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'rajaDemo123@gmail.com',
            pass: 'rajaDemo@123'
          }
        });
        
        var mailOptions = {
          from: 'rajaDemo123@gmail.com',
          to: emailId,
          subject: 'Please confirm your Email account',
          html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
    })

    router.get('/verify',(req,res)=>{
        link="http://"+req.get('host')+"/login";
       const query=req.query.user;
       User.findOne({username:query},(err,user)=>{
           console.log(user)
            if(err){
                res.json({success:false,message:'Something went wrong'})
            }else{
                if(!user){
                    res.json({success:false,message:'Username not found'})
                }else{
                    User.findOneAndUpdate({username:query}, {$set:{activated:1}},function(err){
                        if(err){
                            console.log("Something wrong when updating data!");
                        }
                    });
                }
            }
        })
        //link="http://localhost:4200/login";
        res.end("<h1>Email is been Successfully verified </h1><br><a href="+link+">Click here to login</a>");
    })

    router.use((req,res,next)=>{
       const token= req.headers['authorization'];
       console.log(token);
       console.log(confiq.secret)
       if(!token){
           res.json({success:false,message:'No token provided'});
       }else{
           //verify token exipred or not
           jwt.verify(token,confiq.secret,(err,decoded)=>{                
                if(err){
                    res.json({success:false,message:'Token invalid '+ err})
                }else{
                    req.decoded=decoded;
                    next();
                }
           })
       }
    })

    router.get('/profile',(req,res)=>{
        User.findOne({_id:req.decoded.userId}).select('username email').exec((err,user)=>{
            if(err){
                res.json({success:false,message:err});
            }else{
                if(!user){
                    res.json({success:false,message:'User not Found'})
                }else{
                    res.json({success:true,user:user});
                }
            }
        })
    })

    router.get('/publicProfile/:username',(req,res)=>{
        if(!req.params.username){
            res.json({success:false,message:'No username was provided'})
        }else{
            User.findOne({username:req.params.username}).select('username email').exec((err,user)=>{
                if(err){
                    res.json({success:false,message:'Something went wrong'})
                }else{
                    if(!user){
                        res.json({success:false,message:'Username not found'})
                    }else{
                        res.json({success:true,user:user})
                    }
                }
            })
        }
    })


   
    return router;
}
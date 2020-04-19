/*********************USER ROUTES***************************/
const express = require('express')
const router = express.Router();
const userModel = require("../models/User");
const path = require("path");
const bcrypt = require("bcryptjs");
const isAuthenticated = require("../middleware/auth");
const dashBoardLoader = require("../middleware/authorization");


//Route to direct use to Registration form
router.get("/register",(req,res)=>
{
    res.render("User/register");
});

//Route to process user's request and data when user submits registration form
router.post("/register",(req, res) => {
    const errors=[];

    // Deconstructing
    const {firstName, lastName, email, password} = req.body;
    let valid = true;
   let fName = [];
   let lname = [];
   let mail = [];
   let pass = [];

   let firstLabel;
   let lastLabel;
   let mailLabel;
    

    const regexPatterns={
        fname: /^[a-zA-Z]+$/,
        e_mail: /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, 
        passPat: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
    }
    if (!regexPatterns.fname.test(firstName)){
        errors.push({description:'enter your first name'});
        fName=`invalid first name`;
        valid=false;
    } else{
        firstLabel=firstName;
    }

    if (!regexPatterns.fname.test(lastName)){
        errors.push({description:'enter your last name'});
        lname=`invalid last name`;
        valid=false;
    } else{
        lastLabel=lastName;
    }
    if (!regexPatterns.e_mail.test(email)){
        errors.push({description:'enter your email'});
        mail=`invalid e-mail`;
        valid=false;
    } else{
        mailLabel=email;
    }
    
    if (!regexPatterns.passPat.test(password)){
        errors.push({description:'invalid password'});
        pass=`Password: at least 8 char, 1 num, 1 lowercase, 1 uppercase, 1 special character => !@#$%^&*`;
        valid=false;
    }

    if (valid == false) {
        res.render("User/register", {
            title: "Register",
            errosArray: errors,
            first_n: fName,
            last_n: lname,
            mailL: mail,
            p_pass: pass,
            firstValue: firstLabel,
            lastValue: lastLabel,
            mailValue: mailLabel
        });
    } else {

const newUser = 
{
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    email:req.body.email,
    password:req.body.password
}

        const user = new userModel(newUser);

        user.save()
         .then((user)=>{
        
                req.files.profilePic.name = `pro_pic_${user._id}${path.parse(req.files.profilePic.name).ext}`;

                req.files.profilePic.mv(`public/uploads/${req.files.profilePic.name}`)
                .then(()=>{


                    userModel.updateOne({_id:user._id},{
                        profilePic: req.files.profilePic.name
                    })
                    .then(()=>{
                        
                // SendGrid API using desconstructed submit values to send email
               const sgMail = require('@sendgrid/mail');
               sgMail.setApiKey(`${process.env.SEND_GRID_API_KEY}`);
               const msg = {
               to: `${email}`,
               from: `noreply@gmail.com`,
               subject: 'SendGrid message',
               html: 
                `
               Hi ${firstName}, you have succesfully created an account.<br>
               You can start shopping and enjoy the services of our store.<br>
         
               `
                };
                     sgMail.send(msg)
                       .then(()=> {
                     res.redirect(`/userDashboard/${user._id}`);
                       })
                    .catch(err=> {
                       console.log(`Error ${err}`);
                    });   

                    })
        
                })

               
            
            
        })
.catch(err=>console.log(`Error while inserting into the data ${err}`));
           

}

})

//Route to direct user to the login form
router.get("/login",(req,res)=>
{
    res.render("User/login");
});

//Route to process user's request and data when user submits login form
router.post("/login",(req,res)=>
{

    userModel.findOne({email:req.body.email})
    .then(user=>{

        const errors= [];   

        //email not found
        if(user==null)
        {
            errors.push("Sorry, your email and/or password incorrect");
            res.render("User/login",{
                errors
            })
                
        }

        //email is found
        else
        {
            bcrypt.compare(req.body.password, user.password)
            .then(isMatched=>{
                
                if(isMatched)
                {
                    //cretae our sessoin
                    req.session.userInfo = user;
                   
                    res.redirect("/user/profile");
                }

                else
                {
                    errors.push("Sorry, your email and/or password incorrect ");
                    res.render("User/login",{
                        errors
                    })
                }

            })
            .catch(err=>console.log(`Error ${err}`));
        }


    })
    .catch(err=>console.log(`Error ${err}`));
    
});



router.get("/profile",isAuthenticated,dashBoardLoader);

router.get("/profile",(req,res)=>{
    
        res.render("User/userDashboard");
    
})


router.get("/logout",(req,res)=>{

    req.session.destroy();
    res.redirect("/user/login")
    
})


module.exports=router;

/*********************Task ROUTES***************************/
const express = require('express')
const router = express.Router();
const taskModel  = require("../models/Task");
const path = require("path");
const isAuthenticated = require("../middleware/auth");



//Route to direct use to Add Task form
router.get("/add",isAuthenticated,(req,res)=>
{
    res.render("Task/taskAddForm");
});

//Route to process user's request and data when the user submits the add task form
router.post("/add",isAuthenticated,(req,res)=>
{
        const newUser = {
            name : req.body.name,
            description : req.body.description,
            category : req.body.category,
            quantity : req.body.quantity,
            status  : req.body.status,
            price   : req.body.price
        }

             /*
        Rules for inserting into a MongoDB database USING MONGOOSE is to do the following :

        1. YOu have to create an instance of the model, you must pass data that you want inserted
         in the form of an object(object literal)
        2. From the instance, you call the save method
     */

     const task =  new taskModel(newUser);
     task.save()
     .then((task)=>{

        req.files.picture.name = `item_${task._id}${path.parse(req.files.picture.name).ext}`;

        req.files.picture.mv(`public/inventory/${req.files.picture.name}`)
        .then(()=>{

            taskModel.updateOne({_id:task._id},{
                picture: req.files.picture.name
            })
            .then(()=>{
                res.redirect("/task/list")
            })

        })
       
    })
    .catch(err=>console.log(`Error while inserting into the data ${err}`));
});

////Route to fetch all tasks
router.get("/list",isAuthenticated,(req,res)=>
{
    //pull from the database , get the results that was returned and then inject that results into
    //the taskDashboard

    taskModel.find()
    .then((tasks)=>{


        //Filter out the information that you want from the array of documents that was returned into
        //a new array

        //Array 300 documents meaning that the array has 300 elements 

  
        const filteredTask =   tasks.map(task=>{

                return {

                    id: task._id,
                    name : task.name,
                    description : task.description,
                    category : task.category,
                    quantity : task.quantity,
                    status  : task.status,
                    price   : task.price,
                    picture : task.picture
                }
        });


        res.render("Task/taskDashboard",{

           data : filteredTask
        });

    })
    .catch(err=>console.log(`Error happened when pulling from the database :${err}`));

    
  
});



//Route to direct user to the task profile page
router.get("/description",isAuthenticated,(req,res)=>{

    

})


router.get("/edit/:id",(req,res)=>{

    taskModel.findById(req.params.id)
    .then((task)=>{

        const {_id,name,description,category,quantity,price,status} = task;
        res.render("Task/taskEditForm",{
            _id,
            name,
            description,
            category,
            quantity,
            status,
            price
        })

    })
    .catch(err=>console.log(`Error happened when pulling from the database :${err}`));


})



router.put("/update/:id",(req,res)=>{

    const task =
    {
        name : req.body.name,
        description : req.body.description,
        category : req.body.category,
        quantity : req.body.quantity,
        status  : req.body.status,
        price   : req.body.price
    }

    taskModel.updateOne({_id:req.params.id},task)
    .then(()=>{
        res.redirect("/task/list");
    })
    .catch(err=>console.log(`Error happened when updating data from the database :${err}`));


});


router.delete("/delete/:id",(req,res)=>{
    
    taskModel.deleteOne({_id:req.params.id})
    .then(()=>{
        res.redirect("/task/list");
    })
    .catch(err=>console.log(`Error happened when updating data from the database :${err}`));

});





//Route to direct user to edit task form



//Route to update user data after they submit the form


//router to delete user


module.exports=router;
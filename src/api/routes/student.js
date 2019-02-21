const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Student = require('../models/student');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());



router.get('/',(req,res,next) => {  //pobranie info o studentach
    Student.find()
        .select('firstName group _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                students: docs.map(doc => {
                    return {
                        firstName: doc.firstName,
                        group: doc.group,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/student/'+ doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:id',(req,res,next) => {  //pobranie info o studencie o id
    const id = req.params.id;
    Student.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.post("/",(req,res,next) => { //dodaj studenta
   const student = new Student({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        group: req.body.group
   });
   student.save()
       .then(result => {
           console.log(result);
           res.status(201).json({
               message: "Post request to /student",
               createdStudent: {
                   name: result.firstName,
                   group: result.group,
                   _id: result._id,
                   request: {
                       type: 'POST',
                       url: 'http://localhost:3000/student/'+ result._id
                   }
               }
           });
       })
       .catch(err => {
           console.log(err);
           res.status(400).json({
               error: err
           });
       });
});


router.patch('/:id',(req,res,next) => { //aktualizacja studenta
   const id = req.params.id;
   const updateOps ={};
   for(const ops of req.body){
       updateOps[ops.propName] = ops.value;
   }
   Student.update({_id: id}, {$set: updateOps})
       .exec()
       .then(result => {
           console.log(result);
           res.status(200).json(result);
       })
       .catch(err => {
           console.log(err);
           res.status(400).json({
               error: err
           });
       });
});


router.delete('/',(req,res,next) => {   //usuń studentów
    Student.remove({})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:id',(req,res,next) => { //usuniecie studenta
    const id = req.params.id;
    Student.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});



module.exports = router;
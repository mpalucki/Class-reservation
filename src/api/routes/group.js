const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Group = require('../models/group');
const Student = require('../models/student');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/',(req,res,next) => {  //info o wszystkich grupach
   Group.find()
       .select('students language level')
       .populate('students', 'firstName')
       .exec()
       .then(docs => {
           res.status(200).json({
             count: docs.length,
             groups: docs,
             request: {
                 type: 'GET'
             }
           })
       })
       .catch(err => {
           res.status(500).json({
               error: err
           });
       });
});

router.get('/:id',(req,res,next) => {  //info o wybranej grupie
    Group.findById(req.params.id)
        .populate('students', 'firstName')
        .exec()
        .then(group => {
            res.status(200).json({
                group: group,
                request: {
                    type: 'GET group'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
               error: err
            });
        });
});

router.post('/',(req,res,next) => { //dodaj grupe
    Student.findById(req.body.students)
        .then(student => {
            if(!student) {
                return res.status(404).json({
                    message: 'student not found'
                })
            }
            const group = new Group({
                _id: new mongoose.Types.ObjectId(),
                language: req.body.language,
                level: req.body.level,
                students: req.body.students
            });
             return group.save()

        })
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                error: err
            });
        })
        .catch(err => {
           res.status(500).json({
               message: 'student not found',
               error: err
           });
        });
});

router.post('/:id/student/:id_s',(req,res,next) => { //dodaj grupe zakładamy, że tworząc grupe musimy dodać do niej pierwszego studenta
    Group.findById(req.params.id)
        .then(group => {
            Student.findById(req.params.id_s)
                .then( student => {
                    if(!student) {
                        return res.status(404).json({
                            message: 'student not found'
                        })
                    }
                    group.students.push(student);
                    group.save();
                    //group.students.push(student);
                    res.status(201).json({
                        message: "push"
                    });
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});


router.delete('/:id',(req,res,next) => {   //usuń grupe
    Group.remove({ _id: req.params.id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Group deleted',
                request: {
                    type: 'DELETE'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:id/student',(req,res,next) => { //usuniecie lektora z grupy
    res.status(200).json({
        message:  'Delete works!'
    });
});

router.delete('/:id/student',(req,res,next) => { //usuniecie lektora z grupy
    res.status(200).json({
        message:  'Delete works!'
    });
});


module.exports = router;
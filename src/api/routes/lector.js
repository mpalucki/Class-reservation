const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Group = require('../models/group');
const Lector = require('../models/lector');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/',(req,res,next) => {  //pobranie info o lektorach
    Lector.find()
        .select('firstName group _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                lectors: docs.map(doc => {
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

router.get('/:id',(req,res,next) => {  //pobranie info o lektorze o id
    const id = req.params.id;
    Lector.findById(id)
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

router.post('/',(req,res,next) => { //dodaj lektora
    const lector = new Lector({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        group: req.body.group
    });
    lector.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Post request to /lector",
                createdLector: {
                    name: result.firstName,
                    group: result.group,
                    _id: result._id,
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/lector/'+ result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


router.patch('/:id',(req,res,next) => { //aktualizacja lektora
    const id = req.params.id;
    const updateOps ={};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Lector.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


router.delete('/',(req,res,next) => {   //usuń lektorów
    Lector.remove({})
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

router.delete('/:id',(req,res,next) => { //usuniecie lektora
    const id = req.params.id;
    Lector.remove({_id: id})
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
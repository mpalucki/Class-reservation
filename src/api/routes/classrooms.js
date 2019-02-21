const express = require('express');
const router = express.Router();
const { success, notFound } = require('../../services/response/');

const {token} = require("../../services/passport")

const {createReservation, indexReservation, destroyReservation} = require('../Controllers/controller-reservations');

// sala posiada rezerwacje, sprzęt
const mongoose = require('mongoose');
const Classroom = require('../models/classroom')


const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());


router.get('/',(req,res,next) => {  //informacje o wszystkich klasach
    Classroom.find()
        .select('number reservation')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                classrooms: docs.map(doc => {
                    return {
                        _id: doc._id,
                        number: doc.number,
                        reservation: doc.reservations,
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

router.get('/:id',(req,res,next) => {  //pobranie info o sali o id
    const id = req.params.id;
    Classroom.findById(id)
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

router.post('/',(req,res,next) => {// dodaj salę
   Classroom.find({number: req.body.number})
       .then(res => {
           res.status(404).json({
               message: "classroom with this number exist!"
           })
       })
    const classroom = new Classroom({
       _id: new mongoose.Types.ObjectId(),
       number: req.body.number
   })
    classroom.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Post request to /classroom",
                createdClassroom: {
                    _id: result._id,
                    number: result.number,
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/classroom/'+ result._id
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



router.post('/:id/equipment/:id_s',(req,res,next) => {// dodaj sprzęt do sali
    Classroom.findById(req.params.id)
        .then(classroom => {
            Equipment.findById(req.params.id_s)
                .then( eq => {
                    if(!eq) {
                        return res.status(404).json({
                            message: 'equipment not found'
                        })
                    }
                    classroom.equipment.push(eq);
                    classroom.save();
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

router.patch('/:id',({ body , params }, res, next) => { //aktualizuj sale o id
   //TODO
    Classroom.findById(params.id)
        .then(notFound(res))
        .then((classroom) => classroom ? Object.assign(classroom, body).save() : null)
        .then((classroom) => classroom ? classroom.view(true) : null)
        .then(success(res))
        .catch(next)

});

router.delete('/',(req,res,next) => {  //usuń wszystkie sale
    Classroom.remove({})
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

router.delete('/:id',(req,res,next) => {  //usuń sale o id
    const id = req.params.id;
    Classroom.remove({_id: id})
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
//--------------------------------------------------------------------------------------------------------


router.get('/:id/reservations',
    token({ required: true, group: ['admin']}),
    indexReservation
)
router.post('/:id/reservations',
    token({ required: true, group: ['admin'] }),
    createReservation
)

router.delete('/:id/reservations/:reservationId',
    token({ required: true, group: ['admin'] }),
    destroyReservation
)

module.exports = router;
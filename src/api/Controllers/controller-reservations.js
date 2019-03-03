const { success, notFound } = require('../../services/response/')
const Classroom = require('../models/classroom')
const ObjectId = require('mongoose').Types.ObjectId;



const createReservation = async (req, res, next) => {
    const {id} = req.params
    const date = req.body.date
    const lector = req.body.lector
    const group = req.body.group

    let classroom = await Classroom.findById(id).exec()
    if(classroom === null) return notFound(res)(classroom)

    const reservationId = ObjectId()        // albo nadamy ID sami, albo pobierzemy je potem z tablicy
    try {
        classroom.reservations.push({
            _id: reservationId,
            date: date,
            lector: lector._id,
            group: group._id
        })
    } catch (e) {

        return res.status(400).end();
    }


    {
        Promise.all([
            classroom.save(),
            //lector.save()
        ]).then(result => result[0])
            .then(result => result.reservations.map(r =>  {res.status(200).json(result);}))
            .then(success(res))
            .catch(next)
    }


}

const indexReservation = (req, res, next) => {
    Classroom.findById(req.params.id)
        .then(notFound(res))
        .then((classroom) => classroom ? classroom.reservations.map(r =>{
            console.log(classroom);
            res.status(200).json(classroom);
        }) : null)
        .then(success(res))
        .catch(next)
}

const destroyReservation = async (req, res, next) => {
    const {id, reservationId} = req.params


    let classroom = await Classroom.findOne({_id : id}, {reservations: {$elemMatch: {_id: reservationId}}})
    if(classroom === null || classroom.reservations.length === 0){
        return notFound(res)(null)
    }

    const classroomPromise = Classroom.findByIdAndUpdate(id, { $pull: { reservations: { _id: reservationId } }}, {new: true} ).exec() // new - odpowiedzialny za zwrot dokumentu "Po" akcji, domyslnie zwraca sprzed akcji

    {
            const results = await Promise.all([
            classroomPromise,
        ]);

        try {   // Tutaj try sluzy do obslugi rejection z Promise
            const reservations = results[0].reservations.map(r => {
                console.log(r);
                res.status(200).json(r);
            })
            success(res)(reservations)
        } catch (e) {
            res.status(400).end()
        }
    }
}

module.exports = {
    createReservation, indexReservation, destroyReservation
}

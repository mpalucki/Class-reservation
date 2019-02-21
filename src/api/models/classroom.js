const mongoose = require('mongoose');
const Reservation = require('../models/reservation')
const Equipment = require('../models/reservation')

const classroomSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    number: {type: Number,required: true, unique: true},
    reservations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation'
    }]

});

classroomSchema.methods = {
    view(full) {
        const view = {
            // simple view
            id: this._id,
            number: this.number,
            reservations: this.reservations
        }

        return full;

    }
}

module.exports = mongoose.model('Classroom',classroomSchema);
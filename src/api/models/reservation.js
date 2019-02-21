const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
    date: String,
    lector: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lector"
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    }
});
module.exports = mongoose.model('Reservation',reservationSchema);
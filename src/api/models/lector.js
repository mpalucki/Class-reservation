const mongoose = require('mongoose');

const lectorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {type: String,required: true},
    group: [
        [{type: mongoose.Schema.Types.ObjectId, ref: 'Group'}]
    ]
});
module.exports = mongoose.model('Lector',lectorSchema);
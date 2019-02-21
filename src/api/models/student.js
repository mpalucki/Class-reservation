const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {type: String,required: true},
    group: [
        {type: mongoose.Schema.Types.ObjectId}
        ]
});
module.exports = mongoose.model('Student',studentSchema);
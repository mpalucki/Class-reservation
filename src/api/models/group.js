const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    language: {type: String,required: true},
    level: {type: String,required: true},
    students: [{type: mongoose.Schema.Types.ObjectId, ref: "Student"}]
});
module.exports = mongoose.model('Group',groupSchema);
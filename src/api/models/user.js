const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const roles = ['user', 'admin']
const group = ['admin','lector','student']

const Schema = mongoose.Schema
const userSchema = new Schema({
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,         //removes whitespaces
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    role: {
        type: String,
        enum: roles,
        default: 'user'
    },
    group: {
        type: String,
        enum: group,
    }
},
    {
    timestamps: true
})

userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next()

    const rounds = 9

    bcrypt.hash(this.password, rounds).then((hash) => {
        this.password = hash
        next()
    }).catch(next)
})


userSchema.methods = {
    view(full) {
        let view = {}
        let fields = ['id', 'name',]

        if (full) {
            fields = [...fields,'group', 'role', 'email']
        }

        fields.forEach((field) => {
            view[field] = this[field]
        })

        return view
    },

    authenticate(password) {
        return bcrypt.compare(password, this.password).then((valid) => valid ? this : false)
    }

}

userSchema.statics = {
    roles
}
const model = mongoose.model('User', userSchema)

module.exports = {model, userSchema}



// const mongoose = require('mongoose');
// const roles = ['user', 'admin']
//
// const userSchema = mongoose.Schema({
//     _id: mongoose.Schema.Types.ObjectId,
//     email: {
//         type: String,
//         require: true,
//         unique: true,
//         match: /^\S+@\S+\.\S+$/
//         },
//         password: {type: String, require: true}
// });
//
// module.exports = mongoose.model('User',userSchema);
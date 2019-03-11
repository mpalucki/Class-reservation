// Głowny plik aplikacji

const http = require('http')
const { env, port, ip, apiRoot, mongo } = require('./config')
const express = require('./services/express')
//const api = require('./api')
const mongoose = require('mongoose')
const app = express(apiRoot)
const server = http.createServer(app)
mongoose.connect(mongo.uri)

const classroomRoutes = require('./api/routes/classrooms')
const lectorRoutes = require('./api/routes/lector')
const groupRoutes = require('./api/routes/group')
const studentRoutes = require('./api/routes/student')
const userRoutes = require('./api/routes/user')



app.use('/classroom', classroomRoutes);
app.use('/lector', lectorRoutes);
app.use('/group',groupRoutes);
app.use('/student',studentRoutes);
app.use('/user', userRoutes)



setImmediate(() => {    //setImmediate call function as soon as possible
    server.listen(port, ip, () => {
        if(env === 'development') console.log('Express server listening on http://%s:%d, in %s mode', ip, port, env)
    })
})

function stop() {
    server.close()
}

// const content = `<html>Hello <strong>Krzysztof</strong></html>`
// sendmail('kbzowski@agh.edu.pl', 'System Is Online!', content)


module.exports = app
module.exports.stop = stop

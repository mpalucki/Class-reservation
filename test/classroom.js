const server = require('../src/app')
const Student = require('../src/api/models/student')
const Classroom = require('../src/api/models/classroom')
const Group = require('../src/api/models/group')
const Lector = require('../src/api/models/lector')
const Reservation = require('../src/api/models/reservation')
const mongoose = require('mongoose')

const chai = require('chai')
const chaiHttp = require('chai-http')

const should = chai.should();

chai.use(chaiHttp);


describe('Classroom', () => {
    before((done) => { //Before each test we empty the database
        Classroom.remove({}, (err) => {
            done();
        });
    });

    describe('GET /classroom', () => {
        it('it should GET all classrooms', (done) => {
            chai.request(server)
                .get('/classroom')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    //res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('POST /classroom', () => {

        it('it should not POST new classroom without number', (done) => {

            let classroom = new Classroom({
                _id: new mongoose.Types.ObjectId(),
            });
            chai.request(server)
                .post('/classroom')
                .send(classroom)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    done();
                });
        })

    });


    describe('/DELETE/:id group', () => {
        it('it should DELETE a student given the id', (done) => {

            let classroom = new Classroom ({
                _id: new mongoose.Types.ObjectId(),
                number: "33",
            });
            classroom.save((err, book) => {
                chai.request(server)
                    .delete('/classroom/' + classroom.id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');

                        done();
                    });
            });
        });

        it('it should DELETE a student given the id', (done) => {

            let classroom = new Classroom ({
                _id: new mongoose.Types.ObjectId(),
                number: "33",
            });
            classroom.save((err, book) => {
                chai.request(server)
                    .delete('/classroom/' + classroom.id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');

                        done();
                    });
            });
        });
    });

    // describe('/POST/:id_classroom/reservation ', () => {
    //     it('it should add a reservation given the id', (done) => {
    //         let student = new Student ({
    //             _id: new mongoose.Types.ObjectId(),
    //             firstName: "Tomek",
    //             group: '5bfb333a66d37919440d2c72'
    //         });
    //         student.save();
    //         let group = new Group ({
    //             _id: new mongoose.Types.ObjectId(),
    //             language: "Angielski",
    //             level: "B2",
    //             students: student.id
    //         });
    //         group.save();
    //         let lector = new Lector ({
    //             _id: new mongoose.Types.ObjectId(),
    //             firstName: "Tomek",
    //             group: '5bfb333a66d37919440d2c72'
    //         });
    //         lector.save();
    //         let classroom = new Classroom ({
    //             _id: new mongoose.Types.ObjectId(),
    //             number: "33",
    //         });
    //         classroom.save();
    //         let reservation = new Reservation({
    //             date: "12.08.13r",
    //             lector: lector.id,
    //             group: group.id
    //         });
    //         //reservation.save();
    //         chai.request(server)
    //             .post('/classroom/'+classroom.id+'/reservation')
    //             .auth('')
    //             .send(reservation)
    //             .end((err, res) => {
    //                 res.should.have.status(201);
    //                 res.body.should.be.a('object');
    //                 res.body.should.not.have.property('errors');
    //                 done();
    //             });
    //     });
    // });

});
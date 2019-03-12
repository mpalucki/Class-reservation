const server = require('../src/app')
const Student = require('../src/api/models/student')

const mongoose = require('mongoose')

//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')

const should = chai.should();

chai.use(chaiHttp);

const bodyParser = require('body-parser');

describe('Student', () => {
    before((done) => { //Before each test we empty the database
        Student.remove({}, (err) => {
            done();
        });
    });

    describe('GET /student', () => {
        it('it should GET all students', (done) => {
            chai.request(server)
                .get('/student')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');

                    done();
                });
        });
    });

    describe('POST /student', () => {
        it('it should POST new student', (done) => {
            let student = new Student ({
                _id: new mongoose.Types.ObjectId(),
                firstName: "Tomek",
                group: '5bfb333a66d37919440d2c72'
            });
            chai.request(server)
                .post('/student')
                .send(student)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.not.have.property('errors');

                    done();
                });
        });

        it('it should not POST new student without firstNname', (done) => {
            let student = new Student({
                group: "5bfb333a66d37919440d2c72"
            });
            chai.request(server)
                .post('/student')
                .send(student)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');

                    done();
                });
        })

    });


    describe('/DELETE/:id student', () => {
        it('it should DELETE a student given the id', (done) => {
            let student = new Student ({
                _id: new mongoose.Types.ObjectId(),
                firstName: "Tomek",
                group: '5bfb333a66d37919440d2c72'
            });
            student.save((err, student) => {
                chai.request(server)
                    .delete('/student/' + student.id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');

                        done();
                    });
            });
        });
    });

});
const server = require('../src/app')
const Group = require('../src/api/models/group')
const Student = require('../src/api/models/student')

const mongoose = require('mongoose')

//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')

const should = chai.should();

chai.use(chaiHttp);

const bodyParser = require('body-parser');

describe('Group', () => {
    before((done) => { //Before each test we empty the database
        Group.remove({}, (err) => {
            done();
        });
    });

    describe('GET /group', () => {
        it('it should GET all group', (done) => {
            chai.request(server)
                .get('/group')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    //res.body.length.should.be.eql(0);
                    done();
                });
        });

        it('it should GET group by :id', (done) => {
            let student = new Student ({
                _id: new mongoose.Types.ObjectId(),
                firstName: "Tomek",
                group: '5bfb333a66d37919440d2c72'
            });
            student.save();
            let group = new Group ({
                _id: new mongoose.Types.ObjectId(),
                language: "Angielski",
                level: "B2",
                students: student.id
            });
            chai.request(server)
                .get('/group/'+group.id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    //res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    describe('POST /group', () => {
        it('it should POST new group', (done) => {

            let student = new Student ({
                _id: new mongoose.Types.ObjectId(),
                firstName: "Tomek",
                group: '5bfb333a66d37919440d2c72'
            });
            student.save();
            let group = new Group ({
                _id: new mongoose.Types.ObjectId(),
                language: "Angielski",
                level: "B2",
                students: student.id
            });
            chai.request(server)
                .post('/group')
                .send(group)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.not.have.property('errors');
                    done();
                });
        });

        it('it should POST new student to group', (done) => {

            let student = new Student ({
                _id: new mongoose.Types.ObjectId(),
                firstName: "Tomek",
                group: '5bfb333a66d37919440d2c72'
            });
            student.save();
            let student2 = new Student ({
                _id: new mongoose.Types.ObjectId(),
                firstName: "Tomek",
            });
            student2.save();
            let group = new Group ({
                _id: new mongoose.Types.ObjectId(),
                language: "Angielski",
                level: "B2",
                students: student.id
            });
            chai.request(server)
                .post('/group/')
                .send(group)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.not.have.property('errors');
                    done();
                });
        });

        it('it should not POST new group without language and level', (done) => {
            let student = new Student ({
                _id: new mongoose.Types.ObjectId(),
                firstName: "Tomek",
                group: '5bfb333a66d37919440d2c72'
            });
            student.save();
            let group = new Group({
                students: student.id
            });
            chai.request(server)
                .post('/group')
                .send(group)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    done();
                });
        })

    });


    describe('/DELETE/:id group', () => {
        it('it should DELETE a student given the id', (done) => {
            let student = new Student ({
                _id: new mongoose.Types.ObjectId(),
                firstName: "Tomek",
                group: '5bfb333a66d37919440d2c72'
            });
            student.save();

            let group = new Group ({
                _id: new mongoose.Types.ObjectId(),
                language: "Angielski",
                level: "B2",
                students: student.id
            });
            group.save((err, book) => {
                chai.request(server)
                    .delete('/group/' + group.id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');

                        done();
                    });
            });
        });
    });

});
const server = require('../src/app')
const Lector = require('../src/api/models/lector')

const mongoose = require('mongoose')

//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')

const should = chai.should();

chai.use(chaiHttp);

const bodyParser = require('body-parser');

describe('Lector', () => {
    before((done) => { //Before each test we empty the database
        Lector.remove({}, (err) => {
            done();
        });
    });

    describe('GET /lector', () => {
        it('it should GET all lectors', (done) => {
            chai.request(server)
                .get('/lector')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');

                    done();
                });
        });
    });

    describe('POST /lector', () => {
        it('it should POST new lector', (done) => {
            let lector = new Lector ({
                _id: new mongoose.Types.ObjectId(),
                firstName: "Tomek",
                group: '5bfb333a66d37919440d2c72'
            });
            chai.request(server)
                .post('/lector')
                .send(lector)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.not.have.property('errors');

                    done();
                });
        });

        it('it should not POST new lector without firstNname', (done) => {
            let lector = new Lector({
                group: "5bfb333a66d37919440d2c72"
            });
            chai.request(server)
                .post('/student')
                .send(lector)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');

                    done();
                });
        })

    });


    describe('/DELETE/:id student', () => {
        it('it should DELETE a student given the id', (done) => {
            let lector = new Lector ({
                _id: new mongoose.Types.ObjectId(),
                firstName: "Tomek",
                group: '5bfb333a66d37919440d2c72'
            });
            lector.save((err, book) => {
                chai.request(server)
                    .delete('/student/' + lector.id)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');

                        done();
                    });
            });
        });
    });

});
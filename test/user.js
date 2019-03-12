process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
const User = require('../src/api/models/user').model

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../src/app');
let should = chai.should();


chai.use(chaiHttp);

describe('User', () => {
    token = ''

    before((done) => { //Before each test we empty the database
        User.remove({}, (err) => {
            done();
        });
    });

    describe('POST /user/signup', () => {
        it('it should register user', (done) => {
            let user = {
                email: 'mateusz@test.com',
                name: 'mateusz',
                password: 'testowehaslo'
            }
            chai.request(server)
                .post('/user/signup')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.should.have.property('token');
                    res.body.should.have.property('user');
                    res.body.user.should.have.property('id');
                    res.body.user.should.have.property('name').equal('mateusz');
                    res.body.user.should.have.property('email').equal('mateusz@test.com');

                    token = res.body.token
                    done();
                });
        });
    })

    describe('POST /user/auth', () => {
        it('it should login user', (done) => {
            chai.request(server)
                .post('/user/auth')
                .auth('mateusz@test.com', 'testowehaslo')
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    done();
                });
        });
    });

    describe('GET /user/me', () => {
        it('it should get user informations', (done) => {
            chai.request(server)
                .get('/user/me')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('role');
                    done();
                });
        });
    });

});

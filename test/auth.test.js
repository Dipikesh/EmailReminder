const chai = require('chai')
const chaiHttp = require('chai-http')
const server = "http://localhost:6000"
const logger = require('../src/config/logger')
const should = require('should');
require(`dotenv`).config()
const {otpService} = require('../src/services/auth.services')

chai.should();
chai.use(chaiHttp);

describe('Auth', () => {
    var email = "dipik23@gmail.com",
        password = "Dipikesh@123",
        cnfPassword = "Dipikesh@123",
        name = "Dipikesh",
        otp;
    
    it("Register and send OTP", (done) => {
        chai.
            request(server).
            post('/auth/register').
            send({ email }).
            end((err, res) => {
                res.should.have.status(201);
                done();
            });
    });
   
    it("Verify OTP and confirm Register", (done) => {
           chai.
            request(server).
            post('/auth/cnfrm-register').
            send({ email,password,cnfPassword,name,otp }).
            end((err, res) => {
                res.should.have.status(201);
                done();
            })
    })
})

'use strict';

import {expect} from 'chai';
import * as supertest from 'supertest';

// This agent refers to PORT where program is runninng.
const server = supertest.agent('http://localhost:8080');

// Here are all the endpoints we're going to call
const sampleApi = '/en/sample';

// Return of call
let token = '';

function startServerFirst(err: any, done: any) {
  console.log('IMPORTANT: You need to start the server before proceeding to the functional tests' +
    ' and to execute the script init-functional-test.sh');
  return done(err);
}

describe('Full process', function() {
  // Set a higher timeout than 2s since we connect to Zoho
  this.timeout(30000);

  it('GET call', function(done) {
    server
      .get(sampleApi)
      .expect('Content-type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.be.equal('GET good');
          done();
        }
    });
  });

  it('POST call', function(done) {
    server
      .post(sampleApi)
      .expect('Content-type', /json/)
      .expect(201)
      .end(function(err, res) {

        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.be.equal('POST good');
          done();
        }
    });
  });

  it('PUT call', function(done) {
    server
      .put(`${sampleApi}/2`)
      .expect('Content-type', /json/)
      .expect(200)
      .end(function(err, res) {

        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.be.equal('PUT good');
          done();
        }
    });
  });

  it('POST auth call', function(done) {
    server
      .post(`${sampleApi}/auth`)
      .send({'email': 'test@kalvad.com', 'password': 'kalvad42'})
      .expect('Content-type', /json/)
      .expect(200)
      .end(function(err, res) {

        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body.message).to.be.a('string');
          expect(res.body.token).to.be.a('string');
          token = res.body.token;
          done();
        }
    });
  });

  it('GET logged user call', function(done) {
    server
      .get(`${sampleApi}/logged`)
      .set('Authorization', `Bearer ${token}`)
      .expect('Content-type', /json/)
      .expect(200)
      .end(function(err, res) {

        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body.message).to.be.a('string');
          expect(res.body.user).to.be.a('object');
          expect(res.body.user.id).to.be.a('string');
          expect(res.body.user.id).to.be.equal('1');
          done();
        }
    });
  });

  it('GET error call', function(done) {
    server
      .get(`${sampleApi}/error`)
      .expect('Content-type', /json/)
      .expect(500)
      .end(function(err, res) {
        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.be.equal('Internal Error');
          done();
        }
    });
  });

  it('GET error not found call', function(done) {
    server
      .get(`${sampleApi}/error-not-found`)
      .expect('Content-type', /json/)
      .expect(404)
      .end(function(err, res) {

        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.be.equal('My resource referred as Resource has not been found');
          done();
        }
    });
  });

  it('GET bad request call', function(done) {
    server
      .get(`${sampleApi}/bad-request`)
      .expect('Content-type', /json/)
      .expect(400)
      .end(function(err, res) {

        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.be.equal('Wrong payload');
          done();
        }
    });
  });

  it('GET resource not created call', function(done) {
    server
      .get(`${sampleApi}/resource-not-created`)
      .expect('Content-type', /json/)
      .expect(400)
      .end(function(err, res) {

        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.be.equal('Resource creation has failed');
          done();
        }
    });
  });

  it('GET login required error call', function(done) {
    server
      .get(`${sampleApi}/logged`)
      .expect('Content-type', /json/)
      .expect(401)
      .end(function(err, res) {

        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.be.equal('You must be logged in to request this endpoint');
          done();
        }
    });
  });

  it('GET error endpoint does not exist', function(done) {
    server
      .get('/toto')
      .expect('Content-type', /json/)
      .expect(404)
      .end(function(err, res) {

        if (err !== null) {
          return startServerFirst(err, done);
        } else {
          // Make necessary verification on the response
          expect(res.body.message).to.be.a('string');
          done();
        }
    });
  });

});

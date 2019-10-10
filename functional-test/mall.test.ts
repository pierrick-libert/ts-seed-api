'use strict';

import {expect} from 'chai';
import * as supertest from 'supertest';

// This agent refers to PORT where program is runninng.
const server = supertest.agent('http://localhost:5000');

// Here are all the endpoints we're going to call
const mallApi = '/mall';
const errorApi = '/mall/error';
const errorNotFoundApi = '/mall/errornotfound';

function startServerFirst(err: any, done: any) {
  console.log('IMPORTANT: You need to start the serverless before proceeding to the functional tests' +
    ' and to execute the script init-functional-test.sh');
  return done(err);
}

describe('Full process', function() {
  // Set a higher timeout than 2s since we connect to Zoho
  this.timeout(30000);

  it('GET call', function(done) {
    server
      .get(mallApi)
      .expect('Content-type', /json/)
      .expect(200)
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

  it('POST call', function(done) {
    server
      .post(mallApi)
      .expect('Content-type', /json/)
      .expect(200)
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

  it('GET error call', function(done) {
    server
      .get(errorApi)
      .expect('Content-type', /json/)
      .expect(500)
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

  it('GET error not found call', function(done) {
    server
      .get(errorNotFoundApi)
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

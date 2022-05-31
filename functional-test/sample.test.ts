import {expect} from 'chai';
import supertest from 'supertest';
import {exec} from 'child_process';
import {Database} from '../lib/db/db.service';
import {AppService} from '../lib/app/app.service';
import {SampleEndpoint} from '../endpoints/sample';
import {LoggerService} from '../lib/logger/logger.service';

// Here are all the endpoints we're going to call
const sampleApi = '/sample';

// Variable used during the test
let app: AppService;
let sample_id: string;

// Generic function to execute shell commands
async function execShellCommand(command: string): Promise<any> {
  return await new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      resolve(error);
    });
  });
}

before(async function() {
  // Increase the timeout
  this.timeout(30000);
  // Delete the test DB if it exists
  let error = await execShellCommand('npm run typeorm query "DROP DATABASE IF EXISTS ts_seed_api_test" -- -d test.ormconfig.ts');
  if (error) {
    LoggerService.getInstance().logger.debug('An error occured while creating the DB');
    process.exit(1);
  }
  // Create the test DB
  error = await execShellCommand('npm run typeorm query "CREATE DATABASE ts_seed_api_test" -- -d test.ormconfig.ts');
  if (error) {
    LoggerService.getInstance().logger.debug('An error occured while creating the DB');
    process.exit(1);
  }
  // Init the app service with the routes we wish to use for this test
  app = new AppService(
    [await new SampleEndpoint().init('test')],
    8090,
  );
});

after(async function() {
  // Increase the timeout
  this.timeout(30000);
  // Close all connections created for this test
  (await Database.getInstance().getConnection('test')).close();
  // Delete the test DB created above
  const error = await execShellCommand('npm run typeorm query "DROP DATABASE IF EXISTS ts_seed_api_test" -- -d test.ormconfig.ts');
  if (error) {
    console.info(error);
    LoggerService.getInstance().logger.debug('An error occured while deleting the DB');
    process.exit(1);
  }
});

describe('Working process', function() {
  // Set a higher timeout than 2s
  this.timeout(30000);

  it('POST Sample', (done) => {
    supertest(app.app)
      .post(sampleApi)
      .expect('Content-type', /json/)
      .expect('Accept-Language', /en/)
      .expect(201)
      .send({'name': 'Fake Sample'})
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.id).to.be.an('string');
        sample_id = res.body.id;
        done();
      });
  });

  it('GET Sample By ID', (done) => {
    supertest(app.app)
      .get(`${sampleApi}/${sample_id}`)
      .expect('Content-type', /json/)
      .expect('Accept-Language', /en/)
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.id).to.be.an('string');
        expect(res.body.name).to.be.an('string');
        expect(res.body.name).to.equal('Fake Sample');
        expect(res.body.lastname).to.equal(null);
        done();
      });
  });

  it('PUT Sample', (done) => {
    supertest(app.app)
      .put(`${sampleApi}/${sample_id}`)
      .expect('Content-type', /json/)
      .expect('Accept-Language', /en/)
      .expect(200)
      .send({'lastname': 'Fake Lastname'})
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.id).to.be.an('string');
        done();
      });
  });

  it('GET Samples', (done) => {
    supertest(app.app)
      .get(sampleApi)
      .expect('Content-type', /json/)
      .expect('Accept-Language', /en/)
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(1);
        done();
      });
  });

  it('DELETE Sample', (done) => {
    supertest(app.app)
      .delete(`${sampleApi}/${sample_id}`)
      .expect('Content-type', /json/)
      .expect('Accept-Language', /en/)
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        done();
      });
  });

  it('GET Sample By ID - Not Found', (done) => {
    supertest(app.app)
      .get(`${sampleApi}/${sample_id}`)
      .expect('Content-type', /json/)
      .expect('Accept-Language', /en/)
      .expect(404)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.an('string');
        done();
      });
  });

  it('GET Samples - Empty', (done) => {
    supertest(app.app)
      .get(sampleApi)
      .expect('Content-type', /json/)
      .expect('Accept-Language', /en/)
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(0);
        done();
      });
  });
});

describe('Handling error process', function() {
  // Set a higher timeout than 2s
  this.timeout(30000);

  it('POST Sample - Null Name', (done) => {
    supertest(app.app)
      .post(sampleApi)
      .expect('Content-type', /json/)
      .expect('Accept-Language', /en/)
      .expect(400)
      .send({'name': null})
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.an('string');
        done();
      });
  });

  it('POST Sample - Empty Name', (done) => {
    supertest(app.app)
      .post(sampleApi)
      .expect('Content-type', /json/)
      .expect('Accept-Language', /en/)
      .expect(400)
      .send({'name': ''})
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.an('string');
        done();
      });
  });

  it('POST Sample - Empty Data', (done) => {
    supertest(app.app)
      .post(sampleApi)
      .expect('Content-type', /json/)
      .expect('Accept-Language', /en/)
      .expect(400)
      .send({})
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.an('string');
        done();
      });
  });

  it('PUT Sample - Not an ID', (done) => {
    supertest(app.app)
      .put(`${sampleApi}/toto`)
      .expect('Content-type', /json/)
      .expect('Accept-Language', /en/)
      .expect(400)
      .send({'lastname': 'Fake Lastname'})
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.an('string');
        done();
      });
  });

  it('GET Sample - Not an ID', (done) => {
    supertest(app.app)
      .get(`${sampleApi}/toto`)
      .expect('Content-type', /json/)
      .expect('Accept-Language', /en/)
      .expect(400)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.be.an('string');
        done();
      });
  });

});

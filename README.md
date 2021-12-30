# TS Seed API

The purpose of this repository is just to share a homemade seed to create an API in NodeJS/Express/Typescript with an ORM.

You just need to clone the repository and update it to handle your different requirements.

The use is pretty simple and do not require additional work though room for improvement is possible.

## Manual Installation

Requires [NodeJS 16+](https://nodejs.org/en/download/).

You may also be advised to use [NVM](https://github.com/nvm-sh/nvm) to handle your nodeJS version.

To install all dependencies:
```bash
npm install
```

To delete all dependencies:
```bash
npm run clean
```

All the command from above would require to have your environment setup with the variables listed at the end of this file.
You may used `example.env` as a sample.

### Run Watch Mode

To launch the program in watch mode, just run this command:
```bash
npm start
```

The server will be ready on `http://localhost:8084`.

### Run Normal Mode

To launch the program in normal mode, run the command below:
```bash
npm run compile && node dist/index.js --port 8084
```

The server will be ready on `http://localhost:8084`.

## Automatic Installation

Requires [Docker 20+](https://docs.docker.com/get-docker/) and [Docker Compose 1+](https://docs.docker.com/compose/install/)
```bash
npm run docker
```

### Run

The server is now running on this address `http://localhost:8083`.

## Functional Test

Launch this command line to execute functional tests
```bash
npm test
```

## Check linting

```bash
npm run lint
```

## ORM

In order to ease the setup and management of the project, an [ORM](https://typeorm.io/) has been installed and must be used.

### Models

All changes and models should be applied into the folder `models/models`.

You should create a model file per table or context in order to keep a certain logic.

E.g:

 * User table should be created inside `models/models/user.ts`
 * User translation table should be created inside `models/models/user.ts`
 * Post table should be created inside `models/models/post.ts`

### Migrations

To create a migration with your last change, run the command below:
```bash
npm run typeorm migration:generate -- -n ExplicitMigrationName
```

A good practice is to modify a model and then run a migration. Try to avoid to modify multiple models at once and create a global migration which may lead to confusion and harden the management.

To apply the latest migration(s), run the command below:
```bash
npm run typeorm migration:run
```

To learn more about [migrations](https://typeorm.io/#/migrations) or the [ORM](https://typeorm.io/#/entities), consult these pages.

### Configuration

You may impact the configuration file by modifying `ormconfig.json`.

Be careful while changing the [file](https://typeorm.io/#/using-ormconfig) since you may impact the whole project.

This file should configured differently according to your environment. You may also use the environment variables as mentioned in the documentation.

## Swagger

### Run

To see the API swagger, you must bundle the swagger files into one.
```bash
npm run swagger-generate
```

Then, you start the server with one of the solution described above and you access the swagger through this URL `http://127.0.0.1:8084/swagger`.

### Check Validity

You can check the validity of the swagger through this command:
```bash
npm run swagger-check
```

## Greenkeeping

In order to keep the project as clean and secure as possible, you need to keep the dependencies and libraries installed up to date.

We decided to remove the `^` and `~` from `package.json` to keep the hand on the version we're installing and deploying.
However, this decision requires manual action.

That's why, we included `npm-check-updates` into our dependencies to help with this task, by running:
```bash
npm run greenkeeping
```

This command will update the `package.json` with the latest version for all dependencies.
Then, you must run the tests as explained above to check if the code is still matching the latest requirements.

## Environment variables

|Name|Type|Default value|Description|
|--|--|--|--|
|SECRET_KEY|string||Secret key to generate the JWT|
|SENTRY_DSN|string||DSN from Sentry for the specific project|
|NODE_ENV|string|staging|Node environment to know if we're in prod or not|

## Dependency

_If any_

## Module

In this seed, you already have some modules prepared to help your development, you may remove some from your projects if you don't need them
The purpose of this seed is to provide as much tools as possible but adapt it according to your own needs

### JWT

A module to create and handle JWT is available in the `lib/jwt` folder. You may also find dependency in the folder `lib/middleware` where you can a method to automatically check if the token is valid

### Sentry

Most of the time, we're using Sentry to handle our exceptions, you may find the details concerning this module in `lib/sentry`

### Logger

We're using `winston` library to log in our application. You have a wrapper in `lib/logger`
It is used with Sentry in order to avoid to duplicate Sentry everywhere in your code, it will automatically sent data to Sentry when you call the `error()` method in the logger

### HTTP

If you have to make http request in your API, you may take a look at the wrapper in `lib/http` which is using `axios`. If you want to update the library for some reason, you just need to update the wrapper

### File upload

We're using the `express-fileupload` library to handle file upload, you may find the configuration in `lib/app/app.service.ts`
Some example are available in the endpoint file

### Faker

In order to perform your unit/functional tests, we're using `faker`  library to generate proper data. We highly advice you to use it as much as possible, it will also help you to increase your range of test and detect potential issues

### AJV

When you're receiving payload in your API, you have to check the validity of the data. We're using `ajv` library for this inside the wrapper in `lib/valid`

## Contribution

Keep in mind that's the structure of the code has been thought and created according to our experience, it doesn't mean it's the best one and shouldn't be improved. Don't hesitate to create a PR if you think you may improve this seed, We will be glad to review it and discuss about it with you

### Guideline

Clone the project in your computer and create a branch from `master`, not `develop` then follow the rules below:

* First create an issue with the proper label `enhancement`, `bug`, `feature` or `architecture`
* Create your branch by using one the label above + `/{issue-name}`
* Make your changes
* Don't forget to update the Swagger and the tests if ever you update the endpoint examples
* Create a PR and then assign one of the contributor below with the role `admin`
* Your code will be reviewed and comments/changes may be requested
* If everything goes well, your code will be merged with `develop` and then to `master` after a while

When updating the code and before creating the PR, please keep in mind the points below:

* Please describe the proposed api and implementation plan (unless the issue is a relatively simple bug and fixing it doesn't change any api)
* Please write as little code as possible to achieve the desired result
* Please avoid unnecessary changes, refactoring or changing coding styles as part of your change (unless the change was proposed as refactoring)
* Please follow the coding conventions even if they are not validated (and/or you use different conventions in your code)
* Please run the tests before committing your code
* If tests fail in Travis after you make a PR please investigate and fix the issue

### Contributor

|Name|Role|
|--|--|
|[Pierrick Libert](https://github.com/pierrick-libert)|_Admin_|

### License

When contributing the code you confirm that:

* Your contribution is created by you
* You understand and agree that your contribution is public, will be stored indefinitely, can be redistributed as the part of the project, modified or completely removed from the project
* You waive all rights to your contribution
* Unless you request otherwise, you can be mentioned as the author of the contribution in the project documentation and change log

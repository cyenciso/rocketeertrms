# Rocketeer Tuition Reimbursement System
TRMS, or Tuition Reimbursement Management System is a full-stack web application that allows employees to submit requests for reimbursements for courses, events, and certifications. These requests can then be approved or rejected by the employee's direct supervisor, department head, and a benefits coordinator while the employee is able to track the status of their requests.

## List of Features
* As an employee, the user can create a tuition reimburesment form.
* As a supervisor, the user can either reject or accept the form, or else they can ask for more information.
* As a department head, the user can also either reject or accept the form, or else they can ask for more information.
* As a benefits coordinator, the user can also either reject or accept the form, or else they can ask for more information.

## Technologies Used
* DynamoDB
* Express.js
* React
* TypeScript
* Jest
* Enzyme

## Getting Started
* Create a new local project folder and use the command `git clone` with this repository's htttps link afterward.
* In VSCode, create a split terminal.
* In one terminal, use the commands `cd back-end` and `npm install` to install dependencies.
* In the same terminal, use the commands `node ./build/database/employeeTable.js`, `node ./build/database/gradingFormatTable.js`, and `node ./build/database/requestTable.js` to create the database tables. Note: You will need an AWS Account and the region is currently set to 'us-west-2'.
* In the other terminal, use the commands `cd front-end` and `npm install` to install dependencies.
* In both terminals, use the command `npm run start`

## Usage
* View the database table to see list of available users to sign-in as.
* As a user, you can submit a tuition reimbursement form.
* By logging into different user roles, you can see the different decisions you can make.

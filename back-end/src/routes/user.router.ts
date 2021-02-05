import express from 'express';
import logger from '../log';
import * as employee from '../models/employee.model';
import employeeService from '../services/employee.service';

const router = express.Router();

// checking if user is logged in
router.get('/', function(req: any, res, next) {
  if(req.session.user) {
    console.log('checking login: ', req.session.user);
    res.send(JSON.stringify(req.session.user));
  } else {
  res.sendStatus(401);
  }
});

// gets senior employee by current employee role
router.get('/employees/:role', function(req: any, res, next) {
  employeeService.getEmployeeByRole(req.params.role).then((employees) => {
    res.send(JSON.stringify(employees));
  });
});

router.get('/all', function(req: any, res, next) {
  employeeService.getEmployees().then((employees) => {
    res.send(JSON.stringify(employees));
  });
});

// gets senior employee by current employee role
router.get('/:role', function(req: any, res, next) {
  employeeService.getSeniorEmployeeByRole(req.params.role).then((employees) => {
    res.send(JSON.stringify(employees));
  });
});

router.get('/user/:username', function(req: any, res, next) {
  employeeService.getEmployeeByUsername(req.params.username).then( employee => {
    res.send(JSON.stringify(employee));
  });
});

// when client sends POST request to users (to log in)
router.post('/', function(req: any, res, next) {
  logger.debug('Object received from client: ', req.body);

  employee.login(req.body.username, req.body.password).then( employeeReturned => {
    if(employeeReturned === null) {
        req.session.user = employeeReturned;
        res.sendStatus(401);
    } else {
        req.session.user = employeeReturned;
        res.send(JSON.stringify(employeeReturned));
    }
  });
});

// when client sends a PUT request to update a user
router.put('/update', (req, res, next) => {
  logger.debug(req.body);
  employeeService.updateEmployee(req.body).then( data => {
    res.send( data );
  });
});

// when client sends a DELETE request to users (to log out)
router.delete('/', (req, res, next) => {
  req.session.destroy((err) => logger.error(err));
  res.sendStatus(204);
})

export default router;
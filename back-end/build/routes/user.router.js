"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var log_1 = __importDefault(require("../log"));
var employee = __importStar(require("../models/employee.model"));
var employee_service_1 = __importDefault(require("../services/employee.service"));
var router = express_1.default.Router();
// checking if user is logged in
router.get('/', function (req, res, next) {
    if (req.session.user) {
        console.log('checking login: ', req.session.user);
        res.send(JSON.stringify(req.session.user));
    }
    else {
        res.sendStatus(401);
    }
});
// gets senior employee by current employee role
router.get('/employees/:role', function (req, res, next) {
    employee_service_1.default.getEmployeeByRole(req.params.role).then(function (employees) {
        res.send(JSON.stringify(employees));
    });
});
router.get('/all', function (req, res, next) {
    employee_service_1.default.getEmployees().then(function (employees) {
        res.send(JSON.stringify(employees));
    });
});
// gets senior employee by current employee role
router.get('/:role', function (req, res, next) {
    employee_service_1.default.getSeniorEmployeeByRole(req.params.role).then(function (employees) {
        res.send(JSON.stringify(employees));
    });
});
router.get('/user/:username', function (req, res, next) {
    employee_service_1.default.getEmployeeByUsername(req.params.username).then(function (employee) {
        res.send(JSON.stringify(employee));
    });
});
// when client sends POST request to users (to log in)
router.post('/', function (req, res, next) {
    log_1.default.debug('Object received from client: ', req.body);
    employee.login(req.body.username, req.body.password).then(function (employeeReturned) {
        if (employeeReturned === null) {
            req.session.user = employeeReturned;
            res.sendStatus(401);
        }
        else {
            req.session.user = employeeReturned;
            res.send(JSON.stringify(employeeReturned));
        }
    });
});
// when client sends a PUT request to update a user
router.put('/update', function (req, res, next) {
    log_1.default.debug(req.body);
    employee_service_1.default.updateEmployee(req.body).then(function (data) {
        res.send(data);
    });
});
// when client sends a DELETE request to users (to log out)
router.delete('/', function (req, res, next) {
    req.session.destroy(function (err) { return log_1.default.error(err); });
    res.sendStatus(204);
});
exports.default = router;

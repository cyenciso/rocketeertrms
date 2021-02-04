"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var log_1 = __importDefault(require("../log"));
var request_service_1 = __importDefault(require("../services/request.service"));
var router = express_1.default.Router();
// get requests
// add a request to the database
router.post('/', function (req, res, next) {
    request_service_1.default.addRequest(req.body).then(function (data) {
        log_1.default.debug('request added to db: ', data);
        res.sendStatus(201);
    }).catch(function (err) {
        log_1.default.error('Could not add request to db: ', err);
        res.sendStatus(500);
    });
});
// when client sends a PUT request to update a request
router.put('/update', function (req, res, next) {
    log_1.default.debug(req.body);
    request_service_1.default.updateRequest(req.body).then(function (data) {
        res.send(data);
    });
});
exports.default = router;

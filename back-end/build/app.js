"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRoot = void 0;
var http_errors_1 = __importDefault(require("http-errors"));
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var morgan_1 = __importDefault(require("morgan"));
var user_router_1 = __importDefault(require("./routes/user.router"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
var express_session_1 = __importDefault(require("express-session"));
var memorystore_1 = __importDefault(require("memorystore"));
var request_router_1 = __importDefault(require("./routes/request.router"));
dotenv_1.default.config();
// create instance of express
var app = express_1.default();
//
app.use(cors_1.default({ origin: process.env.CLIENT, credentials: true }));
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_session_1.default({
    secret: 'whatever',
    store: new (memorystore_1.default(express_session_1.default))({ checkPeriod: 86400000 }),
    cookie: {}
}));
//root directory of static files
exports.publicRoot = (path_1.default.join(__dirname, '../public'));
// used to point to the root directory of the static files
app.use(express_1.default.static(exports.publicRoot));
// set routers
app.use('/users', user_router_1.default);
app.use('/requests', request_router_1.default);
/*
    if someone makes a request that isn't handled by a router,
    catch 404's and forward to error handler
*/
app.use(function (req, res, next) {
    next(http_errors_1.default(404));
});
// error handler
app.use(function (err, req, res, next) {
    // Send error file
    res.status(err.status || 500);
    res.send('Error!');
});
module.exports = app;

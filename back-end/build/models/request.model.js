"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
var Request = /** @class */ (function () {
    function Request(dateCreated, firstname, lastname, phone, email, eventType, cost, gradingFormat, gradeCutOff, location, startDate, endDate, description, justification) {
        this.id = 0;
        this.dateCreated = '';
        this.dateAwarded = '';
        this.username = '';
        this.isUrgent = false;
        this.projection = 0;
        this.isRevised = false;
        this.demographics = {
            firstname: '',
            lastname: '',
            phone: '',
            email: ''
        };
        this.event = {
            eventType: '',
            cost: 0,
            gradingFormat: '',
            gradeCutOff: '',
            location: '',
            startDate: '',
            endDate: '',
            description: ''
        };
        this.justification = '';
        this.attachments = 'None';
        this.requestInfo = '';
        this.resubmitInfo = '';
        this.rejectInfo = '';
        // Requested, withSupervisor, withDH, withBC, approved, completed
        this.statusOf = 'Requested';
        this.dateCreated = dateCreated;
        this.demographics.firstname = firstname;
        this.demographics.lastname = lastname;
        this.demographics.phone = phone;
        this.demographics.email = email;
        this.event.eventType = eventType;
        this.event.cost = cost;
        this.event.gradingFormat = gradingFormat;
        this.event.gradeCutOff = gradeCutOff;
        this.event.location = location;
        this.event.startDate = startDate;
        this.event.endDate = endDate;
        this.event.description = description;
        this.justification = justification;
    }
    return Request;
}());
exports.Request = Request;

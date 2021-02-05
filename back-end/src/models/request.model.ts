export class Request {

    public id = 0;

    public dateCreated = '';
    public dateAwarded = '';
    public username = '';
    public isUrgent = false;
    public projection = 0;
    public isRevised = false;
    
    public demographics = {
        firstname: '',
        lastname: '',
        phone: '',
        email: ''
    };

    public event = {
        eventType: '',
        cost: 0,
        gradingFormat: '',
        gradeCutOff: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
    };

    public justification = '';

    public attachments = 'None';

    public requestInfo = '';

    public resubmitInfo = '';

    public rejectInfo = '';

    // Requested, withSupervisor, withDH, withBC, approved, completed
    public statusOf = 'Requested';

    constructor(dateCreated: string, firstname: string, lastname: string, phone: string, 
                email: string, eventType: string, cost: number, gradingFormat: string,
                gradeCutOff: string, location: string, startDate: string, endDate: string,
                description: string, justification: string) {
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
}
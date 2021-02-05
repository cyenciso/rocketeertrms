export class Request {

    public id = 0;

    public dateCreated = '';
    public dateAwarded = '';
    public username: string = '';
    public isUrgent = false;
    public projection = 0;
    
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

    public isRevised = false;

    // Pending, Needs Revision, Rejected, Approved, Cancelled, Awarded
    public statusOf = 'Requested';
}
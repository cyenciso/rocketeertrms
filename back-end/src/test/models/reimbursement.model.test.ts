import { Request } from '../../../src/models/request.model';

describe('Request class', () => {
    test('constructor', () => {
        const request = new Request('01/05/2021', 'Bob', 'Smith', '111-111-1111', 'bob.smith@revature.net',
                                                'Certification', 300, 'Letter', 'D', 'Remote', 'startDate',
                                                'endDate', 'Description', 'justification');
        expect(request.dateCreated).toBe('01/05/2021');
        expect(request.demographics.firstname).toBe('Bob');
        expect(request.demographics.lastname).toBe('Smith');
        expect(request.demographics.phone).toBe('111-111-1111');
        expect(request.demographics.email).toBe('bob.smith@revature.net');
        expect(request.event.eventType).toBe('Certification');
        expect(request.event.cost).toBe(300);
        expect(request.event.gradingFormat).toBe('Letter');
        expect(request.event.gradeCutOff).toBe('D');
        expect(request.event.location).toBe('Remote');
        expect(request.event.startDate).toBe('startDate');
        expect(request.event.endDate).toBe('endDate');
        expect(request.event.description).toBe('Description');
        expect(request.justification).toBe('justification');
    });
});
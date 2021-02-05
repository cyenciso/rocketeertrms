import { GradingFormat } from '../../../src/models/gradingFormat.model';

describe('GradingFormat class', () => {
    test('constructor', () => {
        const gradingFormat = new GradingFormat('Letter', false, 'D');

        expect(gradingFormat.gradingType).toBe('Letter');
        expect(gradingFormat.presentationRequired).toBeFalsy;
        expect(gradingFormat.cutOff).toBe('D');
    });
});
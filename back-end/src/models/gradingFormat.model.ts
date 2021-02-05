export class GradingFormat {

    public gradingType = '';
    public presentationRequired = false;
    public cutOff = '';

    constructor(gradingType: string, presentationRequired: boolean, cutOff: string) {
        this.gradingType = gradingType;
        this.presentationRequired = presentationRequired;
        this.cutOff = cutOff;
    }

}
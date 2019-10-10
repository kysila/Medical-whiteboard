import { Visit } from './visit';

export class TherapistVisit extends Visit{

    constructor(visitName, lastName, firstName, secondName, visitDate, purpose, comments, age) {
        super(visitName, lastName, firstName, secondName, visitDate, purpose, comments);
        this._age = age;
    }

    get age() {
        return this._age;
    }

    set age(value) {
        this._age = value;
    }
}

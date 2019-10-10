import { Visit } from './visit';

export class DentistVisit extends Visit {

    constructor(visitName, lastName, firstName, secondName, visitDate, purpose, comments, lastVisitDate, age) {
        super(visitName, lastName, firstName, secondName, visitDate, purpose, comments);
        this._lastVisitDate = lastVisitDate;
        this._age = age;
    }

    get lastVisitDate() {
        return this._lastVisitDate;
    }

    set lastVisitDate(value) {
        this._lastVisitDate = value;
    }

    get age() {
        return this._age;
    }

    set age(value) {
        this._age = value;
    }
}
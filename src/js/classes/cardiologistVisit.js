import { Visit } from './visit';
import { visitMap } from '../db/visitMap';


export class CardiologistVisit extends Visit {

    constructor(visitName, lastName, firstName, secondName, visitDate, purpose, comments, pressure, bodyMassIndex, cvsDiseases, age) {
        super(visitName, lastName, firstName, secondName, visitDate, purpose, comments);
        this._pressure = pressure;
        this._bodyMassIndex = bodyMassIndex; // 16 - 40
        this._cvsDiseases = cvsDiseases;
        this._age = age;
    }

    get pressure() {
        return this._pressure;
    }

    set pressure(value) {
        this._pressure = value;
    }

    get bodyMassIndex() {
        return this._bodyMassIndex;
    }

    set bodyMassIndex(value) {
        this._bodyMassIndex = value;
    }

    get cvsDiseases() {
        return this._cvsDiseases;
    }

    set cvsDiseases(value) {
        this._cvsDiseases = value;
    }

    get age() {
        return this._age;
    }

    set age(value) {
        this._age = value;
    }

    render() {
        console.log('render');
    }
}
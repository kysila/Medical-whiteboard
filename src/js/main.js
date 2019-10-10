// Main js file
import { visitMap } from './db/visitMap';
import { Visit } from './classes/visit';
import { CardiologistVisit } from './classes/cardiologistVisit'
import { DentistVisit } from './classes/dentistVisit'
import { TherapistVisit } from './classes/therapistVisit'




// **********************************************************************************************
// Loading data from LocalStorage on load page
function loadDataToVisitMapFromLocalStorage(json) {
    const mapFromJson = new Map(JSON.parse(json));
    mapFromJson.forEach((el, key) => {
        switch (el._visitName) {
            case 'cardiologist':
                visitMap.set(key, new CardiologistVisit(...Object.values(el)));
                break;
            case 'dentist':
                visitMap.set(key, new DentistVisit(...Object.values(el)));
                break;
            case 'therapist':
                visitMap.set(key, new TherapistVisit(...Object.values(el)));
                break;
            default:
                alert( "Нет таких значений" );
        }
    });
}

function loadDataToVisitsInDomFromLocalStorage(json) {
    const orderArray = JSON.parse(json);
    orderArray.forEach( (id) => {
        Visit.renderVisitOnBoard(id, visitMap.get(id));
    });
}

window.onload = function() {
    // Load data from LocalStorage
    const visitMapJSON = localStorage.getItem('visitMap') || null;
    const visitsOrderInDomJSON = localStorage.getItem('visitsOrderInDom') || null;
    if (visitMapJSON && visitsOrderInDomJSON) {
        loadDataToVisitMapFromLocalStorage(visitMapJSON);
        loadDataToVisitsInDomFromLocalStorage(visitsOrderInDomJSON);
    }
    Visit.toggleBoardInfo();

    // Preloader
    const preloader = document.querySelector('.window-loader');
    const main = document.querySelector('.main');
    preloader.style.display = 'none';
    main.style.display = 'block';
};

// **********************************************************************************************
// Saving data to LocalStorage on unload page
function getStingsArrayFromVisitMap() {
    return JSON.stringify([...visitMap]);
}

function getStringsArrayFromVisitsInDOM() {
    const visitsNodeList = document.querySelectorAll('.board > .visit');
    const visitArray = [...visitsNodeList];
    const visitStringArray = visitArray.map( el => el.dataset.uuid );
    return JSON.stringify(visitStringArray);
}

window.onunload = function() {
    localStorage.setItem('visitMap', getStingsArrayFromVisitMap());
    localStorage.setItem('visitsOrderInDom', getStringsArrayFromVisitsInDOM());
};

// **********************************************************************************************
// Modal window
const btnMakeVisit = document.querySelector('.navbar__btn');
const modalWrapper = document.querySelector('.modal-wrapper');
const btnClose = document.querySelector('.close-form');

btnMakeVisit.addEventListener('click', () => {
    modalWrapper.style.display = 'block';
});

// Close modal window
function closeModalWindow () {
    modalWrapper.style.display = 'none';
}

btnClose.addEventListener('click', closeModalWindow);


// **********************************************************************************************
// Select
const select = document.getElementById('visits');

// Show Doctor fields on change in Select-element
function changeDoctorFields (value) {
    document.querySelectorAll('.doctor').forEach(function (doctor) {
        if (doctor.classList.contains(value)) {
            doctor.removeAttribute('hidden');
            doctor.querySelectorAll('input').forEach(function (inp) {
                inp.setAttribute('required', '');
            });
        } else {
            doctor.setAttribute('hidden', '');
            doctor.querySelectorAll('input').forEach(function (inp) {
                inp.removeAttribute('required');
            });
        }
    });
}

select.addEventListener('change', function () {
    changeDoctorFields(`${select.value}`);
});

// **********************************************************************************************
// Submitting form
const getMapOfInputFields = () => {
    const inputList = form.querySelectorAll('[required]');
    const resultMap = new Map;
    inputList.forEach((el) => {
        resultMap.set(el.name, el.value);
    });
    return resultMap;
};

const form = document.querySelector('.modal-window');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputMap = getMapOfInputFields();
    let object = null;
    switch (select.value) {
        case 'cardiologist':
            object = new CardiologistVisit(inputMap.get('visitName'), inputMap.get('lastName'),
                inputMap.get('firstName'), inputMap.get('secondName'), inputMap.get('visitDate'),
                inputMap.get('purpose'), inputMap.get('comments'), inputMap.get('pressure'),
                inputMap.get('bodyMassIndex'), inputMap.get('cvsDiseases'), inputMap.get('age'));
            break;
        case 'dentist':
            object = new DentistVisit(inputMap.get('visitName'), inputMap.get('lastName'),
                inputMap.get('firstName'), inputMap.get('secondName'), inputMap.get('visitDate'),
                inputMap.get('purpose'), inputMap.get('comments'), inputMap.get('lastVisitDate'), inputMap.get('age'));
            break;
        case 'therapist':
            object = new TherapistVisit(inputMap.get('visitName'), inputMap.get('lastName'),
                inputMap.get('firstName'), inputMap.get('secondName'), inputMap.get('visitDate'),
                inputMap.get('purpose'), inputMap.get('comments'), inputMap.get('age'));
            break;
        default:
            alert( "Нет таких значений" );
    }
    const uuid = Visit.addObjectToVisitMap(object);
    Visit.renderVisitOnBoard(uuid, object);
    form.reset();
    modalWrapper.style.display = 'none';
    changeDoctorFields('cardiologist');
    Visit.toggleBoardInfo();
});

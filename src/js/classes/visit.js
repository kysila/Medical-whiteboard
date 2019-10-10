const uuidv1 = require('uuid/v1');
import { visitMap } from '../db/visitMap';

export class Visit {

    // Adding object-visit to visitMap
    static addObjectToVisitMap(o) {
        const uuid = uuidv1();
        visitMap.set(uuid, o);
        return uuid;
    };

    static getVisitName(o) {
        // Options from Select (id='visits')
        return [...document.querySelector('select').options].find(function (el) {
            return el.value === o.visitName;
        });
    }

    // Toggle board-info text
    static toggleBoardInfo() {
        if (!visitMap.size) {
            const board = document.querySelector('.board');
            const boardInfo = document.createElement('p');
            boardInfo.classList.add('board-info');
            boardInfo.innerText = 'No items have been added';
            board.appendChild(boardInfo);
        } else {
            const boardInfo = document.querySelector('.board-info');
            if (boardInfo) {
                boardInfo.remove();
            }
        }
    }

    // For DnD
    static _dragElement = null;

    static _handleDragStart(e) {
        Visit._dragElement = this;
        this.style.opacity = '0.3';
    }

    static _handleDragOver(e) {
        e.preventDefault(); // Necessary. Allows us to drop.
        e.dataTransfer.dropEffect = 'move';
        this.firstElementChild.style.display = 'block';
    }

    static _handleDragLeave(e) {
        this.firstElementChild.style.display = 'none';
    }

    static _handleDrop(e) {
        if (Visit._dragElement !== this) {
            const clonedEl = Visit._dragElement.cloneNode(true);
            this.parentNode.removeChild(Visit._dragElement);
            this.firstElementChild.style.display = 'none';
            clonedEl.style.opacity = "";
            this.style.opacity = "";
            Visit.addDnDHandlers(clonedEl);
            Visit.addButtonsHandlers(clonedEl);
            this.parentNode.insertBefore(clonedEl, this);
        }
    }

    static _handleDragEnd() {
        this.firstElementChild.style.display = 'none';
        this.style.opacity = "";
    }

    static addDnDHandlers(v) {
        v.addEventListener('dragstart', Visit._handleDragStart, false);
        v.addEventListener('dragover', Visit._handleDragOver, false);
        v.addEventListener('dragleave', Visit._handleDragLeave, false);
        v.addEventListener('drop', Visit._handleDrop, false);
        v.addEventListener('dragend', Visit._handleDragEnd, false);
    }

    static addButtonsHandlers(v) {
        // Func expend visit
        function expand() {
            this.parentNode.querySelectorAll('.input-field.hidden').forEach(el => {
                el.style.display = 'block';
            });
            showMoreBtn.removeEventListener('click', expand);
            showMoreBtn.innerHTML = 'Свернуть';
            showMoreBtn.addEventListener('click', collapse)
        }

        // Func collapse visit
        function collapse() {
            this.parentNode.querySelectorAll('.input-field.hidden').forEach(el => {
                el.style.display = 'none';
            });
            showMoreBtn.removeEventListener('click', collapse);
            showMoreBtn.innerHTML = 'Показать больше';
            showMoreBtn.addEventListener('click', expand)
        }

        // ShowMore button
        const showMoreBtn = v.querySelector('.btn--show-more');
        showMoreBtn.addEventListener('click', expand);

        // Delete button
        const deleteVisitBtn = v.querySelector('.btn--delete');
        deleteVisitBtn.addEventListener('click', function (e) {
            try {
                // deleting object from visitMap
                visitMap.delete(e.target.parentNode.dataset.uuid);
                // deleting reflection of object in DOM
                e.target.parentNode.remove();
            } catch (e) {
                console.log(e);
            }
            Visit.toggleBoardInfo();
        });
    }

    // Showing object-visit in DOM
    static renderVisitOnBoard(id, o) {
        // Board
        const board = document.querySelector('.board');
        // Getting visitTemplate
        const visitTemplate = document.getElementById('visit-template').content.cloneNode(true);
        const visit = visitTemplate.querySelector('.visit');
        // Adding uuid to attribute data-uuid
        visit.dataset.uuid = id;
        //
        visit.setAttribute('draggable', 'true');
        // Adding uuid to attribute data-visit
        visit.dataset.visit = Visit.getVisitName(o).value;
        // Deleting unnecessary Dom-elements from visit-in-DOM
        visit.querySelectorAll('.input-field').forEach(el => {
            if (!el.classList.contains('common') && !el.classList.contains(Visit.getVisitName(o).value)) {
                try {
                    el.remove();
                } catch (e) {
                    console.log(e);
                }
            }
        });

        // Mapping fields from object to visit-in-DOM
        visit.querySelectorAll('[name]').forEach(field => {
            // Translate cardiologist -> Кардиолог
            if (field.name === 'visitName') {
                field.value = Visit.getVisitName(o).innerText;
            } else {
                // Mapping fields from object to visit-in-DOM
                field.value = o[field.name];
            }
        });

        // DnD
        Visit.addDnDHandlers(visit);
        Visit.addButtonsHandlers(visit);

        // Render visitTemplate on board
        board.appendChild(visitTemplate);
    }

    constructor(visitName, lastName, firstName, secondName, visitDate, purpose, comments) {
        this._visitName = visitName;
        this._lastName = lastName;
        this._firstName = firstName;
        this._secondName = secondName;
        this._visitDate = visitDate;
        this._purpose = purpose;
        this._comments = comments;
    }

    get visitName() {
        return this._visitName;
    }

    set visitName(value) {
        this._visitName = value;
    }

    get lastName() {
        return this._lastName;
    }

    set lastName(value) {
        this._lastName = value;
    }

    get firstName() {
        return this._firstName;
    }

    set firstName(value) {
        this._firstName = value;
    }

    get secondName() {
        return this._secondName;
    }

    set secondName(value) {
        this._secondName = value;
    }

    get visitDate() {
        return this._visitDate;
    }

    set visitDate(value) {
        this._visitDate = value;
    }

    get purpose() {
        return this._purpose;
    }

    set purpose(value) {
        this._purpose = value;
    }

    get comments() {
        return this._comments;
    }

    set comments(value) {
        this._comments = value;
    }

    get fullName() {
        return `${this._lastName} ${this._firstName} ${this._secondName}`;
    }

    get shortName() {
        return `${this._firstName} ${this._lastName}`;
    }
}

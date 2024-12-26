/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { getRecurrenceStringFromDate } from '../../recurrence-editor/date-generator';
/**
 * ICalendar Import Module
 */
var ICalendarImport = /** @class */ (function () {
    function ICalendarImport(parent) {
        this.allDay = false;
        this.parent = parent;
    }
    ICalendarImport.prototype.initializeCalendarImport = function (fileContent) {
        var _this = this;
        if (fileContent && fileContent instanceof Blob) {
            var fileReader_1 = new FileReader();
            fileReader_1.onload = function () {
                var iCalString = fileReader_1.result;
                _this.iCalendarParser(iCalString);
            };
            fileReader_1.readAsText(fileContent, 'UTF-8');
        }
        else if (fileContent && typeof fileContent === 'string') {
            this.iCalendarParser(fileContent);
        }
    };
    ICalendarImport.prototype.iCalendarParser = function (iCalString) {
        var iCalData = {
            isEvent: false,
            curEvent: null,
            id: this.parent.eventBase.getEventMaxID(),
            count: 0,
            events: [],
            key: null
        };
        var iStringLength = iCalString.length;
        var lastPosition = iCalString.search(/[^ \t]/);
        var position = lastPosition;
        var iString;
        var newlineOffset;
        do {
            position = iCalString.indexOf('\n', lastPosition) + 1;
            if (position === 0) {
                position = iStringLength;
                newlineOffset = 0;
            }
            else if (position > 1 && iCalString[position - 2] === '\r') {
                newlineOffset = 2;
            }
            else {
                newlineOffset = 1;
            }
            var firstChar = iCalString.charAt(lastPosition);
            if (firstChar === ' ' || firstChar === '\n' || firstChar === '\t') {
                iString += iCalString.slice(lastPosition + 1, position - newlineOffset);
            }
            else {
                if (iString) {
                    iCalData = this.updateEventData(iString, iCalData);
                }
                iString = iCalString.slice(lastPosition, position - newlineOffset);
            }
            lastPosition = position;
        } while (position !== iStringLength);
        iString = iString.trim();
        if (iString.length) {
            iCalData = this.updateEventData(iString, iCalData);
        }
        var app = extend([], iCalData.events, null, true);
        this.parent.addEvent(this.processOccurrence(app, iCalData.id));
    };
    ICalendarImport.prototype.updateEventData = function (iString, iCalData) {
        var fields = this.parent.eventFields;
        var SEPARATOR = '\r\n';
        var id = iCalData.id;
        var events = iCalData.events;
        var isEvent = iCalData.isEvent;
        var count = iCalData.count;
        var curEvent = iCalData.curEvent;
        var key = iCalData.key;
        if (!isEvent && iString === 'BEGIN:VEVENT') {
            isEvent = true;
            curEvent = {};
        }
        if (isEvent && iString === 'END:VEVENT') {
            isEvent = false;
            events.push(curEvent);
            curEvent = null;
        }
        if (isEvent) {
            var index = iString.indexOf(':');
            var type_1 = iString.substring(0, index).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            var value = iString.substring(index + 1, iString.length).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            if (iString.indexOf('SUMMARY') !== -1) {
                type_1 = 'SUMMARY';
            }
            if (iString.indexOf('DTSTART') !== -1) {
                curEvent[fields.startTime] = this.dateParsing(iString);
                curEvent[fields.isAllDay] = this.allDay;
                this.allDay = false;
            }
            else if (iString.indexOf('DTEND') !== -1) {
                curEvent[fields.endTime] = this.dateParsing(iString);
            }
            else if (iString.indexOf('EXDATE') !== -1) {
                value = getRecurrenceStringFromDate(this.dateParsing(iString));
                curEvent[fields.recurrenceException] = isNullOrUndefined(curEvent[fields.recurrenceException]) ?
                    value : curEvent[fields.recurrenceException] + ',' + value;
            }
            else if (iString.indexOf('RECURRENCE-ID') !== -1) {
                value = getRecurrenceStringFromDate(this.dateParsing(iString));
                curEvent[fields.recurrenceException] = value;
                curEvent[fields.recurrenceID] = value;
            }
            else {
                key = type_1 || key;
                switch (key) {
                    case 'BEGIN':
                        break;
                    case 'UID':
                        curEvent["" + type_1] = value;
                        if (typeof (id) == 'number') {
                            curEvent[fields.id] = parseInt(value, 10);
                            if (isNaN(curEvent[fields.id])) {
                                curEvent[fields.id] = id + count;
                                count++;
                            }
                        }
                        else {
                            curEvent[fields.id] = value;
                        }
                        break;
                    case 'SUMMARY':
                        curEvent[fields.subject] = this.getFormattedString(value);
                        break;
                    case 'LOCATION':
                        curEvent[fields.location] = this.getFormattedString(value);
                        break;
                    case 'DESCRIPTION':
                        if (curEvent[fields.description]) {
                            curEvent[fields.description] = this.getFormattedString(curEvent[fields.description] + SEPARATOR + value);
                        }
                        else {
                            curEvent[fields.description] = this.getFormattedString(value);
                        }
                        break;
                    case 'ISREADONLY':
                        curEvent[fields.isReadonly] = (value.indexOf('true') > -1);
                        break;
                    case 'RRULE':
                        curEvent[fields.recurrenceRule] = value;
                        break;
                    default:
                        if (this.parent.resourceCollection.length > 0) {
                            var resData = this.parent.resourceCollection.filter(function (data) { return data.field === type_1; });
                            curEvent["" + type_1] = (resData.length > 0 && (typeof (resData[0].dataSource[0][resData[0].idField]) == 'number')) ? parseInt(value, 10) : value;
                        }
                        else {
                            curEvent["" + type_1] = value;
                        }
                }
            }
        }
        return { isEvent: isEvent, curEvent: curEvent, id: id, count: count, events: events, key: key };
    };
    ICalendarImport.prototype.processOccurrence = function (app, maxId) {
        var _this = this;
        var appoint = [];
        var uId = 'UID';
        var fields = this.parent.eventFields;
        var appointmentIds = [];
        this.parent.eventsData.forEach(function (eventObj) {
            appointmentIds.push(eventObj[fields.id]);
        });
        app.forEach(function (eventObj) {
            var parentObj;
            var id;
            // eslint-disable-next-line no-prototype-builtins
            if (!eventObj.hasOwnProperty(fields.recurrenceID)) {
                parentObj = eventObj;
                id = eventObj[fields.id];
            }
            if (appointmentIds.indexOf(eventObj[fields.id]) < 0) {
                var data = app.filter(function (data) { return data.UID === eventObj["" + uId]; });
                if (data.length > 1 && isNullOrUndefined(eventObj[fields.recurrenceID])) {
                    id = typeof (maxId) === 'number' ? maxId++ : id;
                    for (var i = 0; i < data.length; i++) {
                        // eslint-disable-next-line no-prototype-builtins
                        if (data[parseInt(i.toString(), 10)].hasOwnProperty(fields.recurrenceID)) {
                            var exdate = data[parseInt(i.toString(), 10)][fields.recurrenceID];
                            data[parseInt(i.toString(), 10)][fields.id] = typeof (maxId) === 'number' ? maxId++ : _this.parent.eventBase.generateGuid();
                            data[parseInt(i.toString(), 10)][fields.recurrenceID] = id;
                            data[parseInt(i.toString(), 10)][fields.recurrenceException] = null;
                            parentObj[fields.recurrenceException] =
                                _this.getExcludeDateString(parentObj[fields.recurrenceException], exdate);
                            delete data[parseInt(i.toString(), 10)]["" + uId];
                            appoint.push(data[parseInt(i.toString(), 10)]);
                        }
                    }
                    delete parentObj["" + uId];
                    parentObj[fields.id] = id;
                    appoint.push(parentObj);
                    // eslint-disable-next-line no-prototype-builtins
                }
                else if (!eventObj.hasOwnProperty(fields.recurrenceID)) {
                    delete eventObj["" + uId];
                    eventObj[fields.id] = typeof (maxId) === 'number' ? maxId++ : id;
                    appoint.push(eventObj);
                }
            }
        });
        return appoint;
    };
    ICalendarImport.prototype.getExcludeDateString = function (parentException, occurrenceException) {
        if (isNullOrUndefined(parentException)) {
            return occurrenceException;
        }
        else if (isNullOrUndefined(occurrenceException)) {
            return parentException;
        }
        var parentExDate = parentException.split(',').map(function (x) { return x.split('T')[0]; });
        var childExDate = occurrenceException.split(',').map(function (x) { return x.split('T')[0]; });
        var exDate = parentExDate.filter(function (x) { return childExDate.indexOf(x) > -1; });
        if (exDate.length > 0) {
            return parentException;
        }
        return parentException + ',' + occurrenceException;
    };
    ICalendarImport.prototype.getFormattedString = function (value) {
        value = value || '';
        // eslint-disable-next-line no-useless-escape
        return (value.replace(/\\\,/g, ',').replace(/\\\;/g, ';').replace(/\\[nN]/g, '\n').replace(/\\\\/g, '\\'));
    };
    ICalendarImport.prototype.dateParsing = function (element) {
        var split = element.split(':');
        var value = split[split.length - 1];
        var newDate = new Date(this.getFormattedString(value));
        if (element && (element.indexOf('VALUE=DATE') > -1 || element.indexOf('RECURRENCE-ID;TZID') > -1)) {
            var data_1 = /^(\d{4})(\d{2})(\d{2})$/.exec(value);
            if (data_1 !== null) {
                newDate = new Date(parseInt(data_1[1], 10), parseInt(data_1[2], 10) - 1, parseInt(data_1[3], 10));
            }
            if (element.indexOf('DTSTART') > -1) {
                this.allDay = true;
            }
        }
        var data = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/.exec(value);
        if (data !== null) {
            if (data[7] === 'Z') {
                newDate = new Date(Date.UTC(parseInt(data[1], 10), parseInt(data[2], 10) - 1, parseInt(data[3], 10), parseInt(data[4], 10), parseInt(data[5], 10), parseInt(data[6], 10)));
            }
            else {
                newDate = new Date(parseInt(data[1], 10), parseInt(data[2], 10) - 1, parseInt(data[3], 10), parseInt(data[4], 10), parseInt(data[5], 10), parseInt(data[6], 10));
            }
        }
        return newDate;
    };
    ICalendarImport.prototype.getModuleName = function () {
        return 'iCalendarImport';
    };
    ICalendarImport.prototype.destroy = function () {
        if (!this.parent || this.parent && this.parent.isDestroyed) {
            return;
        }
    };
    return ICalendarImport;
}());
export { ICalendarImport };

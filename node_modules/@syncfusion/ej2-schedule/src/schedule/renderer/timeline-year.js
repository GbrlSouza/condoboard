var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/* eslint-disable @typescript-eslint/no-explicit-any */
import { append, addClass, createElement, EventHandler } from '@syncfusion/ej2-base';
import { Year } from './year';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';
import * as util from '../base/util';
/**
 * timeline year view
 */
var TimelineYear = /** @class */ (function (_super) {
    __extends(TimelineYear, _super);
    function TimelineYear(parent) {
        var _this = _super.call(this, parent) || this;
        _this.viewClass = 'e-timeline-year-view';
        _this.isInverseTableSelect = true;
        return _this;
    }
    TimelineYear.prototype.getModuleName = function () {
        return 'timelineYear';
    };
    TimelineYear.prototype.renderHeader = function (headerWrapper) {
        var tr = createElement('tr');
        headerWrapper.appendChild(tr);
        if (this.parent.activeViewOptions.orientation === 'Vertical' && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.uiStateValues.isGroupAdaptive) {
            this.parent.resourceBase.renderResourceHeaderIndent(tr);
        }
        else {
            var leftHeaderCells = createElement('td', { className: cls.LEFT_INDENT_CLASS });
            tr.appendChild(leftHeaderCells);
            leftHeaderCells.appendChild(this.renderResourceHeader(cls.LEFT_INDENT_WRAP_CLASS));
        }
        var isHorizontal = this.parent.activeViewOptions.orientation === 'Horizontal';
        var isGroup = this.parent.activeViewOptions.group.resources.length > 0;
        this.isInverseTableSelect = isHorizontal && !isGroup ? false : true;
        var td = createElement('td');
        tr.appendChild(td);
        var container = createElement('div', { className: cls.DATE_HEADER_CONTAINER_CLASS });
        td.appendChild(container);
        if (this.parent.activeViewOptions.orientation === 'Horizontal' && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.uiStateValues.isGroupAdaptive) {
            container.appendChild(this.renderResourceHeader(cls.DATE_HEADER_WRAP_CLASS));
            this.columnCount = this.colLevels.slice(-1)[0].length;
        }
        else {
            var wrapper = createElement('div', { className: cls.DATE_HEADER_WRAP_CLASS });
            container.appendChild(wrapper);
            var table = this.createTableLayout();
            wrapper.appendChild(table);
            table.appendChild(this.createTableColGroup(this.columnCount));
            var innerTr = createElement('tr');
            table.querySelector('tbody').appendChild(innerTr);
            var months = this.getMonths();
            var dayHeaderDates = this.getMonthDates(new Date(this.parent.selectedDate.getFullYear(), months[0], 1));
            for (var column = 0; column < this.columnCount; column++) {
                var date = new Date(this.parent.selectedDate.getFullYear(), months[parseInt(column.toString(), 10)], 1);
                var innerTd = createElement('td', { className: cls.HEADER_CELLS_CLASS });
                if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                    if (this.parent.dayHeaderTemplate) {
                        append(this.renderDayMonthHeaderTemplate(dayHeaderDates[parseInt(column.toString(), 10)], column, 'dayHeaderTemplate'), innerTd);
                    }
                    else {
                        innerTd.innerHTML = "<span>" + this.parent.getDayNames('abbreviated')[column % 7] + "</span>";
                    }
                }
                else {
                    if (this.parent.monthHeaderTemplate) {
                        append(this.renderDayMonthHeaderTemplate(date, months[parseInt(column.toString(), 10)], 'monthHeaderTemplate'), innerTd);
                    }
                    else {
                        innerTd.innerHTML = "<span>" + this.getMonthName(date) + "</span>";
                    }
                    innerTd.setAttribute('data-date', date.getTime().toString());
                }
                innerTr.appendChild(innerTd);
                this.parent.trigger(event.renderCell, { elementType: 'headerCells', element: innerTd });
            }
        }
    };
    TimelineYear.prototype.renderResourceHeader = function (className) {
        var wrap = createElement('div', { className: className });
        var tbl = this.createTableLayout();
        wrap.appendChild(tbl);
        var trEle = createElement('tr');
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            this.colLevels = this.generateColumnLevels();
        }
        else {
            var colData = [{ className: [cls.HEADER_CELLS_CLASS], type: 'headerCell' }];
            this.colLevels = [colData];
        }
        for (var _i = 0, _a = this.colLevels; _i < _a.length; _i++) {
            var col = _a[_i];
            var ntr = trEle.cloneNode();
            var count = className === cls.DATE_HEADER_WRAP_CLASS ? col : [col[0]];
            for (var _b = 0, count_1 = count; _b < count_1.length; _b++) {
                var c = count_1[_b];
                var tdEle = createElement('td');
                if (c.className) {
                    addClass([tdEle], c.className);
                }
                if (className === cls.DATE_HEADER_WRAP_CLASS) {
                    if (c.template) {
                        append(c.template, tdEle);
                    }
                    if (c.colSpan) {
                        tdEle.setAttribute('colspan', c.colSpan.toString());
                    }
                    if (c.groupIndex > -1) {
                        tdEle.setAttribute('data-group-index', c.groupIndex.toString());
                    }
                    this.setResourceHeaderContent(tdEle, c);
                }
                if (className === cls.LEFT_INDENT_WRAP_CLASS) {
                    this.parent.renderHeaderIndentTemplate(c, tdEle);
                }
                var args = { elementType: c.type, element: tdEle, date: c.date, groupIndex: c.groupIndex };
                this.parent.trigger(event.renderCell, args);
                ntr.appendChild(tdEle);
            }
            tbl.querySelector('tbody').appendChild(ntr);
        }
        if (className === cls.DATE_HEADER_WRAP_CLASS) {
            tbl.appendChild(this.createTableColGroup(this.colLevels.slice(-1)[0].length));
        }
        return wrap;
    };
    TimelineYear.prototype.renderContent = function (contentWrapper) {
        var tr = createElement('tr');
        contentWrapper.appendChild(tr);
        var firstTd = createElement('td');
        var lastTd = createElement('td');
        var tdCollection = [];
        var monthTBody;
        if (this.parent.activeViewOptions.orientation === 'Vertical' && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.uiStateValues.isGroupAdaptive) {
            tdCollection.push(firstTd);
            firstTd.appendChild(this.parent.resourceBase.createResourceColumn());
            this.rowCount = this.parent.resourceBase.renderedResources.length;
        }
        else {
            tdCollection.push(firstTd);
            var monthWrapper = createElement('div', { className: cls.MONTH_HEADER_WRAPPER });
            firstTd.appendChild(monthWrapper);
            monthWrapper.appendChild(this.createTableLayout());
            monthTBody = monthWrapper.querySelector('tbody');
        }
        tdCollection.push(lastTd);
        append(tdCollection, tr);
        var content = createElement('div', { className: cls.CONTENT_WRAP_CLASS });
        lastTd.appendChild(content);
        var contentTable = this.createTableLayout(cls.CONTENT_TABLE_CLASS);
        this.setAriaAttributes(contentTable);
        content.appendChild(contentTable);
        var eventWrapper = createElement('div', { className: cls.EVENT_TABLE_CLASS });
        content.appendChild(eventWrapper);
        if (this.parent.virtualScrollModule) {
            this.parent.virtualScrollModule.renderVirtualTrack(content);
        }
        var contentTBody = contentTable.querySelector('tbody');
        if (this.parent.rowAutoHeight) {
            var addClassTable = [contentTable];
            var monthHeader = this.parent.element.querySelector('.' + cls.MONTH_HEADER_WRAPPER + ' .' + cls.SCHEDULE_TABLE_CLASS);
            if (monthHeader) {
                addClassTable.push(monthHeader);
            }
            addClass(addClassTable, cls.AUTO_HEIGHT);
        }
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            var colCount = this.parent.activeViewOptions.orientation === 'Horizontal' ? this.colLevels.slice(-1)[0].length : this.columnCount;
            contentTable.appendChild(this.createTableColGroup(colCount));
            this.renderResourceContent(eventWrapper, monthTBody, contentTBody);
        }
        else {
            contentTable.appendChild(this.createTableColGroup(this.columnCount));
            this.renderDefaultContent(eventWrapper, monthTBody, contentTBody);
        }
    };
    TimelineYear.prototype.renderDefaultContent = function (wrapper, monthBody, contentBody) {
        var months = this.getMonths();
        var dayHeaderDates = this.getMonthDates(new Date(this.parent.selectedDate.getFullYear(), months[0], 1));
        for (var month = 0; month < this.rowCount; month++) {
            wrapper.appendChild(createElement('div', { className: cls.APPOINTMENT_CONTAINER_CLASS }));
            var monthDate = new Date(this.parent.selectedDate.getFullYear(), months[parseInt(month.toString(), 10)], 1);
            var monthStart = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
            var monthEnd = this.parent.calendarUtil.getMonthEndDate(new Date(monthDate.getTime()));
            var tr = createElement('tr');
            var monthTr = tr.cloneNode();
            monthBody.appendChild(monthTr);
            var contentTr = tr.cloneNode();
            contentBody.appendChild(contentTr);
            var monthTd = createElement('td', { className: cls.MONTH_HEADER_CLASS });
            if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                if (this.parent.monthHeaderTemplate) {
                    append(this.renderDayMonthHeaderTemplate(monthStart, month, 'monthHeaderTemplate'), monthTd);
                }
                else {
                    monthTd.innerHTML = "<span>" + this.getMonthName(monthDate) + "</span>";
                }
                monthTd.setAttribute('data-date', monthDate.getTime().toString());
            }
            else {
                if (this.parent.dayHeaderTemplate) {
                    append(this.renderDayMonthHeaderTemplate(dayHeaderDates[parseInt(month.toString(), 10)], month, 'dayHeaderTemplate'), monthTd);
                }
                else {
                    monthTd.innerHTML = "<span>" + this.parent.getDayNames('abbreviated')[month % 7] + "</span>";
                }
            }
            monthTr.appendChild(monthTd);
            this.parent.trigger(event.renderCell, { elementType: 'leftHeaderCells', element: monthTd });
            var date = new Date(monthStart.getTime());
            for (var column = 0; column < this.columnCount; column++) {
                var isDateAvail = void 0;
                if (this.parent.activeViewOptions.orientation === 'Vertical') {
                    monthDate = new Date(this.parent.selectedDate.getFullYear(), months[parseInt(column.toString(), 10)], 1);
                    monthStart = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
                    monthEnd = this.parent.calendarUtil.getMonthEndDate(new Date(monthDate.getTime()));
                    var dayDate = (month - monthStart.getDay()) + 1;
                    date = new Date(this.parent.selectedDate.getFullYear(), months[parseInt(column.toString(), 10)], dayDate);
                    isDateAvail = dayDate > 0 && date.getTime() < monthEnd.getTime();
                }
                else {
                    isDateAvail = column >= monthStart.getDay() && date.getTime() < monthEnd.getTime();
                }
                var announcementText = this.parent.globalize.formatDate(date, {
                    skeleton: 'full', calendar: this.parent.getCalendarMode()
                });
                var td = createElement('td', {
                    className: cls.WORK_CELLS_CLASS, attrs: { 'aria-label': announcementText }
                });
                contentTr.appendChild(td);
                var dateHeader = createElement('div', {
                    className: cls.DATE_HEADER_CLASS + ' ' + cls.NAVIGATE_CLASS,
                    innerHTML: (isDateAvail) ?
                        this.parent.globalize.formatDate(date, { skeleton: 'd', calendar: this.parent.getCalendarMode() }) : ''
                });
                if (isDateAvail) {
                    var tds = [td];
                    var classList = [];
                    if (this.parent.activeViewOptions.workDays.indexOf(date.getDay()) > -1) {
                        classList.push(cls.WORKDAY_CLASS);
                    }
                    if (!this.parent.isMinMaxDate(date)) {
                        addClass([td], cls.DISABLE_DATES);
                    }
                    if (this.isCurrentDate(date)) {
                        classList.push(cls.CURRENT_DAY_CLASS);
                        if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                            tds.push(this.element.querySelector('.' + cls.HEADER_CELLS_CLASS + (":nth-child(" + (column + 1) + ")")));
                        }
                        else {
                            tds.push(this.element.querySelectorAll('.' + cls.MONTH_HEADER_CLASS).item(month));
                        }
                    }
                    if (classList.length > 0) {
                        addClass(tds, classList);
                    }
                }
                else {
                    addClass([td], cls.OTHERMONTH_CLASS);
                    if (!this.parent.isMinMaxDate(date)) {
                        addClass([td], cls.DISABLE_DATES);
                    }
                }
                if (td.classList.contains(cls.OTHERMONTH_CLASS)) {
                    continue;
                }
                else {
                    this.renderDates.push(new Date(date));
                }
                td.appendChild(dateHeader);
                if (isDateAvail) {
                    td.setAttribute('data-date', date.getTime().toString());
                    this.wireEvents(td);
                }
                this.renderCellTemplate({ date: date, type: 'workCells' }, td);
                this.parent.trigger(event.renderCell, { elementType: 'workCells', element: td, date: date });
                if (isDateAvail) {
                    if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                        date = util.addDays(new Date(date.getTime()), 1);
                    }
                }
            }
        }
        this.renderDates.splice(0, 1);
    };
    TimelineYear.prototype.getContentRows = function () {
        var tRow = [];
        var monthCells = this.getMonths();
        var existingGroupIndices = this.getGroupIndices();
        for (var row = 0; row < this.parent.resourceBase.renderedResources.length; row++) {
            var resData = void 0;
            if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                resData = this.parent.resourceBase.renderedResources[parseInt(row.toString(), 10)];
                if (existingGroupIndices.length > 0 && existingGroupIndices.indexOf(resData.groupIndex) > -1) {
                    continue;
                }
            }
            var tr = createElement('tr');
            tRow.push(tr);
            var monthDate = new Date(this.parent.selectedDate.getFullYear(), monthCells[parseInt(row.toString(), 10)], 1);
            var date = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
            for (var month = 0; month < this.columnCount; month++) {
                var classList = [];
                var groupIndex = resData.groupIndex;
                classList = classList.concat(resData.className);
                if (classList.indexOf(cls.RESOURCE_PARENT_CLASS) > -1) {
                    classList.push(cls.RESOURCE_GROUP_CELLS_CLASS);
                }
                else {
                    classList.push(cls.WORKDAY_CLASS);
                }
                monthDate = new Date(this.parent.selectedDate.getFullYear(), monthCells[parseInt(month.toString(), 10)], 1);
                date = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
                var tdELe = createElement('td', {
                    className: cls.WORK_CELLS_CLASS,
                    attrs: {
                        'aria-selected': 'false',
                        'data-date': date.getTime().toString()
                    }
                });
                addClass([tdELe], classList);
                tdELe.setAttribute('data-group-index', groupIndex.toString());
                this.renderCellTemplate({ date: date, type: 'resourceGroupCells', groupIndex: groupIndex }, tdELe);
                this.wireEvents(tdELe);
                this.parent.trigger(event.renderCell, { elementType: 'resourceGroupCells', element: tdELe, date: date });
                tr.appendChild(tdELe);
            }
        }
        return tRow;
    };
    TimelineYear.prototype.renderResourceContent = function (wrapper, monthBody, contentBody) {
        var months = this.getMonths();
        for (var row = 0; row < this.rowCount; row++) {
            wrapper.appendChild(createElement('div', { className: cls.APPOINTMENT_CONTAINER_CLASS }));
            var tr = createElement('tr');
            contentBody.appendChild(tr);
            var resData = void 0;
            if (this.parent.activeViewOptions.orientation === 'Vertical' && this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
                resData = this.parent.resourceBase.renderedResources[parseInt(row.toString(), 10)];
            }
            var monthDate = new Date(this.parent.selectedDate.getFullYear(), months[parseInt(row.toString(), 10)], 1);
            var date = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
            if (this.parent.activeViewOptions.orientation === 'Horizontal') {
                var monthTr = tr.cloneNode();
                monthBody.appendChild(monthTr);
                var monthTd = createElement('td', {
                    className: cls.MONTH_HEADER_CLASS,
                    attrs: { 'data-date': date.getTime().toString() }
                });
                if (this.parent.monthHeaderTemplate) {
                    append(this.renderDayMonthHeaderTemplate(monthDate, row, 'monthHeaderTemplate'), monthTd);
                }
                else {
                    monthTd.innerHTML = "<span>" + this.getMonthName(monthDate) + "</span>";
                }
                monthTr.appendChild(monthTd);
            }
            for (var month = 0; month < this.columnCount; month++) {
                var classList = [];
                var groupIndex = void 0;
                if (this.parent.activeViewOptions.orientation === 'Vertical') {
                    groupIndex = resData.groupIndex;
                    classList = classList.concat(resData.className);
                    if (classList.indexOf(cls.RESOURCE_PARENT_CLASS) > -1) {
                        classList.push(cls.RESOURCE_GROUP_CELLS_CLASS);
                    }
                    else {
                        classList.push(cls.WORKDAY_CLASS);
                    }
                    monthDate = new Date(this.parent.selectedDate.getFullYear(), months[parseInt(month.toString(), 10)], 1);
                    date = this.parent.calendarUtil.getMonthStartDate(new Date(monthDate.getTime()));
                }
                else {
                    groupIndex = this.colLevels.slice(-1)[0][parseInt(month.toString(), 10)].groupIndex;
                    classList.push(cls.WORKDAY_CLASS);
                }
                var startDateText = this.parent.globalize.formatDate(date, { type: 'dateTime', skeleton: 'full', calendar: this.parent.getCalendarMode() });
                var endDateText = this.parent.globalize.formatDate(this.parent.calendarUtil.getMonthEndDate(new Date(monthDate.getTime())), { type: 'dateTime', skeleton: 'full', calendar: this.parent.getCalendarMode() });
                var td = createElement('td', {
                    className: cls.WORK_CELLS_CLASS,
                    attrs: {
                        'aria-selected': 'false',
                        'data-date': date.getTime().toString(),
                        'aria-label': startDateText + ' ' + this.parent.localeObj.getConstant('endAt') + ' ' + endDateText
                    }
                });
                addClass([td], classList);
                td.setAttribute('data-group-index', groupIndex.toString());
                this.renderCellTemplate({ date: date, type: 'resourceGroupCells', groupIndex: groupIndex }, td);
                this.wireEvents(td);
                tr.appendChild(td);
                this.parent.trigger(event.renderCell, { elementType: 'resourceGroupCells', element: td, date: date });
            }
        }
        if (this.parent.activeViewOptions.orientation === 'Vertical') {
            this.collapseRows(this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS));
        }
    };
    TimelineYear.prototype.renderDayMonthHeaderTemplate = function (date, column, type) {
        var args = { date: date, type: type === 'dayHeaderTemplate' ? 'dayHeader' : 'monthHeader' };
        var dayId = "schedule_" + this.parent.activeViewOptions.dayHeaderTemplateName + "dayHeaderTemplate";
        var monthId = "schedule_" + this.parent.activeViewOptions.dayHeaderTemplateName + "monthHeaderTemplate";
        if (type === 'dayHeaderTemplate') {
            args.day = this.parent.getDayNames('wide')[column % 7];
            return [].slice.call(this.parent.getDayHeaderTemplate()(args, this.parent, 'dayHeaderTemplate', dayId, false, undefined, undefined, this.parent.root));
        }
        else {
            return [].slice.call(this.parent.getMonthHeaderTemplate()(args, this.parent, 'monthHeaderTemplate', monthId, false, undefined, undefined, this.parent.root));
        }
    };
    TimelineYear.prototype.renderCellTemplate = function (data, td) {
        if (!this.parent.activeViewOptions.cellTemplate || td.classList.contains(cls.OTHERMONTH_CLASS)) {
            return;
        }
        var args = { date: data.date, type: data.type };
        if (data.groupIndex) {
            args.groupIndex = data.groupIndex;
        }
        var scheduleId = this.parent.element.id + '_';
        var viewName = this.parent.activeViewOptions.cellTemplateName;
        var templateId = scheduleId + viewName + 'cellTemplate';
        var cellTemplate = [].slice.call(this.parent.getCellTemplate()(args, this.parent, 'cellTemplate', templateId, false, undefined, undefined, this.parent.root));
        append(cellTemplate, td);
    };
    TimelineYear.prototype.scrollToDate = function (scrollDate) {
        var date;
        if (this.parent.activeViewOptions.group.resources !== null && this.parent.activeViewOptions.group.resources.length > 0 &&
            !this.parent.uiStateValues.isGroupAdaptive) {
            date = +new Date(util.resetTime(util.firstDateOfMonth(scrollDate)));
        }
        else {
            date = +new Date(util.resetTime(scrollDate));
        }
        var element = this.element.querySelector('[data-date="' + date + '"]');
        if (element) {
            var wrap = this.getScrollableElement();
            if (this.parent.enableRtl) {
                var conTable = this.element.querySelector('.' + cls.CONTENT_TABLE_CLASS);
                wrap.scrollLeft = -(conTable.offsetWidth - element.offsetLeft - element.offsetWidth);
            }
            else {
                wrap.scrollLeft = element.offsetLeft;
            }
            wrap.scrollTop = element.offsetTop;
        }
    };
    TimelineYear.prototype.getScrollableElement = function () {
        if (this.parent.isAdaptive && !this.isTimelineView()) {
            return this.element.querySelector('.' + cls.SCROLL_CONTAINER_CLASS);
        }
        else {
            return this.getContentAreaElement();
        }
    };
    TimelineYear.prototype.wireEvents = function (element) {
        EventHandler.add(element, 'mousedown', this.parent.workCellAction.cellMouseDown, this.parent.workCellAction);
        EventHandler.add(element, 'click', this.parent.workCellAction.cellClick, this.parent.workCellAction);
        if (!this.parent.isAdaptive) {
            EventHandler.add(element, 'dblclick', this.parent.workCellAction.cellDblClick, this.parent.workCellAction);
        }
    };
    return TimelineYear;
}(Year));
export { TimelineYear };

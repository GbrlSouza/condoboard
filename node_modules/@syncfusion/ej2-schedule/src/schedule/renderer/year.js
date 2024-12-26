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
import { EventHandler, formatUnit, createElement, addClass, closest, prepend, append, extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ViewBase } from './view-base';
import { YearEvent } from '../event-renderer/year';
import * as util from '../base/util';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';
/**
 * year view
 */
var Year = /** @class */ (function (_super) {
    __extends(Year, _super);
    function Year(parent) {
        var _this = _super.call(this, parent) || this;
        _this.viewClass = 'e-year-view';
        _this.isInverseTableSelect = false;
        _this.yearEventModule = null;
        return _this;
    }
    Year.prototype.getModuleName = function () {
        return 'year';
    };
    Year.prototype.renderLayout = function (className) {
        if (this.parent.resourceBase) {
            this.parent.resourceBase.generateResourceLevels([{ renderDates: this.parent.activeView.renderDates }]);
        }
        this.setPanel(createElement('div', { className: cls.TABLE_WRAP_CLASS }));
        var viewTypeClass = this.parent.activeViewOptions.orientation === 'Horizontal' ? 'e-horizontal' : 'e-vertical';
        addClass([this.element], [this.viewClass, viewTypeClass, className]);
        this.renderPanel(className);
        if (this.parent.activeViewOptions.allowVirtualScrolling) {
            addClass([this.element], [cls.VIRTUAL_SCROLL_CLASS]);
        }
        var calendarTable = this.createTableLayout(cls.OUTER_TABLE_CLASS);
        this.element.appendChild(calendarTable);
        this.element.querySelector('table').setAttribute('role', 'presentation');
        var calendarTBody = calendarTable.querySelector('tbody');
        this.rowCount = this.getRowColumnCount('row');
        this.columnCount = this.getRowColumnCount('column');
        this.renderHeader(calendarTBody);
        this.renderContent(calendarTBody);
        if (this.parent.currentView !== 'Year' && this.parent.uiStateValues.isGroupAdaptive) {
            this.generateColumnLevels();
            this.renderResourceMobileLayout();
        }
        EventHandler.add(this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS), 'scroll', this.onContentScroll, this);
        this.parent.notify(event.contentReady, {});
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Year.prototype.renderHeader = function (headerWrapper) { };
    Year.prototype.renderContent = function (content) {
        var tr = createElement('tr');
        content.appendChild(tr);
        var td = createElement('td');
        tr.appendChild(td);
        this.element.querySelector('tbody').appendChild(tr);
        var contentWrapper = createElement('div', { className: cls.CONTENT_WRAP_CLASS });
        td.appendChild(contentWrapper);
        var calendarTable = this.createTableLayout('e-calendar-table');
        contentWrapper.appendChild(calendarTable);
        var cTr = createElement('tr');
        calendarTable.querySelector('tbody').appendChild(cTr);
        var cTd = createElement('td');
        cTr.appendChild(cTd);
        var calendarWrapper = createElement('div', { className: 'e-calendar-wrapper' });
        cTd.appendChild(calendarWrapper);
        var months = this.getMonths();
        for (var _i = 0, months_1 = months; _i < months_1.length; _i++) {
            var month = months_1[_i];
            var currentMonth = new Date(this.parent.selectedDate.getFullYear(), month, 1);
            var calendarElement = createElement('div', {
                className: 'e-month-calendar e-calendar',
                attrs: { 'data-role': 'calendar' }
            });
            calendarElement.appendChild(this.renderCalendarHeader(currentMonth));
            calendarElement.appendChild(this.renderCalendarContent(currentMonth));
            calendarWrapper.appendChild(calendarElement);
        }
        this.renderDates.splice(0, 1);
    };
    Year.prototype.renderCalendarHeader = function (currentDate) {
        var headerWrapper = createElement('div', { className: 'e-header e-month' });
        var headerContent = createElement('div', { className: 'e-day e-title' });
        if (this.parent.activeViewOptions.monthHeaderTemplate) {
            var args = { date: currentDate, type: 'monthHeader' };
            this.renderTemplates(this.parent.getMonthHeaderTemplate(), args, 'monthHeaderTemplate', this.parent.activeViewOptions.monthHeaderTemplateName, headerContent);
        }
        else {
            headerContent.innerHTML = this.getMonthName(currentDate);
        }
        headerWrapper.appendChild(headerContent);
        this.parent.trigger(event.renderCell, { elementType: 'headerCells', element: headerContent, date: currentDate });
        return headerWrapper;
    };
    Year.prototype.renderCalendarContent = function (currentDate) {
        var dateCollection = this.getMonthDates(currentDate);
        var contentWrapper = createElement('div', { className: 'e-content e-month' });
        var contentTable = this.createTableLayout('e-calendar-table ' + cls.CONTENT_TABLE_CLASS);
        contentWrapper.appendChild(contentTable);
        this.setAriaAttributes(contentTable);
        var thead = createElement('thead', { className: 'e-week-header' });
        var tr = createElement('tr');
        var currentWeek = util.getWeekFirstDate(util.firstDateOfMonth(currentDate), this.parent.activeViewOptions.firstDayOfWeek);
        if (this.parent.activeViewOptions.showWeekNumber) {
            tr.appendChild(createElement('th'));
        }
        for (var i = 0; i < util.WEEK_LENGTH; i++) {
            if (this.parent.activeViewOptions.dayHeaderTemplate) {
                var th = createElement('th');
                var args = { date: currentWeek, type: 'dayHeader' };
                this.renderTemplates(this.parent.getDayHeaderTemplate(), args, 'dayHeaderTemplate', this.parent.activeViewOptions.dayHeaderTemplateName, th);
                tr.appendChild(th);
            }
            else {
                tr.appendChild(createElement('th', { innerHTML: this.parent.getDayNames('narrow')[currentWeek.getDay()] }));
            }
            var nextDay = new Date(currentWeek.getTime() + util.MS_PER_DAY);
            currentWeek = nextDay.getDate() === currentWeek.getDate() ? util.addDays(nextDay, 1) : nextDay;
        }
        thead.appendChild(tr);
        prepend([thead], contentTable);
        var tbody = contentTable.querySelector('tbody');
        while (dateCollection.length > 0) {
            var weekDates = dateCollection.splice(0, util.WEEK_LENGTH);
            var tr_1 = createElement('tr');
            if (this.parent.activeViewOptions.showWeekNumber) {
                var weekNumber = this.parent.getWeekNumberContent(weekDates);
                var td = createElement('td', {
                    className: 'e-week-number',
                    attrs: { 'title': this.parent.localeObj.getConstant('week') + ' ' + weekNumber },
                    innerHTML: weekNumber
                });
                tr_1.appendChild(td);
                this.parent.trigger(event.renderCell, { elementType: 'weekNumberCells', element: td });
            }
            for (var _i = 0, weekDates_1 = weekDates; _i < weekDates_1.length; _i++) {
                var date = weekDates_1[_i];
                var td = createElement('td', {
                    className: 'e-cell ' + cls.WORK_CELLS_CLASS,
                    attrs: { 'data-date': date.getTime().toString() }
                });
                if (this.parent.activeViewOptions.cellHeaderTemplate) {
                    var args = { date: date, type: 'monthCells' };
                    this.renderTemplates(this.parent.getCellHeaderTemplate(), args, 'cellHeaderTemplate', this.parent.activeViewOptions.cellHeaderTemplateName, td);
                }
                else {
                    var span = createElement('span', {
                        className: 'e-day', innerHTML: this.parent.globalize.formatDate(date, { skeleton: 'd', calendar: this.parent.getCalendarMode() }),
                        attrs: { title: this.parent.globalize.formatDate(date, { type: 'date', skeleton: 'full' }) }
                    });
                    td.appendChild(span);
                }
                if (this.parent.activeViewOptions.cellTemplate) {
                    var args = { date: date, type: 'monthCells' };
                    this.renderTemplates(this.parent.getCellTemplate(), args, 'cellTemplate', this.parent.activeViewOptions.cellTemplateName, td);
                }
                var classList = [];
                if (currentDate.getMonth() !== date.getMonth()) {
                    classList.push(cls.OTHERMONTH_CLASS);
                    if (td.firstElementChild && !this.parent.activeViewOptions.cellTemplate) {
                        td.firstElementChild.setAttribute('aria-disabled', 'true');
                    }
                }
                if (this.isCurrentDate(date) && currentDate.getMonth() === date.getMonth()) {
                    classList = classList.concat(['e-today', 'e-selected']);
                }
                if (classList.length > 0) {
                    addClass([td], classList);
                }
                tr_1.appendChild(td);
                if (currentDate.getMonth() === date.getMonth()) {
                    this.renderDates.push(new Date(date));
                }
                if (!this.parent.isMinMaxDate(date)) {
                    addClass([td], cls.DISABLE_DATES);
                }
                else {
                    EventHandler.add(td, 'click', this.onCellClick, this);
                    if (!this.parent.isAdaptive) {
                        EventHandler.add(td, 'dblclick', this.parent.workCellAction.cellDblClick, this.parent.workCellAction);
                    }
                }
                this.parent.trigger(event.renderCell, { elementType: 'workCells', element: td, date: date });
            }
            tbody.appendChild(tr_1);
        }
        return contentWrapper;
    };
    Year.prototype.createTableColGroup = function (count) {
        var colGroupEle = createElement('colgroup');
        for (var i = 0; i < count; i++) {
            colGroupEle.appendChild(createElement('col'));
        }
        return colGroupEle;
    };
    Year.prototype.getMonthName = function (date) {
        var month = this.parent.globalize.formatDate(date, {
            format: this.parent.activeViewOptions.dateFormat || 'MMMM y',
            calendar: this.parent.getCalendarMode()
        });
        return util.capitalizeFirstWord(month, 'multiple');
    };
    Year.prototype.generateColumnLevels = function () {
        var colLevels = [];
        var level = this.getDateSlots([this.parent.selectedDate], this.parent.activeViewOptions.workDays);
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            colLevels = this.parent.resourceBase.generateResourceLevels(level);
            if (this.parent.uiStateValues.isGroupAdaptive) {
                var resourceLevel = this.parent.resourceBase.lastResourceLevel[this.parent.uiStateValues.groupIndex];
                colLevels = [this.getDateSlots([this.parent.selectedDate], resourceLevel.workDays)];
            }
        }
        else {
            colLevels.push(level);
        }
        colLevels.pop();
        this.colLevels = colLevels;
        return colLevels;
    };
    // eslint-disable-next-line max-len
    Year.prototype.getDateSlots = function (renderDates, workDays, startHour, endHour) {
        if (startHour === void 0) { startHour = this.parent.workHours.start; }
        if (endHour === void 0) { endHour = this.parent.workHours.end; }
        var dateCol = [{
                date: renderDates[0], type: 'dateHeader', className: [cls.HEADER_CELLS_CLASS], colSpan: 1, workDays: workDays,
                startHour: new Date(+this.parent.globalize.parseDate(startHour, { skeleton: 'Hm' })),
                endHour: new Date(+this.parent.globalize.parseDate(endHour, { skeleton: 'Hm' }))
            }];
        return dateCol;
    };
    Year.prototype.getMonthDates = function (date) {
        var startDate = util.getWeekFirstDate(util.firstDateOfMonth(date), this.parent.activeViewOptions.firstDayOfWeek);
        var endDate = util.addDays(new Date(+startDate), (6 * util.WEEK_LENGTH));
        var dateCollection = [];
        for (var start = startDate; start.getTime() < endDate.getTime(); start = util.addDays(start, 1)) {
            dateCollection.push(util.resetTime(new Date(start)));
        }
        return dateCollection;
    };
    Year.prototype.getRowColumnCount = function (type) {
        var months = this.getMonths();
        var year = this.parent.selectedDate.getFullYear();
        var monthDaysCount = [];
        for (var _i = 0, months_2 = months; _i < months_2.length; _i++) {
            var month = months_2[_i];
            monthDaysCount.push(new Date(year, month, 1).getDay() + new Date(year, month + 1, 0).getDate());
        }
        var maxCount = Math.max.apply(Math, monthDaysCount);
        var count;
        if (type === 'row') {
            count = this.parent.activeViewOptions.orientation === 'Horizontal' ? months.length : maxCount;
        }
        else {
            count = this.parent.activeViewOptions.orientation === 'Horizontal' ? maxCount : months.length;
        }
        return count;
    };
    Year.prototype.isCurrentDate = function (date) {
        return util.resetTime(new Date()).getTime() === util.resetTime(new Date(date.getTime())).getTime();
    };
    Year.prototype.getMonths = function () {
        var _this = this;
        // eslint-disable-next-line prefer-spread
        return Array.apply(null, { length: this.parent.activeViewOptions.monthsCount }).map(function (value, index) {
            return _this.parent.firstMonthOfYear + index;
        });
    };
    Year.prototype.renderTemplates = function (fn, args, tName, vName, ele) {
        var templateId = this.parent.element.id + '_' + vName + tName;
        var template = [].slice.call(fn(args, this.parent, tName, templateId, false, undefined, undefined, this.parent.root));
        append(template, ele);
    };
    Year.prototype.onCellClick = function (e) {
        var target = closest(e.target, '.' + cls.WORK_CELLS_CLASS);
        var startDate = this.parent.getDateFromElement(target);
        this.parent.activeCellsData = this.parent.getCellDetails(target);
        var isPrevious = startDate.getTime() < this.getStartDate().getTime();
        if (isPrevious || startDate.getTime() > this.getEndDate().getTime()) {
            this.parent.changeDate(this.parent.activeView.getNextPreviousDate(isPrevious ? 'Previous' : 'Next'), e);
            var activeDate = this.parent.activeCellsData.startTime.getTime();
            var inRange = activeDate >= this.getStartDate().getTime() && activeDate <= this.getEndDate().getTime();
            var dateAttr = inRange ? activeDate : (isPrevious ? this.getEndDate() : this.getStartDate()).getTime();
            var selectedCell = this.parent.element.querySelector(':not(.' + cls.OTHERMONTH_CLASS + ')[data-date="' + dateAttr + '"]');
            this.parent.selectCell(selectedCell);
            this.parent.activeCellsData = this.parent.getCellDetails(selectedCell);
        }
        else {
            var endDate = util.addDays(new Date(startDate.getTime()), 1);
            var filteredEvents = this.parent.eventBase.filterEvents(startDate, endDate);
            var moreEventArgs = { date: startDate, event: filteredEvents, element: e.target };
            if (target.classList.contains(cls.OTHERMONTH_CLASS)) {
                target = this.parent.element.querySelector(':not(.' + cls.OTHERMONTH_CLASS + ')[data-date="' + target.getAttribute('data-date') + '"]');
            }
            this.parent.activeCellsData = this.parent.getCellDetails(target);
            var args = extend(this.parent.activeCellsData, { cancel: false, event: e, name: 'cellClick' });
            this.parent.trigger(event.cellClick, args);
            this.parent.quickPopup.moreEventClick(moreEventArgs, endDate);
        }
    };
    Year.prototype.onContentScroll = function (e) {
        var target = e.target;
        var headerWrapper = this.getDatesHeaderElement();
        this.parent.notify(event.virtualScroll, e);
        if (headerWrapper) {
            headerWrapper.firstElementChild.scrollLeft = target.scrollLeft;
        }
        var scrollTopSelector = "." + cls.MONTH_HEADER_WRAPPER + ",." + cls.RESOURCE_COLUMN_WRAP_CLASS;
        var scrollTopElement = this.element.querySelector(scrollTopSelector);
        if (scrollTopElement) {
            scrollTopElement.scrollTop = target.scrollTop;
        }
        if (!this.parent.isAdaptive) {
            this.parent.uiStateValues.top = e.target.scrollTop;
        }
        this.parent.uiStateValues.left = e.target.scrollLeft;
        this.setPersistence();
    };
    Year.prototype.onScrollUiUpdate = function (args) {
        var height = this.parent.element.offsetHeight - this.getHeaderBarHeight();
        var headerWrapper = this.element.querySelector('.' + cls.DATE_HEADER_CONTAINER_CLASS);
        if (headerWrapper) {
            height -= headerWrapper.offsetHeight;
        }
        var contentWrapper = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        if (contentWrapper) {
            contentWrapper.style.height = formatUnit(height);
        }
        if (!this.parent.isAdaptive && headerWrapper) {
            var scrollBarWidth = util.getScrollBarWidth();
            if (contentWrapper.offsetWidth - contentWrapper.clientWidth > 0) {
                headerWrapper.firstElementChild.style[args.cssProperties.border] = scrollBarWidth > 0 ? '1px' : '0px';
                headerWrapper.style[args.cssProperties.padding] = scrollBarWidth > 0 ? scrollBarWidth - 1 + 'px' : '0px';
            }
            else {
                headerWrapper.firstElementChild.style[args.cssProperties.border] = '';
                headerWrapper.style[args.cssProperties.padding] = '';
            }
        }
        this.setColWidth(this.getContentAreaElement());
        var leftPanelSelector = "." + cls.MONTH_HEADER_WRAPPER + ",." + cls.RESOURCE_COLUMN_WRAP_CLASS;
        var leftPanelElement = this.element.querySelector(leftPanelSelector);
        if (leftPanelElement) {
            var isYScroll = contentWrapper.scrollWidth > contentWrapper.clientWidth;
            leftPanelElement.style.height = formatUnit(height - (isYScroll ? 17 : 0));
        }
        if (!args.isPreventScrollUpdate) {
            if (this.parent.uiStateValues.isInitial) {
                this.parent.uiStateValues.isInitial = false;
                this.parent.uiStateValues.top = this.parent.uiStateValues.left = 0;
            }
            else {
                if (leftPanelElement) {
                    leftPanelElement.scrollTop = this.parent.uiStateValues.top;
                }
                contentWrapper.scrollTop = this.parent.uiStateValues.top;
                contentWrapper.scrollLeft = this.parent.uiStateValues.left;
            }
        }
        this.retainScrollPosition();
    };
    Year.prototype.getStartDate = function () {
        return new Date(this.parent.selectedDate.getFullYear(), this.parent.firstMonthOfYear % 12, 1);
    };
    Year.prototype.getEndDate = function () {
        return util.addDays(util.addMonths(this.getStartDate(), this.parent.monthsCount), -1);
    };
    Year.prototype.startDate = function () {
        return this.parent.currentView === 'Year' ? util.getWeekFirstDate(this.getStartDate(), this.parent.activeViewOptions.firstDayOfWeek) : this.getStartDate();
    };
    Year.prototype.endDate = function () {
        return this.parent.currentView === 'Year' ? util.addDays(util.getWeekLastDate(this.getEndDate(), this.parent.activeViewOptions.firstDayOfWeek), 1) :
            util.addDays(this.getEndDate(), 1);
    };
    Year.prototype.getEndDateFromStartDate = function (start) {
        var date = new Date(start.getTime());
        if (this.parent.activeViewOptions.group.resources.length > 0 && !this.parent.uiStateValues.isGroupAdaptive) {
            date = util.lastDateOfMonth(date);
        }
        return util.addDays(new Date(date.getTime()), 1);
    };
    Year.prototype.getNextPreviousDate = function (type) {
        return util.addYears(this.parent.selectedDate, ((type === 'Next') ? 1 : -1));
    };
    Year.prototype.getDateRangeText = function (date, dateCollection) {
        if (date === void 0) { date = this.parent.selectedDate; }
        if (dateCollection === void 0) { dateCollection = null; }
        var isDateColAvail = !isNullOrUndefined(dateCollection) && dateCollection.length > 0;
        var startDate = isDateColAvail ? dateCollection[0] : this.getStartDate();
        var endDate = isDateColAvail ? dateCollection[dateCollection.length - 1] : this.getEndDate();
        if (startDate.getFullYear() !== endDate.getFullYear()) {
            return this.parent.globalize.formatDate(startDate, { skeleton: 'yMMM' }) + ' - ' + this.parent.globalize.formatDate(endDate, { skeleton: 'yMMM' });
        }
        else {
            return this.parent.globalize.formatDate(isDateColAvail ? dateCollection[0] : date, { skeleton: 'y' });
        }
    };
    Year.prototype.addEventListener = function () {
        this.parent.on(event.scrollUiUpdate, this.onScrollUiUpdate, this);
        this.parent.on(event.dataReady, this.onDataReady, this);
    };
    Year.prototype.removeEventListener = function () {
        if (this.parent) {
            this.parent.off(event.scrollUiUpdate, this.onScrollUiUpdate);
            this.parent.off(event.dataReady, this.onDataReady);
        }
    };
    Year.prototype.onDataReady = function (args) {
        this.yearEventModule = new YearEvent(this.parent);
        this.yearEventModule.renderAppointments();
        this.parent.notify(event.eventsLoaded, args);
    };
    Year.prototype.scrollToDate = function (scrollDate) {
        var date = +new Date(util.resetTime(scrollDate));
        var element = this.element.querySelector('.' + cls.WORK_CELLS_CLASS + ':not(.' + cls.OTHERMONTH_CLASS + ')[data-date="' + date + '"]');
        if (element) {
            element = closest(element, '.e-month-calendar');
            this.getContentAreaElement().scrollTop = element.offsetTop;
        }
    };
    Year.prototype.destroy = function () {
        if (!this.parent || this.parent && this.parent.isDestroyed) {
            return;
        }
        if (this.element) {
            var contentScroll = this.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
            if (contentScroll) {
                EventHandler.remove(contentScroll, 'scroll', this.onContentScroll);
            }
            if (this.yearEventModule) {
                this.yearEventModule.destroy();
                this.yearEventModule = null;
            }
            if (this.parent.resourceBase) {
                this.parent.resourceBase.destroy();
            }
            _super.prototype.destroy.call(this);
        }
    };
    return Year;
}(ViewBase));
export { Year };

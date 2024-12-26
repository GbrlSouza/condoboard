/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { extend, isNullOrUndefined, createElement, EventHandler, addClass, append, removeClass, remove, closest, classList } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { TreeView } from '@syncfusion/ej2-navigations';
import { Popup } from '@syncfusion/ej2-popups';
import { Data } from '../actions/data';
import * as cls from '../base/css-constant';
import * as events from '../base/constant';
import * as util from '../base/util';
var ResourceBase = /** @class */ (function () {
    function ResourceBase(parent) {
        this.resourceCollection = [];
        this.leftPixel = 25;
        this.resourceDateTree = [];
        this.parent = parent;
    }
    ResourceBase.prototype.renderResourceHeaderIndent = function (tr) {
        var resColTd = createElement('td', { className: cls.RESOURCE_LEFT_TD_CLASS });
        var resColDiv = createElement('div', { className: cls.RESOURCE_TEXT_CLASS });
        if (this.parent.activeViewOptions.headerIndentTemplate) {
            var data = { className: [resColTd.className], type: 'emptyCells' };
            this.parent.renderHeaderIndentTemplate(data, resColTd);
        }
        else {
            resColTd.appendChild(resColDiv);
        }
        var args = { elementType: 'emptyCells', element: resColTd };
        this.parent.trigger(events.renderCell, args);
        tr.appendChild(resColTd);
    };
    ResourceBase.prototype.hideResourceRows = function (tBody) {
        if (this.resourceCollection.length <= 1 || this.parent.virtualScrollModule) {
            return;
        }
        var trCount = this.lastResourceLevel.length;
        for (var i = 0; i < trCount; i++) {
            var resData = this.lastResourceLevel[parseInt(i.toString(), 10)].resourceData;
            var res = this.lastResourceLevel[parseInt(i.toString(), 10)].resource;
            if (resData.ClassName === cls.RESOURCE_PARENT_CLASS && !resData[res.expandedField] &&
                !isNullOrUndefined(resData[res.expandedField])) {
                var trCollection = [].slice.call(tBody.children);
                var slicedCollection = trCollection.slice(i + 1, i + (parseInt(resData.Count, 10) + 1));
                addClass(slicedCollection, cls.HIDDEN_CLASS);
            }
        }
    };
    ResourceBase.prototype.createResourceColumn = function () {
        var resColl = this.resourceCollection;
        var resDiv = createElement('div', { className: cls.RESOURCE_COLUMN_WRAP_CLASS });
        var tbl = this.parent.activeView.createTableLayout(cls.RESOURCE_COLUMN_TABLE_CLASS);
        if (!this.parent.uiStateValues.isGroupAdaptive && this.parent.rowAutoHeight && this.parent.activeView.isTimelineView()
            && this.parent.activeViewOptions.group.resources.length > 0) {
            addClass([tbl], cls.AUTO_HEIGHT);
        }
        var tBody = tbl.querySelector('tbody');
        var resData = this.generateTreeData(true);
        this.countCalculation(resColl.slice(0, -2), resColl.slice(0, -1));
        this.renderedResources = this.lastResourceLevel;
        if (this.parent.virtualScrollModule) {
            var resourceCount = this.parent.virtualScrollModule.getRenderedCount();
            this.setExpandedResources();
            resData = this.expandedResources.slice(0, resourceCount);
            this.renderedResources = resData;
        }
        append(this.getContentRows(resData), tBody);
        this.hideResourceRows(tBody);
        tbl.appendChild(tBody);
        resDiv.appendChild(tbl);
        return resDiv;
    };
    ResourceBase.prototype.setRenderedResources = function () {
        var resColl = this.resourceCollection;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        var temp = this.generateTreeData(true);
        this.countCalculation(resColl.slice(0, -2), resColl.slice(0, -1));
        this.renderedResources = this.lastResourceLevel;
    };
    ResourceBase.prototype.setExpandedResources = function () {
        var resources = [];
        for (var i = 0; i < this.lastResourceLevel.length; i++) {
            var resource = this.lastResourceLevel[parseInt(i.toString(), 10)].resourceData;
            var count = resource.Count;
            resources.push(this.lastResourceLevel[parseInt(i.toString(), 10)]);
            var isExpanded = resource[this.lastResourceLevel[parseInt(i.toString(), 10)].resource.expandedField];
            if (!isNullOrUndefined(isExpanded) && !isExpanded && count > 0) {
                i = i + count;
            }
        }
        this.expandedResources = resources;
    };
    ResourceBase.prototype.getContentRows = function (resData, isVirtualScroll) {
        var resRows = [];
        var left;
        var rIndex;
        var resColl = this.resourceCollection;
        var tr = createElement('tr');
        var td = createElement('td', { attrs: { tabindex: isVirtualScroll ? '-1' : '0' } });
        var existingGroupIndices = this.parent.activeView.getGroupIndices();
        for (var i = 0; i < resData.length; i++) {
            if (existingGroupIndices.length > 0 && existingGroupIndices.indexOf(resData[parseInt(i.toString(), 10)].groupIndex) > -1) {
                continue;
            }
            var ntd = td.cloneNode();
            rIndex = util.findIndexInData(resColl, 'name', resData[parseInt(i.toString(), 10)].resource.name);
            if (rIndex === resColl.length - 1) {
                extend(resData[parseInt(i.toString(), 10)].resourceData, { ClassName: cls.RESOURCE_CHILD_CLASS });
                this.renderedResources[parseInt(i.toString(), 10)].className = [cls.RESOURCE_CHILD_CLASS];
            }
            else {
                extend(resData[parseInt(i.toString(), 10)].resourceData, { ClassName: cls.RESOURCE_PARENT_CLASS });
                this.renderedResources[parseInt(i.toString(), 10)].className = [cls.RESOURCE_PARENT_CLASS];
            }
            left = (rIndex * this.leftPixel) + 'px';
            if (resData[parseInt(i.toString(), 10)].resourceData.ClassName === cls.RESOURCE_PARENT_CLASS
                && !isNullOrUndefined(resData[parseInt(i.toString(), 10)].resourceData.Count) && (resData[parseInt(i.toString(), 10)].resourceData.Count > 0)) {
                var iconClass = void 0;
                if (resData[parseInt(i.toString(), 10)].resourceData[resColl[parseInt(rIndex.toString(), 10)].expandedField] ||
                    isNullOrUndefined(resData[parseInt(i.toString(), 10)].resourceData[resColl[parseInt(rIndex.toString(), 10)].expandedField])) {
                    iconClass = cls.RESOURCE_COLLAPSE_CLASS;
                }
                else {
                    iconClass = cls.RESOURCE_EXPAND_CLASS;
                }
                var iconDiv = createElement('div');
                addClass([iconDiv], [cls.RESOURCE_TREE_ICON_CLASS, iconClass]);
                this.setMargin(iconDiv, left);
                ntd.appendChild(iconDiv);
                if (this.resourceCollection.length > 1) {
                    EventHandler.add(iconDiv, 'click', this.onTreeIconClick, this);
                }
            }
            this.parent.activeView.setResourceHeaderContent(ntd, resData[parseInt(i.toString(), 10)], cls.RESOURCE_TEXT_CLASS);
            ntd.setAttribute('data-group-index', resData[parseInt(i.toString(), 10)].groupIndex.toString());
            ntd.setAttribute('aria-label', resData[parseInt(i.toString(), 10)].resourceData[resData[parseInt(i.toString(), 10)].resource.textField] + ' resource');
            if (!this.parent.activeViewOptions.resourceHeaderTemplate) {
                this.setMargin(ntd.querySelector('.' + cls.RESOURCE_TEXT_CLASS), left);
            }
            var classCollection = [cls.RESOURCE_CELLS_CLASS, resData[parseInt(i.toString(), 10)].resourceData.ClassName];
            addClass([ntd], classCollection);
            var args = { elementType: 'resourceHeader', element: ntd, groupIndex: resData[parseInt(i.toString(), 10)].groupIndex };
            this.parent.trigger(events.renderCell, args);
            var ntr = tr.cloneNode();
            ntr.appendChild(ntd);
            resRows.push(ntr);
        }
        return resRows;
    };
    ResourceBase.prototype.setMargin = function (element, value) {
        if (!this.parent.enableRtl) {
            element.style.marginLeft = value;
        }
        else {
            element.style.marginRight = value;
        }
    };
    ResourceBase.prototype.countCalculation = function (parentCollection, wholeCollection) {
        var collection;
        for (var y = 0; y < parentCollection.length; y++) {
            var data = parentCollection[parentCollection.length - (y + 1)].dataSource;
            for (var x = 0; x < data.length; x++) {
                var totalCount = 0;
                if (this.parent.activeViewOptions.group.byGroupID) {
                    var query = new Query().where(wholeCollection[wholeCollection.length - 1].groupIDField, 'equal', data[parseInt(x.toString(), 10)][parentCollection[parentCollection.length - (y + 1)].idField]);
                    collection = new DataManager(wholeCollection[wholeCollection.length - 1].dataSource).executeLocal(query);
                }
                else {
                    collection = wholeCollection[wholeCollection.length - 1].dataSource;
                }
                for (var z = 0; z < collection.length; z++) {
                    totalCount = totalCount + parseInt(collection[parseInt(z.toString(), 10)].Count, 10);
                }
                totalCount = totalCount + parseInt(data[parseInt(x.toString(), 10)].Count, 10);
                extend(data[parseInt(x.toString(), 10)], { Count: totalCount });
            }
            wholeCollection = wholeCollection.slice(0, -1);
        }
    };
    ResourceBase.prototype.onTreeIconClick = function (e) {
        var _this = this;
        if (this.parent.eventTooltip) {
            this.parent.eventTooltip.close();
        }
        var target = e.target;
        var hide;
        var trElement = closest(target, '.' + cls.RESOURCE_PARENT_CLASS)
            .parentElement;
        var index = parseInt(trElement.children[0].getAttribute('data-group-index'), 10);
        var args = {
            cancel: false, event: e, groupIndex: index,
            requestType: !target.classList.contains(cls.RESOURCE_COLLAPSE_CLASS) ? 'resourceExpand' : 'resourceCollapse'
        };
        this.parent.trigger(events.actionBegin, args, function (actionArgs) {
            if (!actionArgs.cancel) {
                if (target.classList.contains(cls.RESOURCE_COLLAPSE_CLASS)) {
                    classList(target, [cls.RESOURCE_EXPAND_CLASS], [cls.RESOURCE_COLLAPSE_CLASS]);
                    hide = true;
                }
                else {
                    classList(target, [cls.RESOURCE_COLLAPSE_CLASS], [cls.RESOURCE_EXPAND_CLASS]);
                    hide = false;
                }
                var eventElements = [].slice.call(_this.parent.element.querySelectorAll('.' + cls.APPOINTMENT_CLASS + ',.' + cls.MORE_INDICATOR_CLASS));
                for (var _i = 0, eventElements_1 = eventElements; _i < eventElements_1.length; _i++) {
                    var element = eventElements_1[_i];
                    remove(element);
                }
                if (_this.parent.virtualScrollModule) {
                    _this.updateVirtualContent(index, hide, e, target);
                }
                else {
                    _this.updateContent(index, hide);
                }
                var data = { cssProperties: _this.parent.getCssProperties(), module: 'scroll' };
                _this.parent.notify(events.scrollUiUpdate, data);
                args = {
                    cancel: false, event: e, groupIndex: index,
                    requestType: target.classList.contains(cls.RESOURCE_COLLAPSE_CLASS) ? 'resourceExpanded' : 'resourceCollapsed'
                };
                _this.parent.refreshEvents(false);
                _this.parent.trigger(events.actionComplete, args);
            }
        });
    };
    ResourceBase.prototype.updateContent = function (index, hide) {
        var rowCollection = [];
        var workCellCollection = [];
        var headerRowCollection = [];
        var pNode;
        var clickedRes = this.lastResourceLevel[parseInt(index.toString(), 10)].resourceData;
        var resRows = [].slice.call(this.parent.element.querySelectorAll('.' + cls.RESOURCE_COLUMN_WRAP_CLASS + ' ' + 'tr'));
        var contentRows = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CONTENT_WRAP_CLASS + ' ' + 'tbody tr'));
        var eventRows = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CONTENT_WRAP_CLASS + ' .' + cls.APPOINTMENT_CONTAINER_CLASS));
        for (var j = 0; j < clickedRes.Count; j++) {
            rowCollection.push(resRows[index + j + 1]);
            workCellCollection.push(contentRows[index + j + 1]);
            headerRowCollection.push(eventRows[index + j + 1]);
        }
        var clonedCollection = this.lastResourceLevel;
        for (var i = 0; i < rowCollection.length; i++) {
            var expanded = true;
            pNode = rowCollection[parseInt(i.toString(), 10)].children[0].classList.contains(cls.RESOURCE_PARENT_CLASS);
            clonedCollection[parseInt(index.toString(), 10)].resourceData[clonedCollection[parseInt(index.toString(), 10)].resource.expandedField] = !hide;
            if (hide) {
                if (pNode) {
                    var trElem = rowCollection[parseInt(i.toString(), 10)].querySelector('.' + cls.RESOURCE_TREE_ICON_CLASS);
                    if (trElem) {
                        classList(trElem, [cls.RESOURCE_EXPAND_CLASS], [cls.RESOURCE_COLLAPSE_CLASS]);
                    }
                }
                if (!rowCollection[parseInt(i.toString(), 10)].classList.contains(cls.HIDDEN_CLASS)) {
                    addClass([rowCollection[parseInt(i.toString(), 10)], workCellCollection[parseInt(i.toString(), 10)], headerRowCollection[parseInt(i.toString(), 10)]], cls.HIDDEN_CLASS);
                }
            }
            else {
                if (pNode) {
                    var rowIndex = rowCollection[parseInt(i.toString(), 10)].rowIndex;
                    if (!clonedCollection[parseInt(rowIndex.toString(), 10)].resourceData[clonedCollection[parseInt(rowIndex.toString(), 10)].resource.expandedField]
                        && !isNullOrUndefined(clonedCollection[parseInt(rowIndex.toString(), 10)].resourceData[clonedCollection[parseInt(rowIndex.toString(), 10)].resource.expandedField])) {
                        rowCollection.splice(i + 1, (parseInt(clonedCollection[parseInt(rowIndex.toString(), 10)].resourceData.Count, 10)));
                        workCellCollection.splice(i + 1, (parseInt(clonedCollection[parseInt(rowIndex.toString(), 10)].resourceData.Count, 10)));
                        headerRowCollection.splice(i + 1, (parseInt(clonedCollection[parseInt(rowIndex.toString(), 10)].resourceData.Count, 10)));
                        expanded = false;
                    }
                    if (expanded) {
                        var trElem = rowCollection[parseInt(i.toString(), 10)].querySelector('.' + cls.RESOURCE_TREE_ICON_CLASS);
                        if (trElem) {
                            classList(trElem, [cls.RESOURCE_COLLAPSE_CLASS], [cls.RESOURCE_EXPAND_CLASS]);
                        }
                    }
                }
                if (rowCollection[parseInt(i.toString(), 10)].classList.contains(cls.HIDDEN_CLASS)) {
                    removeClass([rowCollection[parseInt(i.toString(), 10)], workCellCollection[parseInt(i.toString(), 10)], headerRowCollection[parseInt(i.toString(), 10)]], cls.HIDDEN_CLASS);
                }
            }
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ResourceBase.prototype.updateVirtualContent = function (index, expand, e, target) {
        this.lastResourceLevel[parseInt(index.toString(), 10)].resourceData[this.lastResourceLevel[parseInt(index.toString(), 10)].resource.expandedField] = !expand;
        this.setExpandedResources();
        var resourceCount = this.parent.virtualScrollModule.getRenderedCount();
        var startIndex = this.expandedResources.indexOf(this.renderedResources[0]);
        this.parent.virtualScrollModule.existingDataCollection = this.renderedResources;
        this.renderedResources = this.expandedResources.slice(startIndex, startIndex + resourceCount);
        if (this.renderedResources.length < resourceCount) {
            var sIndex = this.expandedResources.length - resourceCount;
            sIndex = (sIndex > 0) ? sIndex : 0;
            this.renderedResources = this.expandedResources.slice(sIndex, this.expandedResources.length);
        }
        var virtualTrack = this.parent.element.querySelector('.' + cls.VIRTUAL_TRACK_CLASS);
        this.parent.virtualScrollModule.updateVirtualTrackHeight(virtualTrack);
        var resTable = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS + ' ' + 'table');
        var contentTable = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' ' + 'table');
        var eventTable = this.parent.element.querySelector('.' + cls.EVENT_TABLE_CLASS);
        this.parent.virtualScrollModule.updateContent(resTable, contentTable, eventTable, this.renderedResources);
        var timeIndicator = this.parent.element.querySelector('.' + cls.CURRENT_TIMELINE_CLASS);
        if (!isNullOrUndefined(timeIndicator)) {
            timeIndicator.style.height =
                this.parent.element.querySelector('.' + cls.CONTENT_TABLE_CLASS).offsetHeight + 'px';
        }
    };
    ResourceBase.prototype.renderResourceHeader = function () {
        var resourceWrapper = createElement('div', { className: cls.RESOURCE_TOOLBAR_CONTAINER });
        resourceWrapper.innerHTML = '<div class="' + cls.RESOURCE_HEADER_TOOLBAR + '"><div class="' + cls.RESOURCE_MENU + '">' +
            '<div class="e-icons ' + cls.RESOURCE_MENU_ICON + '"></div></div><div class="' + cls.RESOURCE_LEVEL_TITLE + '"></div></div>';
        if (this.parent.currentView === 'MonthAgenda') {
            var target = this.parent.activeView.getPanel().querySelector('.' + cls.CONTENT_WRAP_CLASS);
            target.insertBefore(resourceWrapper, target.querySelector('.' + cls.WRAPPER_CONTAINER_CLASS));
        }
        else {
            this.parent.element.insertBefore(resourceWrapper, this.parent.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS));
        }
        this.renderResourceHeaderText();
        EventHandler.add(resourceWrapper.querySelector('.' + cls.RESOURCE_MENU_ICON), 'click', this.menuClick, this);
    };
    ResourceBase.prototype.renderResourceTree = function () {
        this.popupOverlay = createElement('div', { className: cls.RESOURCE_TREE_POPUP_OVERLAY });
        var treeWrapper = createElement('div', { className: cls.RESOURCE_TREE_POPUP + ' e-popup-close' });
        if (this.parent.currentView === 'MonthAgenda') {
            var target = this.parent.activeView.getPanel().querySelector('.' + cls.WRAPPER_CONTAINER_CLASS);
            target.insertBefore(treeWrapper, target.children[0]);
            target.appendChild(this.popupOverlay);
        }
        else {
            this.parent.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS).appendChild(treeWrapper);
            this.parent.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS).appendChild(this.popupOverlay);
        }
        var resourceTree = createElement('div', { className: cls.RESOURCE_TREE });
        treeWrapper.appendChild(resourceTree);
        this.treeViewObj = new TreeView({
            cssClass: this.parent.cssClass,
            enableRtl: this.parent.enableRtl,
            enableHtmlSanitizer: this.parent.enableHtmlSanitizer,
            fields: {
                dataSource: [].slice.call(this.generateTreeData()),
                id: 'resourceId',
                text: 'resourceName',
                child: 'resourceChild'
            },
            nodeTemplate: this.parent.resourceHeaderTemplate,
            nodeClicked: this.resourceClick.bind(this),
            created: this.resourceTreeCreated.bind(this)
        });
        this.treeViewObj.root = this.parent.root ? this.parent.root : this.parent;
        this.treeViewObj.appendTo(resourceTree);
        this.treeViewObj.expandAll();
        this.treePopup = new Popup(treeWrapper, {
            targetType: 'relative',
            actionOnScroll: 'none',
            content: this.treeViewObj.element,
            relateTo: this.parent.element.querySelector('.' + cls.TABLE_CONTAINER_CLASS),
            enableRtl: this.parent.enableRtl,
            hideAnimation: { name: 'SlideLeftOut', duration: 500 },
            showAnimation: { name: 'SlideLeftIn', duration: 500 },
            viewPortElement: this.parent.element.querySelector('.' + (this.parent.currentView === 'MonthAgenda' ?
                cls.WRAPPER_CONTAINER_CLASS : cls.TABLE_CONTAINER_CLASS))
        });
        this.parent.on(events.documentClick, this.documentClick, this);
    };
    ResourceBase.prototype.resourceTreeCreated = function () {
        if (this.parent.activeViewOptions.resourceHeaderTemplate && this.parent.portals && this.treeViewObj.portals) {
            this.parent.portals = this.parent.portals.concat(this.treeViewObj.portals);
            this.parent.renderTemplates();
        }
    };
    ResourceBase.prototype.generateTreeData = function (isTimeLine) {
        var _this = this;
        var treeCollection = [];
        var resTreeColl = [];
        var groupIndex = 0;
        var _loop_1 = function (i, len) {
            var treeHandler = function (treeLevel, index, levelId) {
                var resource = _this.resourceCollection[parseInt(index.toString(), 10)];
                var treeArgs;
                var resObj;
                if (!isTimeLine) {
                    treeArgs = {
                        resourceId: levelId,
                        resourceName: treeLevel.resourceData[resource.textField],
                        resource: treeLevel.resource,
                        resourceData: treeLevel.resourceData
                    };
                }
                else {
                    resObj = {
                        type: 'resourceHeader', resource: treeLevel.resource,
                        resourceData: treeLevel.resourceData, groupIndex: groupIndex,
                        groupOrder: treeLevel.groupOrder
                    };
                    resTreeColl.push(resObj);
                    groupIndex++;
                }
                if (treeLevel.child.length > 0 && !isTimeLine) {
                    treeArgs.resourceChild = [];
                }
                var count = 1;
                for (var _i = 0, _a = treeLevel.child; _i < _a.length; _i++) {
                    var tree = _a[_i];
                    if (!isTimeLine) {
                        treeArgs.resourceChild.push(treeHandler(tree, index + 1, levelId + '-' + count));
                    }
                    else {
                        treeHandler(tree, index + 1, levelId + '-' + count);
                    }
                    count += 1;
                }
                if (isTimeLine) {
                    extend(resObj.resourceData, { Count: count - 1 });
                }
                return treeArgs;
            };
            if (!isTimeLine) {
                treeCollection.push(treeHandler(this_1.resourceTreeLevel[parseInt(i.toString(), 10)], 0, (i + 1).toString()));
            }
            else {
                treeHandler(this_1.resourceTreeLevel[parseInt(i.toString(), 10)], 0, (i + 1).toString());
            }
        };
        var this_1 = this;
        for (var i = 0, len = this.resourceTreeLevel.length; i < len; i++) {
            _loop_1(i, len);
        }
        if (isTimeLine) {
            this.lastResourceLevel = resTreeColl;
            return resTreeColl;
        }
        else {
            return treeCollection;
        }
    };
    ResourceBase.prototype.renderResourceHeaderText = function () {
        var resource = this.lastResourceLevel[this.parent.uiStateValues.groupIndex];
        var headerCollection = [];
        var _loop_2 = function (i, len) {
            var resourceLevel = this_2.resourceCollection[parseInt(i.toString(), 10)];
            var resourceText = resourceLevel.dataSource.filter(function (resData) {
                return resData[resourceLevel.idField] === resource.groupOrder[parseInt(i.toString(), 10)];
            });
            var resourceName = createElement('div', { className: cls.RESOURCE_NAME });
            this_2.parent.sanitize(resourceText[0][resourceLevel.textField], resourceName);
            headerCollection.push(resourceName);
            var levelIcon = createElement('div', { className: 'e-icons e-icon-next' });
            headerCollection.push(levelIcon);
        };
        var this_2 = this;
        for (var i = 0, len = resource.groupOrder.length; i < len; i++) {
            _loop_2(i, len);
        }
        headerCollection.pop();
        var target = (this.parent.currentView === 'MonthAgenda') ? this.parent.activeView.getPanel() : this.parent.element;
        var headerWrapper = target.querySelector('.' + cls.RESOURCE_LEVEL_TITLE);
        util.removeChildren(headerWrapper);
        for (var _i = 0, headerCollection_1 = headerCollection; _i < headerCollection_1.length; _i++) {
            var header = headerCollection_1[_i];
            headerWrapper.appendChild(header);
        }
        if (this.lastResourceLevel.length === 1) {
            addClass([this.parent.element.querySelector('.' + cls.RESOURCE_MENU)], cls.DISABLE_CLASS);
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ResourceBase.prototype.menuClick = function (event) {
        if (this.parent.element.querySelector('.' + cls.RESOURCE_TREE_POPUP).classList.contains(cls.POPUP_OPEN)) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], cls.ENABLE_CLASS);
        }
        else {
            var treeNodes = [].slice.call(this.treeViewObj.element.querySelectorAll('.e-list-item:not(.e-has-child)'));
            removeClass(treeNodes, 'e-active');
            addClass([treeNodes[this.parent.uiStateValues.groupIndex]], 'e-active');
            this.treePopup.show();
            addClass([this.popupOverlay], cls.ENABLE_CLASS);
        }
    };
    ResourceBase.prototype.selectResourceByIndex = function (groupIndex) {
        if (this.lastResourceLevel && groupIndex > -1 && groupIndex < this.lastResourceLevel.length) {
            this.triggerEvents(groupIndex);
        }
    };
    ResourceBase.prototype.resourceClick = function (event) {
        if (!event.node.classList.contains('e-has-child')) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], cls.ENABLE_CLASS);
            var treeNodes = [].slice.call(this.treeViewObj.element.querySelectorAll('.e-list-item:not(.e-has-child)'));
            var groupIndex = treeNodes.indexOf(event.node);
            this.triggerEvents(groupIndex, event);
            event.event.preventDefault();
        }
    };
    ResourceBase.prototype.triggerEvents = function (groupIndex, event) {
        var _this = this;
        var args = { cancel: false, event: (event) ? event.event : null, groupIndex: groupIndex, requestType: 'resourceChange' };
        this.parent.trigger(events.actionBegin, args, function (actionArgs) {
            if (!actionArgs.cancel) {
                _this.parent.uiStateValues.groupIndex = actionArgs.groupIndex;
                _this.parent.renderModule.render(_this.parent.currentView);
                args = {
                    cancel: false, event: (event) ? event.event : null, groupIndex: _this.parent.uiStateValues.groupIndex, requestType: 'resourceChanged'
                };
                _this.parent.adaptiveGroupIndex = _this.parent.uiStateValues.groupIndex;
                _this.parent.trigger(events.actionComplete, args);
            }
        });
    };
    ResourceBase.prototype.documentClick = function (args) {
        if (closest(args.event.target, '.' + cls.RESOURCE_TREE_POPUP)) {
            return;
        }
        var treeWrapper = this.parent.element.querySelector('.' + cls.RESOURCE_TREE_POPUP);
        if (treeWrapper && treeWrapper.classList.contains(cls.POPUP_OPEN)) {
            this.treePopup.hide();
            removeClass([this.popupOverlay], cls.ENABLE_CLASS);
        }
    };
    ResourceBase.prototype.bindResourcesData = function (isSetModel) {
        var _this = this;
        this.parent.showSpinner();
        var promises = [];
        for (var _i = 0, _a = this.parent.resources; _i < _a.length; _i++) {
            var resource = _a[_i];
            var dataModule = new Data(this.parent, resource.dataSource, resource.query);
            promises.push(dataModule.getData(dataModule.generateQuery()));
        }
        Promise.all(promises).then(function (e) { return _this.dataManagerSuccess(e, isSetModel); })
            .catch(function (e) { return _this.parent.crudModule.dataManagerFailure(e); });
    };
    ResourceBase.prototype.dataManagerSuccess = function (e, isSetModel) {
        if (!this.parent || this.parent && this.parent.isDestroyed) {
            return;
        }
        this.parent.resourceCollection = [];
        for (var i = 0, length_1 = e.length; i < length_1; i++) {
            var resource = this.parent.resources[parseInt(i.toString(), 10)];
            var resourceObj = this.getResourceModel(resource, e[parseInt(i.toString(), 10)].result);
            this.parent.resourceCollection.push(resourceObj);
        }
        this.refreshLayout(isSetModel);
    };
    ResourceBase.prototype.getResourceModel = function (resource, resourceData) {
        var resourceObj = {
            field: resource.field,
            title: resource.title,
            name: resource.name,
            allowMultiple: resource.allowMultiple,
            dataSource: resourceData || resource.dataSource,
            idField: resource.idField,
            textField: resource.textField,
            groupIDField: resource.groupIDField,
            colorField: resource.colorField,
            startHourField: resource.startHourField,
            endHourField: resource.endHourField,
            workDaysField: resource.workDaysField,
            expandedField: resource.expandedField,
            cssClassField: resource.cssClassField
        };
        return resourceObj;
    };
    ResourceBase.prototype.refreshLayout = function (isSetModel) {
        if (isNullOrUndefined(this.parent.uiStateValues.groupIndex) || !(this.parent.enablePersistence)) {
            this.parent.uiStateValues.groupIndex = 0;
        }
        this.parent.renderElements(isSetModel);
    };
    ResourceBase.prototype.setResourceCollection = function () {
        var requiredResources = [];
        this.resourceCollection = [];
        this.colorIndex = null;
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            for (var _i = 0, _a = this.parent.activeViewOptions.group.resources; _i < _a.length; _i++) {
                var resource = _a[_i];
                var index_1 = util.findIndexInData(this.parent.resourceCollection, 'name', resource);
                if (index_1 >= 0) {
                    requiredResources.push(this.parent.resourceCollection[parseInt(index_1.toString(), 10)]);
                }
            }
        }
        else if (this.parent.resourceCollection.length > 0) {
            requiredResources = this.parent.resourceCollection;
        }
        var index = 0;
        for (var _b = 0, requiredResources_1 = requiredResources; _b < requiredResources_1.length; _b++) {
            var resource = requiredResources_1[_b];
            var resources = this.getResourceModel(resource);
            if (resource.name === this.parent.eventSettings.resourceColorField) {
                this.colorIndex = index;
            }
            index++;
            this.resourceCollection.push(resources);
        }
        if (isNullOrUndefined(this.colorIndex)) {
            this.colorIndex = this.resourceCollection.length - 1;
        }
    };
    ResourceBase.prototype.generateResourceLevels = function (innerDates, isTimeLine) {
        var _this = this;
        var resources = this.resourceCollection;
        var resTreeGroup = [];
        var lastColumnDates = [];
        var group = function (resources, index, prevResource, prevResourceData, prevOrder) {
            var resTree = [];
            var resource = resources[0];
            if (resource) {
                var data = void 0;
                if (prevResourceData && _this.parent.activeViewOptions.group.byGroupID) {
                    var id_1 = prevResourceData[prevResource.idField];
                    data = resource.dataSource.filter(function (e) {
                        return e[resource.groupIDField] === id_1;
                    });
                }
                else {
                    data = resource.dataSource;
                }
                for (var i = 0; i < data.length; i++) {
                    var groupOrder = [];
                    if (prevOrder && prevOrder.length > 0) {
                        groupOrder = groupOrder.concat(prevOrder);
                    }
                    groupOrder.push(data[parseInt(i.toString(), 10)][resource.idField]);
                    var items = group(resources.slice(1), index + 1, resource, data[parseInt(i.toString(), 10)], groupOrder);
                    // Here validate child item empty top level resource only
                    if (index === 0 && items.length === 0 && _this.resourceCollection.length > 1) {
                        continue;
                    }
                    var dateCol = [];
                    var renderDates = _this.parent.activeView.renderDates;
                    var resWorkDays = void 0;
                    if (!_this.parent.activeViewOptions.group.byDate && index + 1 === _this.resourceCollection.length) {
                        var workDays = data[parseInt(i.toString(), 10)][resource.workDaysField];
                        var resStartHour = data[parseInt(i.toString(), 10)][resource.startHourField];
                        var resEndHour = data[parseInt(i.toString(), 10)][resource.endHourField];
                        if (workDays && workDays.length > 0) {
                            renderDates = _this.parent.activeView.getRenderDates(workDays);
                            resWorkDays = workDays;
                            dateCol = _this.parent.activeView.getDateSlots(renderDates, workDays);
                        }
                        else {
                            resWorkDays = _this.parent.activeViewOptions.workDays;
                            dateCol = innerDates;
                        }
                        var dateSlots = _this.generateCustomHours(dateCol, resStartHour, resEndHour, groupOrder);
                        lastColumnDates = lastColumnDates.concat(dateSlots);
                    }
                    var resCssClass = data[parseInt(i.toString(), 10)][resource.cssClassField];
                    var slotData = {
                        type: 'resourceHeader', className: ['e-resource-cells'],
                        resourceLevelIndex: index, groupOrder: groupOrder,
                        resource: resource, resourceData: data[parseInt(i.toString(), 10)],
                        colSpan: _this.parent.activeViewOptions.group.byDate ? 1 : dateCol.length,
                        renderDates: renderDates, workDays: resWorkDays, cssClass: resCssClass,
                        child: items
                    };
                    resTree.push(slotData);
                }
                if (!resTreeGroup[parseInt(index.toString(), 10)]) {
                    resTreeGroup[parseInt(index.toString(), 10)] = [];
                }
                if (resTree.length > 0) {
                    resTreeGroup[parseInt(index.toString(), 10)].push(resTree);
                }
                return resTree;
            }
            return [];
        };
        this.resourceTreeLevel = group(resources, 0);
        return (isTimeLine) ? [] : this.generateHeaderLevels(resTreeGroup, lastColumnDates, innerDates);
    };
    ResourceBase.prototype.generateCustomHours = function (renderDates, startHour, endHour, groupOrder) {
        var dateSlots = extend([], renderDates, null, true);
        for (var _i = 0, dateSlots_1 = dateSlots; _i < dateSlots_1.length; _i++) {
            var dateSlot = dateSlots_1[_i];
            if (startHour) {
                dateSlot.startHour = this.parent.getStartEndTime(startHour);
            }
            if (endHour) {
                dateSlot.endHour = this.parent.getStartEndTime(endHour);
            }
            if (groupOrder) {
                dateSlot.groupOrder = groupOrder;
            }
        }
        return dateSlots;
    };
    ResourceBase.prototype.generateHeaderLevels = function (resTreeGroup, lastColumnDates, headerDates) {
        var headerLevels = [];
        for (var i = resTreeGroup.length - 1; i >= 0; i--) {
            var temp = 0;
            for (var _i = 0, _a = resTreeGroup[parseInt(i.toString(), 10)]; _i < _a.length; _i++) {
                var currentLevelChilds = _a[_i];
                for (var _b = 0, currentLevelChilds_1 = currentLevelChilds; _b < currentLevelChilds_1.length; _b++) {
                    var currentLevelChild = currentLevelChilds_1[_b];
                    if (resTreeGroup[i + 1] && resTreeGroup[i + 1].length > 0) {
                        var nextLevelChilds = resTreeGroup[parseInt((i + 1).toString(), 10)][parseInt(temp.toString(), 10)];
                        if (!nextLevelChilds) {
                            continue;
                        }
                        var colSpan = 0;
                        for (var _c = 0, nextLevelChilds_1 = nextLevelChilds; _c < nextLevelChilds_1.length; _c++) {
                            var nextLevelChild = nextLevelChilds_1[_c];
                            if (!this.parent.activeViewOptions.group.byGroupID || (this.parent.activeViewOptions.group.byGroupID &&
                                nextLevelChild.resourceData[nextLevelChild.resource.groupIDField] ===
                                    currentLevelChild.resourceData[currentLevelChild.resource.idField])) {
                                colSpan += nextLevelChild.colSpan;
                            }
                        }
                        currentLevelChild.colSpan = colSpan;
                    }
                    currentLevelChild.groupIndex = temp;
                    temp++;
                    headerLevels[currentLevelChild.resourceLevelIndex] = headerLevels[currentLevelChild.resourceLevelIndex] || [];
                    headerLevels[currentLevelChild.resourceLevelIndex].push(currentLevelChild);
                }
            }
        }
        this.lastResourceLevel = headerLevels.slice(-1)[0] || [];
        if (!this.parent.activeViewOptions.group.byDate) {
            var index = 0;
            for (var _d = 0, _e = this.lastResourceLevel; _d < _e.length; _d++) {
                var lastLevelResource = _e[_d];
                for (var i = 0; i < lastLevelResource.colSpan; i++) {
                    lastColumnDates[parseInt(index.toString(), 10)].groupIndex = lastLevelResource.groupIndex;
                    index++;
                }
            }
            headerLevels.push(lastColumnDates);
            return headerLevels;
        }
        var dateHeaderLevels = [];
        var levels = extend([], headerLevels, null, true);
        var datesColumn = [];
        if (this.parent.activeViewOptions.group.hideNonWorkingDays) {
            var renderDates_1 = [];
            var dateIndex = 0;
            var _loop_3 = function (headerDate) {
                this_3.resourceDateTree[parseInt(dateIndex.toString(), 10)] = [];
                var currentDateLevels = [];
                var _loop_4 = function (j) {
                    var workDays = this_3.lastResourceLevel[parseInt(j.toString(), 10)].resourceData[this_3.lastResourceLevel[parseInt(j.toString(), 10)].resource.workDaysField];
                    if (!workDays) {
                        workDays = this_3.parent.activeViewOptions.workDays;
                    }
                    if (workDays.indexOf(headerDate.date.getDay()) !== -1) {
                        var resTd_1 = extend({}, this_3.lastResourceLevel[parseInt(j.toString(), 10)], null, true);
                        resTd_1.date = headerDate.date;
                        this_3.lastResourceLevel[parseInt(j.toString(), 10)].workDays = workDays;
                        resTd_1.startHour = this_3.parent.getStartEndTime(resTd_1.resourceData[resTd_1.resource.startHourField]) ||
                            headerDate.startHour;
                        resTd_1.endHour = this_3.parent.getStartEndTime(resTd_1.resourceData[resTd_1.resource.endHourField]) ||
                            headerDate.endHour;
                        this_3.resourceDateTree[parseInt(dateIndex.toString(), 10)].push(resTd_1);
                        var _loop_5 = function (k) {
                            if (!currentDateLevels[parseInt(k.toString(), 10)]) {
                                currentDateLevels[parseInt(k.toString(), 10)] = [];
                            }
                            if (k === resTd_1.groupOrder.length - 1) {
                                if (!renderDates_1[parseInt(j.toString(), 10)]) {
                                    renderDates_1[parseInt(j.toString(), 10)] = [];
                                }
                                var filterDates = resTd_1.renderDates.filter(function (x) { return x.getDay() === headerDate.date.getDay(); });
                                renderDates_1[parseInt(j.toString(), 10)] = renderDates_1[parseInt(j.toString(), 10)].concat(filterDates);
                                currentDateLevels[parseInt(k.toString(), 10)].push(resTd_1);
                                return "continue";
                            }
                            var currentLevel = levels[parseInt(k.toString(), 10)];
                            var filteredResource = currentLevel.filter(function (data) {
                                return data.resourceData[data.resource.idField] === resTd_1.groupOrder[parseInt(k.toString(), 10)];
                            });
                            if (filteredResource && filteredResource.length > 0) {
                                var existedResource = currentDateLevels[parseInt(k.toString(), 10)].filter(function (data) {
                                    return data.resourceData[data.resource.idField] === resTd_1.groupOrder[parseInt(k.toString(), 10)];
                                });
                                if (existedResource && existedResource.length > 0) {
                                    existedResource[0].colSpan += 1;
                                }
                                else {
                                    var filteredTd = extend({}, filteredResource[0], null, true);
                                    filteredTd.colSpan = 1;
                                    currentDateLevels[parseInt(k.toString(), 10)].push(filteredTd);
                                }
                            }
                        };
                        for (var k = 0; k < resTd_1.groupOrder.length; k++) {
                            _loop_5(k);
                        }
                    }
                };
                for (var j = 0; j < this_3.lastResourceLevel.length; j++) {
                    _loop_4(j);
                }
                if (currentDateLevels.length > 0) {
                    for (var l = 0; l < levels.length; l++) {
                        if (!dateHeaderLevels[parseInt(l.toString(), 10)]) {
                            dateHeaderLevels[parseInt(l.toString(), 10)] = [];
                        }
                        dateHeaderLevels[parseInt(l.toString(), 10)] = dateHeaderLevels[parseInt(l.toString(), 10)].concat(currentDateLevels[parseInt(l.toString(), 10)]);
                    }
                    headerDate.colSpan = currentDateLevels[currentDateLevels.length - 1].length;
                    datesColumn.push(headerDate);
                }
                dateIndex++;
            };
            var this_3 = this;
            for (var _f = 0, headerDates_1 = headerDates; _f < headerDates_1.length; _f++) {
                var headerDate = headerDates_1[_f];
                _loop_3(headerDate);
            }
            this.resourceDateTree = this.resourceDateTree.filter(function (data) { return data.length > 0; });
            this.lastResourceLevel.forEach(function (x, index) {
                if (renderDates_1[parseInt(index.toString(), 10)]) {
                    x.renderDates = renderDates_1[parseInt(index.toString(), 10)].sort(function (a, b) { return a.getTime() - b.getTime(); });
                }
            });
            dateHeaderLevels.unshift(datesColumn);
            return dateHeaderLevels;
        }
        var dateColSpan = 0;
        for (var _g = 0, _h = levels[0]; _g < _h.length; _g++) {
            var firstRowTd = _h[_g];
            dateColSpan += firstRowTd.colSpan;
        }
        for (var _j = 0, headerDates_2 = headerDates; _j < headerDates_2.length; _j++) {
            var headerDate = headerDates_2[_j];
            headerDate.colSpan = dateColSpan;
            datesColumn.push(headerDate);
            var resGroup = extend([], levels, null, true);
            for (var k = 0, length_2 = resGroup.length; k < length_2; k++) {
                if (k === resGroup.length - 1) {
                    for (var _k = 0, _l = resGroup[parseInt(k.toString(), 10)]; _k < _l.length; _k++) {
                        var resTd = _l[_k];
                        resTd.date = headerDate.date;
                        resTd.workDays = headerDate.workDays;
                        resTd.startHour = this.parent.getStartEndTime(resTd.resourceData[resTd.resource.startHourField]) ||
                            headerDate.startHour;
                        resTd.endHour = this.parent.getStartEndTime(resTd.resourceData[resTd.resource.endHourField]) ||
                            headerDate.endHour;
                    }
                }
                if (!dateHeaderLevels[parseInt(k.toString(), 10)]) {
                    dateHeaderLevels[parseInt(k.toString(), 10)] = [];
                }
                dateHeaderLevels[parseInt(k.toString(), 10)] = dateHeaderLevels[parseInt(k.toString(), 10)].concat(resGroup[parseInt(k.toString(), 10)]);
            }
        }
        dateHeaderLevels.unshift(datesColumn);
        return dateHeaderLevels;
    };
    ResourceBase.prototype.setResourceValues = function (eventObj, groupIndex) {
        var _this = this;
        var setValues = function (index, field, value) {
            if (_this.resourceCollection[parseInt(index.toString(), 10)].allowMultiple && _this.parent.activeViewOptions.group.allowGroupEdit) {
                eventObj["" + field] = [value];
            }
            else {
                eventObj["" + field] = value;
            }
        };
        if (groupIndex === void 0) {
            groupIndex = this.parent.uiStateValues.isGroupAdaptive ? this.parent.uiStateValues.groupIndex :
                this.parent.activeCellsData.groupIndex;
        }
        if (this.parent.activeViewOptions.group.resources.length > 0 && !isNullOrUndefined(groupIndex)) {
            var groupOrder = this.lastResourceLevel[parseInt(groupIndex.toString(), 10)].groupOrder;
            for (var index = 0; index < this.resourceCollection.length; index++) {
                setValues(index, this.resourceCollection[parseInt(index.toString(), 10)].field, groupOrder[parseInt(index.toString(), 10)]);
            }
        }
        else if (this.parent.resourceCollection.length > 0) {
            for (var index = 0; index < this.resourceCollection.length; index++) {
                var data = this.resourceCollection[parseInt(index.toString(), 10)].dataSource[0];
                if (data) {
                    setValues(index, this.resourceCollection[parseInt(index.toString(), 10)].field, data[this.resourceCollection[parseInt(index.toString(), 10)].idField]);
                }
            }
        }
    };
    ResourceBase.prototype.getResourceColor = function (eventObj, groupOrder) {
        var colorFieldIndex = (!isNullOrUndefined(groupOrder) &&
            this.colorIndex > groupOrder.length - 1) ? groupOrder.length - 1 : this.colorIndex;
        var resource = this.resourceCollection[parseInt(colorFieldIndex.toString(), 10)];
        if (isNullOrUndefined(groupOrder) && this.parent.activeViewOptions.group.allowGroupEdit && resource.allowMultiple) {
            return undefined;
        }
        var id = isNullOrUndefined(groupOrder) ? eventObj[resource.field] : groupOrder[parseInt(colorFieldIndex.toString(), 10)];
        var data = this.filterData(resource.dataSource, resource.idField, id);
        if (data.length > 0) {
            return data[0][resource.colorField];
        }
        return undefined;
    };
    ResourceBase.prototype.getCssClass = function (eventObj) {
        var resource = this.resourceCollection.slice(-1)[0];
        if (this.parent.activeViewOptions.group.allowGroupEdit && resource.allowMultiple) {
            return undefined;
        }
        var data = this.filterData(resource.dataSource, resource.idField, eventObj[resource.field]);
        if (data.length > 0) {
            return data[0][resource.cssClassField];
        }
        return undefined;
    };
    ResourceBase.prototype.getResourceRenderDates = function () {
        // eslint-disable-next-line prefer-spread
        var resourceDates = [].concat.apply([], this.lastResourceLevel.map(function (e) { return e.renderDates; }));
        var time = resourceDates.map(function (dateObj) { return dateObj.getTime(); });
        var removeDuplicateDates = function (dateColl) { return dateColl.filter(function (date, index) {
            return time.indexOf(date.getTime()) === index;
        }); };
        var renderDates = removeDuplicateDates(resourceDates);
        renderDates.sort(function (a, b) { return a.getTime() - b.getTime(); });
        return renderDates;
    };
    ResourceBase.prototype.filterData = function (dataSource, field, value) {
        return dataSource.filter(function (data) { return data["" + field] === value; });
    };
    ResourceBase.prototype.getResourceData = function (eventObj, index, groupEditIndex) {
        if (this.parent.activeViewOptions.group.allowGroupEdit) {
            var resourceObj = {};
            for (var _i = 0, groupEditIndex_1 = groupEditIndex; _i < groupEditIndex_1.length; _i++) {
                var groupIndex = groupEditIndex_1[_i];
                var resourceLevel = this.lastResourceLevel[parseInt(groupIndex.toString(), 10)].groupOrder;
                for (var level = 0, length_3 = resourceLevel.length; level < length_3; level++) {
                    var fieldName = this.resourceCollection[parseInt(level.toString(), 10)].field;
                    if (isNullOrUndefined(resourceObj["" + fieldName])) {
                        resourceObj["" + fieldName] = [];
                    }
                    resourceObj["" + fieldName].push(resourceLevel[parseInt(level.toString(), 10)]);
                }
            }
            eventObj = extend(eventObj, resourceObj);
        }
        else {
            for (var level = 0, length_4 = this.resourceCollection.length; level < length_4; level++) {
                if (this.lastResourceLevel[parseInt(index.toString(), 10)]) {
                    eventObj[this.resourceCollection[parseInt(level.toString(), 10)].field] = this.lastResourceLevel[parseInt(index.toString(), 10)].groupOrder[parseInt(level.toString(), 10)];
                }
            }
        }
    };
    ResourceBase.prototype.addResource = function (resources, name, index) {
        var resourceCollection = (resources instanceof Array) ? resources : [resources];
        var _loop_6 = function (resource) {
            if (resource.name === name) {
                resourceCollection.forEach(function (addObj, i) {
                    return new DataManager({ json: resource.dataSource }).insert(addObj, null, null, index + i);
                });
                return "break";
            }
        };
        for (var _i = 0, _a = this.parent.resourceCollection; _i < _a.length; _i++) {
            var resource = _a[_i];
            var state_1 = _loop_6(resource);
            if (state_1 === "break")
                break;
        }
        this.refreshLayout(true);
    };
    ResourceBase.prototype.removeResource = function (resourceId, name) {
        var resourceCollection = (resourceId instanceof Array) ? resourceId : [resourceId];
        var _loop_7 = function (resource) {
            if (resource.name === name) {
                resourceCollection.forEach(function (removeObj) {
                    return new DataManager({ json: resource.dataSource }).remove(resource.idField, removeObj);
                });
                return "break";
            }
        };
        for (var _i = 0, _a = this.parent.resourceCollection; _i < _a.length; _i++) {
            var resource = _a[_i];
            var state_2 = _loop_7(resource);
            if (state_2 === "break")
                break;
        }
        this.refreshLayout(true);
    };
    ResourceBase.prototype.getIndexFromResourceId = function (id, name, resourceData, event, parentField) {
        name = name || this.parent.resourceCollection.slice(-1)[0].name;
        if (isNullOrUndefined(resourceData)) {
            resourceData = this.resourceCollection.filter(function (e) { return e.name === name; })[0];
            if (isNullOrUndefined(resourceData)) {
                return null;
            }
        }
        var resource = resourceData.dataSource.filter(function (e) {
            if (event && e[resourceData.idField] === id) {
                if (e[resourceData.groupIDField] === event["" + parentField]) {
                    return e[resourceData.idField] === id;
                }
                return null;
            }
            else {
                return e[resourceData.idField] === id;
            }
        })[0];
        return (this.lastResourceLevel.map(function (e) { return e.resourceData; }).indexOf(resource));
    };
    ResourceBase.prototype.resourceExpand = function (id, name, hide) {
        var resource = this.parent.resourceCollection.filter(function (e) {
            if (e.name === name) {
                return e;
            }
            return null;
        })[0];
        var index = 0;
        var resourceData = resource.dataSource.filter(function (e) { return e[resource.idField] === id; })[0];
        if (!this.parent.activeViewOptions.group.byGroupID) {
            index = this.getIndexFromResourceId(id, name, resource);
        }
        else {
            index = this.lastResourceLevel.map(function (e) { return e.resourceData; }).indexOf(resourceData);
        }
        var target = this.parent.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS + ' ' + ("[data-group-index=\"" + index + "\"]") +
            ' ' + '.' + cls.RESOURCE_TREE_ICON_CLASS);
        if (target) {
            if (target.classList.contains(cls.RESOURCE_EXPAND_CLASS) && !hide) {
                target.click();
            }
            else if (target.classList.contains(cls.RESOURCE_COLLAPSE_CLASS) && hide) {
                target.click();
            }
        }
    };
    ResourceBase.prototype.resourceScroll = function (id, name) {
        if (this.parent.isAdaptive || ['Agenda', 'MonthAgenda'].indexOf(this.parent.currentView) > -1) {
            return;
        }
        var levelName = name || this.parent.resourceCollection.slice(-1)[0].name;
        var levelIndex = this.parent.resourceCollection.length - 1;
        var resource = this.parent.resourceCollection.filter(function (e, index) {
            if (e.name === levelName) {
                levelIndex = index;
                return e;
            }
            return null;
        })[0];
        var scrollElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
        var index = 0;
        if (this.parent.activeView.isTimelineView()) {
            if (!this.parent.activeViewOptions.group.byGroupID) {
                index = this.getIndexFromResourceId(id, levelName, resource);
            }
            else {
                var resourceData = resource.dataSource.filter(function (e) {
                    return e[resource.idField] === id;
                })[0];
                index = this.lastResourceLevel.map(function (e) { return e.resourceData; }).indexOf(resourceData);
            }
            if (this.parent.virtualScrollModule) {
                var virtual = this.parent.element.querySelector('.' + cls.VIRTUAL_TRACK_CLASS);
                var averageRowHeight = Math.round(virtual.offsetHeight / this.expandedResources.length);
                if (this.parent.rowAutoHeight) {
                    scrollElement.scrollTop = 0;
                    this.parent.virtualScrollModule.virtualScrolling();
                }
                scrollElement.scrollTop = (index * averageRowHeight) - (((this.parent.virtualScrollModule.bufferCount - 1) * averageRowHeight));
                this.parent.virtualScrollModule.virtualScrolling();
                if (this.parent.rowAutoHeight) {
                    var td = this.parent.element.querySelector("." + cls.WORK_CELLS_CLASS + "[data-group-index=\"" + index + "\"]");
                    if (td && !td.parentElement.classList.contains(cls.HIDDEN_CLASS)) {
                        scrollElement.scrollTop =
                            (scrollElement.scrollTop < td.offsetTop) ? td.offsetTop : scrollElement.scrollTop + td.offsetTop;
                    }
                }
                else {
                    scrollElement.scrollTop = (index * averageRowHeight);
                }
            }
            else {
                var td = this.parent.element.querySelector("." + cls.WORK_CELLS_CLASS + "[data-group-index=\"" + index + "\"]");
                if (td && !td.parentElement.classList.contains(cls.HIDDEN_CLASS)) {
                    scrollElement.scrollTop = td.offsetTop;
                }
            }
        }
        else {
            if (!this.parent.activeViewOptions.group.byGroupID) {
                index = this.getIndexFromResourceId(id, levelName, resource);
            }
            else {
                if (levelName === this.parent.resourceCollection.slice(-1)[0].name) {
                    index = this.lastResourceLevel.map(function (e) { return e.resourceData[resource.idField]; }).indexOf(id);
                }
                else {
                    index = resource.dataSource.map(function (e) { return e[resource.idField]; }).indexOf(id);
                }
            }
            var offsetTarget = this.parent.currentView === 'Month' ? this.parent.element.querySelector("." + cls.DATE_HEADER_WRAP_CLASS + " tbody tr:nth-child(" + (levelIndex + 1) + ")")
                : this.parent.element.querySelector("." + cls.HEADER_ROW_CLASS + ":nth-child(" + (levelIndex + 1) + ")");
            var offset = [].slice.call(offsetTarget.children).map(function (node) { return node.offsetLeft; });
            scrollElement.scrollLeft = offset[parseInt(index.toString(), 10)];
        }
    };
    ResourceBase.prototype.destroy = function () {
        this.parent.off(events.documentClick, this.documentClick);
        if (this.treeViewObj) {
            if (this.treeViewObj.portals && this.treeViewObj.portals.length > 0) {
                var treeViewTemplates = this.treeViewObj.portals.map(function (x) { return x.propName; });
                if (treeViewTemplates.length > 0) {
                    this.parent.resetTemplates(treeViewTemplates);
                }
            }
            this.treeViewObj.destroy();
            this.treeViewObj = null;
        }
        if (this.treePopup) {
            this.treePopup.destroy();
            this.treePopup = null;
            remove(this.parent.element.querySelector('.' + cls.RESOURCE_TREE_POPUP));
            remove(this.parent.element.querySelector('.' + cls.RESOURCE_TREE_POPUP_OVERLAY));
        }
        var resToolBarEle = this.parent.element.querySelector('.' + cls.RESOURCE_TOOLBAR_CONTAINER);
        if (resToolBarEle) {
            remove(resToolBarEle);
        }
    };
    return ResourceBase;
}());
export { ResourceBase };

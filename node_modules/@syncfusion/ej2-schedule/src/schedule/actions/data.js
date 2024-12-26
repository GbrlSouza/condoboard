/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query, DataManager, Predicate } from '@syncfusion/ej2-data';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * data module is used to generate query and data source.
 *
 * @private
 */
var Data = /** @class */ (function () {
    /**
     * Constructor for data module
     *
     * @param {Schedule} parent Accepts the schedule element instance
     * @param {Object | DataManager} dataSource Accepts the datasource as JSON objects or DataManager
     * @param {Query} query Accepts the query to process the data
     * @private
     */
    function Data(parent, dataSource, query) {
        this.parent = parent;
        this.initDataManager(dataSource, query);
    }
    /**
     * The function used to initialize dataManager and query
     *
     * @param {Object | DataManager} dataSource Accepts the datasource as JSON objects or DataManager
     * @param {Query} query Accepts the query to process the data
     * @returns {void}
     * @private
     */
    Data.prototype.initDataManager = function (dataSource, query) {
        this.dataManager = dataSource instanceof DataManager ? dataSource : new DataManager(dataSource);
        this.query = query instanceof Query ? query : new Query();
    };
    /**
     * The function used to generate updated Query from schedule model
     *
     * @param {Date} startDate Accepts the start date
     * @param {Date} endDate Accepts the end date
     * @returns {void}
     * @private
     */
    Data.prototype.generateQuery = function (startDate, endDate) {
        var query = this.query.clone();
        if (this.parent && startDate && endDate) {
            if (this.parent.activeViewOptions && this.parent.activeViewOptions.enableLazyLoading &&
                !isNullOrUndefined(this.parent.activeViewOptions.group.resources) &&
                this.parent.activeViewOptions.group.resources.length > 0 && this.parent.resourceBase &&
                this.parent.resourceBase.resourceCollection.length > 0 && this.parent.resourceBase.renderedResources.length > 0) {
                var resIdCollection_1 = [];
                this.parent.resourceBase.resourceCollection.forEach(function () { return resIdCollection_1.push([]); });
                this.parent.resourceBase.renderedResources.forEach(function (resource) {
                    resIdCollection_1.forEach(function (resId, index) {
                        var groupId = resource.groupOrder[parseInt(index.toString(), 10)];
                        if (groupId && resId.indexOf(groupId) < 0) {
                            resId.push(groupId);
                        }
                    });
                });
                this.parent.resourceBase.resourceCollection.forEach(function (resource, index) {
                    query.addParams(resource.field, resIdCollection_1[parseInt(index.toString(), 10)].toString());
                });
            }
            if (this.parent.timezone) {
                startDate = this.parent.tzModule.remove(new Date(+startDate.getTime()), this.parent.timezone);
                endDate = this.parent.tzModule.remove(new Date(+endDate.getTime()), this.parent.timezone);
            }
            if (this.parent.eventSettings.includeFiltersInQuery) {
                var dateQuery = this.getStartEndQuery(startDate, endDate);
                var recurrenceQuery = new Predicate(this.parent.eventFields.recurrenceRule, 'notequal', null).and(new Predicate(this.parent.eventFields.recurrenceRule, 'notequal', ''));
                return query.where(dateQuery.or(recurrenceQuery));
            }
            query.addParams('StartDate', startDate.toISOString());
            query.addParams('EndDate', endDate.toISOString());
        }
        return query;
    };
    /**
     * The function used to generate updated Query from schedule model
     *
     * @param {Date} startDate Accepts the start date
     * @param {Date} endDate Accepts the end date
     * @returns {void}
     * @private
     */
    Data.prototype.getStartEndQuery = function (startDate, endDate) {
        var fieldMapping = this.parent.eventFields;
        var dateQuery = new Predicate(fieldMapping.startTime, 'greaterthanorequal', startDate)
            .and(new Predicate(fieldMapping.endTime, 'greaterthanorequal', startDate))
            .and(new Predicate(fieldMapping.startTime, 'lessthan', endDate))
            .or(new Predicate(fieldMapping.startTime, 'lessthanorequal', startDate)
            .and(new Predicate(fieldMapping.endTime, 'greaterthan', startDate)));
        return dateQuery;
    };
    /**
     * The function used to get dataSource by executing given Query
     *
     * @param  {Query} query - A Query that specifies to generate dataSource
     * @returns {void}
     * @private
     */
    Data.prototype.getData = function (query) {
        return this.dataManager.executeQuery(query);
    };
    /**
     * To destroy the crud module.
     *
     * @returns {void}
     * @private
     */
    Data.prototype.destroy = function () {
        this.dataManager = null;
        this.query = null;
    };
    return Data;
}());
export { Data };

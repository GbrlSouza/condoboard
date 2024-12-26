import { Schedule } from '../base/schedule';
import { ViewBase } from './view-base';
import { IRenderer, TdData, NotifyEventArgs } from '../base/interface';
import { NavigationDirection } from '../base/type';
/**
 * year view
 */
export declare class Year extends ViewBase implements IRenderer {
    viewClass: string;
    isInverseTableSelect: boolean;
    colLevels: TdData[][];
    rowCount: number;
    columnCount: number;
    private yearEventModule;
    constructor(parent: Schedule);
    protected getModuleName(): string;
    renderLayout(className: string): void;
    renderHeader(headerWrapper: HTMLElement): void;
    renderContent(content: HTMLElement): void;
    renderCalendarHeader(currentDate: Date): HTMLElement;
    renderCalendarContent(currentDate: Date): HTMLElement;
    createTableColGroup(count: number): HTMLElement;
    getMonthName(date: Date): string;
    generateColumnLevels(): TdData[][];
    getDateSlots(renderDates: Date[], workDays: number[], startHour?: string, endHour?: string): TdData[];
    getMonthDates(date: Date): Date[];
    getRowColumnCount(type: string): number;
    isCurrentDate(date: Date): boolean;
    getMonths(): number[];
    private renderTemplates;
    private onCellClick;
    onContentScroll(e: Event): void;
    onScrollUiUpdate(args: NotifyEventArgs): void;
    getStartDate(): Date;
    getEndDate(): Date;
    startDate(): Date;
    endDate(): Date;
    getEndDateFromStartDate(start: Date): Date;
    getNextPreviousDate(type: NavigationDirection): Date;
    getDateRangeText(date?: Date, dateCollection?: Date[]): string;
    addEventListener(): void;
    removeEventListener(): void;
    onDataReady(args: NotifyEventArgs): void;
    scrollToDate(scrollDate: Date): void;
    destroy(): void;
}

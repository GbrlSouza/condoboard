import { CalendarView } from '@syncfusion/ej2-calendars';
import { Schedule } from '../base/schedule';
/**
 * Header module
 */
export declare class HeaderRenderer {
    element: HTMLElement;
    private parent;
    private l10n;
    private toolbarObj;
    private headerPopup;
    private headerCalendar;
    constructor(parent: Schedule);
    addEventListener(): void;
    removeEventListener(): void;
    private closeHeaderPopup;
    hideHeaderPopup(): void;
    renderHeader(): void;
    private renderToolbar;
    updateItems(): void;
    getPopUpRelativeElement(): HTMLElement;
    setDayOfWeek(index: number): void;
    setCalendarDate(date: Date): void;
    setCalendarMinMaxDate(): void;
    getCalendarView(): CalendarView;
    setCalendarView(): void;
    updateActiveView(): void;
    updateDateRange(date?: Date): void;
    refresh(): void;
    updateAddIcon(): void;
    private getDateRangeText;
    private getItemModel;
    private getToolbarItems;
    private getItems;
    private getItemObject;
    private renderHeaderPopup;
    private calendarChange;
    setCalendarTimezone(): void;
    private calculateViewIndex;
    private toolbarCreateHandler;
    private toolbarClickHandler;
    private hasSelectedDate;
    getHeaderElement(): HTMLElement;
    updateHeaderItems(classType: string): void;
    previousNextIconHandler(): void;
    protected getModuleName(): string;
    destroy(): void;
}

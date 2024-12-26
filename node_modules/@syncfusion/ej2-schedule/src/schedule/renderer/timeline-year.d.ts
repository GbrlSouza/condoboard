import { Schedule } from '../base/schedule';
import { Year } from './year';
/**
 * timeline year view
 */
export declare class TimelineYear extends Year {
    viewClass: string;
    isInverseTableSelect: boolean;
    constructor(parent: Schedule);
    protected getModuleName(): string;
    renderHeader(headerWrapper: HTMLElement): void;
    private renderResourceHeader;
    renderContent(contentWrapper: HTMLElement): void;
    private renderDefaultContent;
    getContentRows(): Element[];
    renderResourceContent(wrapper: HTMLElement, monthBody: HTMLTableSectionElement, contentBody: HTMLTableSectionElement): void;
    private renderDayMonthHeaderTemplate;
    private renderCellTemplate;
    scrollToDate(scrollDate: Date): void;
    getScrollableElement(): Element;
    private wireEvents;
}

import { TdData } from '../base/interface';
import { Schedule } from '../base/schedule';
/**
 * Virtual Scroll
 */
export declare class VirtualScroll {
    private parent;
    private translateY;
    private itemSize;
    bufferCount: number;
    private renderedLength;
    private averageRowHeight;
    private timeValue;
    private focusedEle;
    private isResourceCell;
    isHorizontalScroll: boolean;
    isRemoteRefresh: boolean;
    private startIndex;
    existingDataCollection: TdData[];
    enableTransition: boolean;
    constructor(parent: Schedule);
    private addEventListener;
    private removeEventListener;
    getRenderedCount(): number;
    renderVirtualTrack(contentWrap: Element): void;
    updateVirtualScrollHeight(): void;
    updateVirtualTrackHeight(wrap: HTMLElement): void;
    setItemSize(): void;
    refreshLayout(): void;
    private renderEvents;
    virtualScrolling(): void;
    private horizontalScrolling;
    private triggerScrollEvent;
    private upScroll;
    private downScroll;
    private leftScroll;
    private rightScroll;
    private getCollection;
    private getResCollection;
    private getByDateCollection;
    private getByIdCollection;
    private setStartEndIndex;
    updateContent(resWrap: HTMLElement, conWrap: HTMLElement, eventWrap: HTMLElement, resCollection: TdData[]): void;
    private removeObsoleteRows;
    private updateHorizontalContent;
    private updateMonthViewContent;
    private updateOtherViewContent;
    private mergeNewTdData;
    private getBufferCollection;
    private setTranslate;
    updateFocusedWorkCell(): void;
    setRenderedDates(resCollection: TdData[]): void;
    private setTabIndex;
    destroy(): void;
}

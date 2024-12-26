import { ActionBase } from '../actions/action-base';
/**
 * Schedule events resize actions
 */
export declare class Resize extends ActionBase {
    wireResizeEvent(element: HTMLElement): void;
    private resizeHelper;
    resizeStart(e: MouseEvent & TouchEvent): void;
    private resizing;
    updateResizingDirection(e: MouseEvent & TouchEvent): void;
    private monthResizing;
    private yearEventsRendering;
    private getMonthDiff;
    private getEventCount;
    private resizeStop;
    private verticalResizing;
    private horizontalResizing;
    private getTopBottomStyles;
    private getLeftRightStyles;
    private resizeValidation;
    /**
     * Get module name
     *
     * @returns {string} Returns the module name..
     */
    protected getModuleName(): string;
}

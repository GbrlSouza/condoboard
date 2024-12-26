import { TimezoneFields } from '../base/interface';
/**
 * Time zone
 */
export declare class Timezone {
    timezoneData: TimezoneFields[];
    constructor();
    offset(date: Date, timezone: string): number;
    convert(date: Date, fromOffset: number | string, toOffset: number | string): Date;
    add(date: Date, timezone: string): Date;
    remove(date: Date, timezone: string): Date;
    removeLocalOffset(date: Date): Date;
    getLocalTimezoneName(): string;
    private getTimezoneData;
}
export declare const timezoneData: TimezoneFields[];

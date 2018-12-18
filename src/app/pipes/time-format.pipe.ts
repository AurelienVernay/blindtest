import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'timeFormat',
})
export class TimeFormatPipe implements PipeTransform {
    /**
     * transforme une valeur numérique en secondes en utilisant la bibliothèque moment
     */
    transform(value: any, args?: any): any {
        const myDuration = moment.duration(value, 'second');
        if (myDuration.minutes() >= 1) {
            return `${myDuration.minutes()}m ${myDuration.seconds()}s`;
        } else {
            return `${myDuration.seconds()}s`;
        }
    }
}

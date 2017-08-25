import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'hourMin'
})

export class HourMinPipe implements PipeTransform {
    transform(value: any): any {
        let date = new Date(value * 1000);
        let utc = date.getTime() + ( date.getTimezoneOffset() * 60000 ) + ( 12600000 );
        let result = new Date(utc);

        return result.getHours() + ':' + ( result.getMinutes()<10?'0':'' ) + result.getMinutes();
    }
}
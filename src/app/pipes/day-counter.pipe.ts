import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dayCounter',
    pure: false
})

export class DayCounterPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        const day = new Date(value).getTime()
        const now = new Date().getTime()
        const dif = day - now
        
        const dayDif = dif / 86400000;
        const hourDif = (dif / 3600000) % 24;
        const minDif = (dif / 60000) % 60;
        const secDif = (dif / 1000) % 60;
        
        
        return dayDif.toFixed() + ' روز '
            + hourDif.toFixed() + ' ساعت '
            + minDif.toFixed() + ' دقیقه '
            + secDif.toFixed() + ' ثانیه '
    }
}
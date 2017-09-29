import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dayCounter'
})

export class DayCounterPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        const day = new Date(value)
        const today = new Date()
        const dif = (day.getTime() - today.getTime()) / 86400000;
        
        
        return dif.toFixed() + ' روز '        
    }
}
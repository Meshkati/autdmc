import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'persianNumber'
})

export class PersianNumberPipe implements PipeTransform {
    transform(value: any): any {
        let result = value.toString();

        result = result.replace(/[1234567890]/g, function (m) {
            return {
                '1': '۱',
                '2': '۲',
                '3': '۳',
                '4': '۴',
                '5': '۵',
                '6': '۶',
                '7': '۷',
                '8': '۸',
                '9': '۹',
                '0': '۰',

            }[m];
        });

        return result;
    }
}
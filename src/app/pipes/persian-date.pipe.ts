import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'persianDate'
})

export class PersianDatePipe implements PipeTransform {
    transform(value: any, format): any {
        let date = new Date(value);
        let jDate = new JDate(new Date(parseInt(value) * 1000));
        if (!format) {
            format = 'dddd DD MMMM YYYY'
        }

        return jDate.format(format);
    }
}

class Jalali {
    /*
    Utility helper functions.
    */
    public div(a, b) {
        return ~~(a / b)
    }
    
    public mod(a, b) {
        return a - ~~(a / b) * b
    }
    /*
    This function determines if the Jalaali (Persian) year is
    leap (366-day long) or is the common year (365 days), and
    finds the day in March (Gregorian calendar) of the first
    day of the Jalaali year (jy).
    @param jy Jalaali calendar year (-61 to 3177)
    @return
    leap: number of years since the last leap year (0 to 4)
    gy: Gregorian year of the beginning of Jalaali year
    march: the March day of Farvardin the 1st (1st day of jy)
    @see: http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm
    @see: http://www.fourmilab.ch/documents/calendar/
    */
    public jalCal(jy) {
        // Jalaali years starting the 33-year rule.
        var breaks =  [ -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210
            , 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
        ]
        , bl = breaks.length
        , gy = jy + 621
        , leapJ = -14
        , jp = breaks[0]
        , jm
        , jump
        , leap
        , leapG
        , march
        , n
        , i
        
        if (jy < jp || jy >= breaks[bl - 1])
            throw new Error('Invalid Jalaali year ' + jy)
        
        // Find the limiting years for the Jalaali year jy.
        for (i = 1; i < bl; i += 1) {
            jm = breaks[i]
            jump = jm - jp
            if (jy < jm)
                break
            leapJ = leapJ + this.div(jump, 33) * 8 + this.div(this.mod(jump, 33), 4)
            jp = jm
        }
        n = jy - jp
        
        // Find the number of leap years from AD 621 to the beginning
        // of the current Jalaali year in the Persian calendar.
        leapJ = leapJ + this.div(n, 33) * 8 + this.div(this.mod(n, 33) + 3, 4)
        if (this.mod(jump, 33) === 4 && jump - n === 4)
            leapJ += 1
        
        // And the same in the Gregorian calendar (until the year gy).
        leapG = this.div(gy, 4) - this.div((this.div(gy, 100) + 1) * 3, 4) - 150
        
        // Determine the Gregorian date of Farvardin the 1st.
        march = 20 + leapJ - leapG
        
        // Find how many years have passed since the last leap year.
        if (jump - n < 6)
            n = n - jump + this.div(jump + 4, 33) * 33
        leap = this.mod(this.mod(n + 1, 33) - 1, 4)
        if (leap === -1) {
            leap = 4
        }
        return  { leap: leap
            , gy: gy
            , march: march
        }
    }
    
    /*
    Converts a date of the Jalaali calendar to the Julian Day number.
    @param jy Jalaali year (1 to 3100)
    @param jm Jalaali month (1 to 12)
    @param jd Jalaali day (1 to 29/31)
    @return Julian Day number
    */
    
    public j2d(jy, jm, jd) {
        var r = this.jalCal(jy)
        return this.g2d(r.gy, 3, r.march) + (jm - 1) * 31 - this.div(jm, 7) * (jm - 7) + jd - 1
    }
    /*
    Converts the Julian Day number to a date in the Jalaali calendar.
    @param jdn Julian Day number
    @return
    jy: Jalaali year (1 to 3100)
    jm: Jalaali month (1 to 12)
    jd: Jalaali day (1 to 29/31)
    */
    
    public d2j(jdn) {
        var gy = this.d2g(jdn).gy // Calculate Gregorian year (gy).
        , jy = gy - 621
        , r = this.jalCal(jy)
        , jdn1f = this.g2d(gy, 3, r.march)
        , jd
        , jm
        , k
        
        // Find number of days that passed since 1 Farvardin.
        k = jdn - jdn1f
        if (k >= 0) {
            if (k <= 185) {
                // The first 6 months.
                jm = 1 + this.div(k, 31)
                jd = this.mod(k, 31) + 1
                return  { jy: jy
                    , jm: jm
                    , jd: jd
                }
            } else {
                // The remaining months.
                k -= 186
            }
        } else {
            // Previous Jalaali year.
            jy -= 1
            k += 179
            if (r.leap === 1)
                k += 1
        }
        jm = 7 + this.div(k, 30)
        jd = this.mod(k, 30) + 1
        return  { jy: jy
            , jm: jm
            , jd: jd
        }
    }
    
    
    
    public g2d(gy, gm, gd) {
        var d = this.div((gy + this.div(gm - 8, 6) + 100100) * 1461, 4)
        + this.div(153 * this.mod(gm + 9, 12) + 2, 5)
        + gd - 34840408
        d = d - this.div(this.div(gy + 100100 + this.div(gm - 8, 6), 100) * 3, 4) + 752
        return d
    }
    
    
    
    public d2g(jdn) {
        var j
        , i
        , gd
        , gm
        , gy
        j = 4 * jdn + 139361631
        j = j + this.div(this.div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908
        i = this.div(this.mod(j, 1461), 4) * 5 + 308
        gd = this.div(this.mod(i, 153), 5) + 1
        gm = this.mod(this.div(i, 153), 12) + 1
        gy = this.div(j, 1461) - 100100 + this.div(8 - gm, 6)
        return  { gy: gy
            , gm: gm
            , gd: gd
        }
    }
    
    
    
}

class JDate {
    jalali = new Jalali();
    
    date;
    _d = new Date();
    MONTH_NAMES = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'امرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    ABBR_DAYS = ['۱ش', '۲ش', '۳ش', '۴ش', '۵ش', 'ج', 'ش'];
    DAYS_NAMES = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    
    /*
    * Helper Functions
    */
    public fix_month(year, month) {
        if (month > 12 || month <= 0) {
            var yearDiff = Math.floor((month - 1) / 12);
            year += yearDiff;
            month = month - yearDiff * 12;
        }
        return [year, month]
    }
    
    public replaceYear(str, date) {
        let match = str.match(/[yY]+/);
        if (match) {
            switch (match[0]) {
                case 'YYYY':
                case 'YYY':
                var value = this.replaceYear(str.replace(match, date.getFullYear()), date);
                return value;
                case 'YY':
                var value = this.replaceYear(str.replace(match, String(date.getFullYear()).slice(2)), date);
                return value;
            }
        } else {
            return str;
        }
    }
    
    public replaceMonth(str, date) {
        let match = str.match(/[mM]+/);
        if (match) {
            switch (match[0]) {
                case 'M':
                case 'MM':
                var value = this.replaceMonth(str.replace(match, date.getMonth()), date);
                return value;
                case 'MMM':
                case 'MMMM':
                var value = this.replaceMonth(str.replace(match, this.MONTH_NAMES[date.getMonth() - 1]), date);
                return value;
            }
        } else {
            return str
        }
    }
    
    public replaceDay(str, date) {
        let match = str.match(/[dD]+/);
        if (match) {
            switch (match[0]) {
                case 'D':
                case 'DD':
                var value = this.replaceDay(str.replace(match, date.getDate()), date);
                return value;
                case 'd':
                case 'dd':
                var value = this.replaceDay(str.replace(match, this.ABBR_DAYS[date.getDay()]), date);
                return value;
                case 'ddd':
                case 'dddd':
                var value = this.replaceDay(str.replace(match, this.DAYS_NAMES[date.getDay()]), date);
                return value;
            }
        } else {
            return str;
        }
    }
    
    /*
    * Initialize JDate with either a Date object or an Array of
    * Jalali date: [1393, 5, 3]
    *
    * @params {Array, Date} date
    */
    constructor(_date) {
        // this._d = _date || new Date;
        this._d = new Date(_date);
        if (this._d instanceof Array) {
            // this.date = map(this._d, function(v){
            //     return parseInt(v);
            // });
            this.date.foreach(element => {
                console.log(element);
                
                this._d = new Date();
            })
            this._d = this.to_gregorian();
        } else if (this._d instanceof Date) {
            this.date = this.to_jalali(this._d);
        }
    }
    
    /*
    * Converts JDate date to Gregorian
    */
    to_gregorian() {
        return this.to_gregoriann(this.date[0], this.date[1], this.date[2]);
    }
    
    setFullYear(year) {
        this.date[0] = parseInt(year);
        this._d = this.to_gregorian();
        return this
    }
    
    getMonth() {
        return this.date[1];
    }
    
    setMonth(month) {
        let fixed = this.fix_month(this.getFullYear(), parseInt(month));
        this.date[0] = fixed[0];
        this.date[1] = fixed[1];
        this._d = this.to_gregorian();
        return this
    }
    
    getDate() {
        return this.date[2];
    }
    
    setDate(date) {
        this.date[2] = parseInt(date);
        this._d = this.to_gregorian();
        return this
    }
    
    getDay() {
        return this._d.getDay()
    }
    
    format(format) {
        format = this.replaceYear(format, this);
        format = this.replaceMonth(format, this);
        format = this.replaceDay(format, this);
        return format;
    }
    
    to_jalali(date) {
        var jdate = this.jalali.d2j(this.jalali.g2d(date.getFullYear(), date.getMonth() + 1, date.getDate()));
        return [jdate.jy, jdate.jm, jdate.jd]
    }
    to_gregoriann(year, month, day) {
        var gdate = this.jalali.d2g(this.jalali.j2d(year, month, day));
        return new Date(gdate.gy, gdate.gm - 1, gdate.gd);
    }
    
    isLeapYear(year) {
        return this.jalali.jalCal(year).leap === 0
    }
    
    daysInMonth(year, month) {
        year += ~~(month / 12)
        month = month - ~~(month / 12) * 12
        if (month < 0) {
            month += 12
            year -= 1
        } else if (month == 0) {
            month = 12
        }
        if (month <= 6) {
            return 31
        } else if (month <= 11) {
            return 30
        } else if (this.isLeapYear(year)) {
            return 30
        } else {
            return 29
        }
    }      
    
    getFullYear() {
        return this.date[0];
    }
    
    
    
}
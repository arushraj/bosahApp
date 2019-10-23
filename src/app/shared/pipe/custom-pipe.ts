import { Pipe, PipeTransform } from '@angular/core';
import { AppConstant } from '../constant/app.constant';
/*
 * Default text for blank value.
 * Usage:
 *   value | blankText
 * Example:
 *   {{ data.text | blankText }}
 *   formats to: '——'
*/
@Pipe({ name: 'blankValue' })
export class BlankValuePipe implements PipeTransform {
    transform(value: any): any {
        if (value === '' || value === undefined || value === null) {
            return '——';
        } else {
            return value;
        }
    }
}

/*
 * Default image for blank profile image by gender value else create image link.
 * Usage:
 *   value | blankText: user.gender
 * Example:
 *   {{ data.image | blankText: user.gender }}
 *   formats to: 'http//link to image'
*/
@Pipe({ name: 'imageBinder' })
export class ImageBinderPipe implements PipeTransform {
    constructor(private appConstant: AppConstant) { }
    transform(value: any, gender: string): any {
        if (value === '' || value === undefined || value === null) {
            if (gender === 'Female') {
                return '/assets/avatar-icon-png-10.jpg';
            } else if (gender === 'Male') {
                return '/assets/avatar-icon-png-8.jpg';
            } else {
                return '/assets/no-image.png';
            }
        } else {
            return this.appConstant.APP_BASE_URL + value + `?random=${Math.random()}`;
        }
    }
}

@Pipe({ name: 'eventImageBinder' })
export class EventImageBinderPipe implements PipeTransform {
    constructor(private appConstant: AppConstant) { }
    transform(value: any): any {
        if (value === '' || value === undefined || value === null) {
            return '/assets/no-image.png';
        } else {
            return this.appConstant.APP_BASE_URL + value + `?random=${Math.random()}`;
        }
    }
}



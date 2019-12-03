import { Pipe, PipeTransform } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Pipe({ name: 'decryptTextBinder' })
export class DecryptTextBinderPipe implements PipeTransform {
    constructor() { }
    transform(value: string, key: string): string {
        if (value === '' || value === undefined || value === null) {
            return '';
        } else {
            try {
                const decryptValue = CryptoJS.AES.decrypt(value, key);
                if (decryptValue.sigBytes >= 0) {
                    return decryptValue.toString(CryptoJS.enc.Utf8);
                } else {
                    return value;
                }
            } catch (error) {
                return '';
            }
        }
    }
}

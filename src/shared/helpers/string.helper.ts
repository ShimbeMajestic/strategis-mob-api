import { v4 as uuid } from 'uuid';
import * as crypto from 'crypto';
import { Arr } from './array.helper';

export class Str {
    static uuid = (): string => uuid();

    static slug(text: string) {
        return text
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    }

    static nameCapitalize(text: string) {
        return text && text.length > 0
            ? text?.charAt(0)?.toUpperCase() + text?.slice(1)?.toLowerCase()
            : null;
    }

    static normalizePhoneNumber(str: string): string {
        // Check for null/empty values
        if (!str || str.length === 0) {
            return null;
        }

        // remove white spaces
        str = str.replace(/\s/g, '');

        // if number starts with '0' replace with '+255'
        if (str.startsWith('0')) {
            str = str.replace('0', '255');
        }

        // if number starts with '255' replace with '+255'
        if (str.startsWith('+255')) {
            str = str.replace('+255', '255');
        }

        // add 255 country code if starts with just numbers
        if (str.startsWith('7') || str.startsWith('6')) {
            str = '255'.concat(str);
        }

        return str;
    }

    static isValidPhoneNumber(str: string): boolean {
        // Check for null/empty values
        if (!str || str.length === 0) {
            return false;
        }

        // remove white spaces
        str = str.replace(/\s/g, '');

        // if number starts with '0' replace with '+255'
        if (str.startsWith('0')) {
            str = str.replace('0', '255');
        }

        // if number starts with '255' replace with '+255'
        if (str.startsWith('+255')) {
            str = str.replace('+255', '255');
        }

        // add 255 country code if starts with just numbers
        if (str.startsWith('7') || str.startsWith('6')) {
            str = '255'.concat(str);
        }

        // check if number is valid
        if (str.startsWith('255') && str.length === 12) {
            return true;
        }

        return false;
    }

    static isValidEmail(str: string): boolean {
        // Check for null/empty values
        if (!str || str.length === 0) {
            return false;
        }

        // remove white spaces
        str = str.replace(/\s/g, '');

        // check if email is valid
        if (str.includes('@') && str.includes('.')) {
            return true;
        }

        return false;
    }

    static randomFixedInteger(digits = 10) {
        return [...Array(digits)].map(() => crypto.randomInt(10)).join('');
    }

    static random(length = 10) {
        return crypto.randomBytes(length).toString('hex').slice(0, length);
    }

    static maskPhoneNumber(phoneNumber: string) {
        const lastdigits = phoneNumber?.slice(-3);
        const firstdigits = phoneNumber?.substring(0, 6);

        return phoneNumber ? firstdigits + '-XXX-' + lastdigits : null;
    }

    static generatePassword(passwordLength = 8) {
        const numberChars = '0123456789';
        const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
        const allChars = numberChars + upperChars + lowerChars;

        const randPasswordArray = Array(passwordLength);
        randPasswordArray[0] = numberChars; // to make sure atleast one number is there in password
        randPasswordArray[1] = upperChars; // to make sure atleast one upper case letter is there in password
        randPasswordArray[2] = lowerChars; // to make sure atleast one lower case letter is there in password
        const newRandPasswordArray = randPasswordArray.fill(allChars, 3); // fill rest of the password array with all chars

        const newPasswordArray = newRandPasswordArray.map(
            (x) => x[crypto.randomInt(x.length)],
        ); // create password array from the password array

        return Arr.shuffle(newPasswordArray).join(''); // shuffle the generated password array and convert to string
    }

    static isEmptyOrWhitespace(value: string): boolean {
        return (
            value == null || value.trim() === '' || typeof value === 'undefined'
        );
    }
}

import { v4 as uuid } from 'uuid';
export class Str {

    static uuid = () => uuid();

    static slug(text: string) {
        return text
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '')
            ;
    }

    static randomFixedInteger(digits = 10) {

        const min = Math.pow(10, digits - 1);
        const max = min * 9;

        return Math.floor(min + Math.random() * max);
    }

    static random(length = 10) {

        const dec2hex = (decimal: number) => {
            return decimal.toString(16).padStart(2, "0");
        }

        const getRandomValues = (array: Uint8Array) => {
            array.forEach((value, index) => {
                array[index] = Math.floor(Math.random() * 256)
            })
        }

        const arr = new Uint8Array((length || 40) / 2);
        //TODO: quickly fixed the beneath line. Need better solution
        // window.crypto.getRandomValues(arr);
        getRandomValues(arr);


        return Array.from(arr, dec2hex).join('');
    }

    static generatePassword(passwordLength = 8) {
        const numberChars = "0123456789";
        const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowerChars = "abcdefghijklmnopqrstuvwxyz";
        const allChars = numberChars + upperChars + lowerChars;
        const randPasswordArray = Array(passwordLength);
        randPasswordArray[0] = numberChars;
        randPasswordArray[1] = upperChars;
        randPasswordArray[2] = lowerChars;
        const newrandPasswordArray = randPasswordArray.fill(allChars, 3);
        return Str.shuffleArray(newrandPasswordArray.map(function (x) { return x[Math.floor(Math.random() * x.length)] })).join('');
    }

    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
}

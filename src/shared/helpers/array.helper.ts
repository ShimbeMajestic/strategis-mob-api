import * as crypto from 'crypto';

export class Arr {
    static shuffle<T> (array: Array<T>): Array<T> {
        for (let i = array.length - 1; i > 0; i--) {
            const j = crypto.randomInt(i + 1);
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    static randomPick<T> (array: Array<T>): T {
        if(array?.length > 0) {
            return array[crypto.randomInt(array.length)];
        }
        return null;
    }
}
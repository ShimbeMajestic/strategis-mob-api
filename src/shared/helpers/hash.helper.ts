import * as bcrypt from 'bcryptjs';
import { InternalServerErrorException } from '@nestjs/common';

export class Hash {
    static async make(value: string, algorithm = 'bcrypt'): Promise<string> {
        if (algorithm === 'bcrypt') {
            return Hash.brcryptHash(value);
        }

        throw new InternalServerErrorException(
            'Unsupported hash algorithm provided. Supported: bcrypt',
        );
    }

    static async compare(value: string, hashedValue: string): Promise<boolean> {
        // Is bcrypt Hash
        if (hashedValue.startsWith('$2a')) {
            return Hash.brcryptVerify(value, hashedValue);
        }

        throw new InternalServerErrorException(
            'Unsupported hash algorithm for hashed value',
        );
    }

    static async brcryptHash(value: string, saltRounds = 10): Promise<string> {
        const hash = await bcrypt.hash(value, saltRounds);

        return hash;
    }

    static async brcryptVerify(
        value: string,
        hashedValue: string,
    ): Promise<boolean> {
        const result = await bcrypt.compare(value, hashedValue);

        return result;
    }
}

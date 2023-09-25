import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isOldEnough', async: false })
export class IsOldEnoughValidator implements ValidatorConstraintInterface {
    validate(dob: Date, args: ValidationArguments) {
        const today = new Date();

        const dateOfBirth = new Date(dob);

        let age = today.getFullYear() - dateOfBirth.getFullYear();
        if (
            today.getMonth() < dateOfBirth.getMonth() ||
            (today.getMonth() === dateOfBirth.getMonth() &&
                today.getDate() < dateOfBirth.getDate())
        ) {
            // Subtract 1 from age if the birthdate hasn't occurred yet this year
            age--;
        }
        return age >= 18;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Sorry, you must be at least 18 years old.';
    }
}

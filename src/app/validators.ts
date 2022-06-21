import {AbstractControl, ValidatorFn} from '@angular/forms';

export function nameExistValidator(existingNames: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value !== undefined && existingNames.includes(control.value.trim())) {
      return {'exist': true};
    }
    return null;
  };
}

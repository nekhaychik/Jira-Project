import {AbstractControl, ValidatorFn} from '@angular/forms';
import {ListStore} from "../app/services/types";

export function ValidateNameExist(lists: ListStore[]): ValidatorFn {

  return (control: AbstractControl): { [key: string]: boolean } | null => {
    for(let i = 0; i < lists.length; i++) {
      if (control.value == lists[i].name) {
        console.log('exist')
        return { 'invalidName': true };
      }
    }
    return null;
  };
}


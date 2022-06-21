import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(arrayOfValues: any, searchValue: string) {
    return !searchValue ? arrayOfValues : arrayOfValues.filter((value: any) => value.name.toString().toLowerCase().includes(searchValue.toLowerCase()));
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import {User} from "../../../classes/Settings";

@Pipe({
  name: 'user'
})
export class UserPipe implements PipeTransform {

  transform(completeResponses: any, searchName: any): any {
    if (!completeResponses || !searchName) {
      return completeResponses;
    }
    if (searchName) {
      const filterByUserGroup: Array<User> = [];
      completeResponses.forEach((response: any) => {
        if (response.firstName
          && response.firstName.toLocaleLowerCase().indexOf(searchName.toLocaleLowerCase()) !== -1) {
          filterByUserGroup.push(response);
        } else if (response.lastName
          && response.lastName.toLocaleLowerCase().indexOf(searchName.toLocaleLowerCase()) !== -1) {
          filterByUserGroup.push(response);
        } else if (response.mobileNumber
          && response.mobileNumber.toLocaleLowerCase().indexOf(searchName.toLocaleLowerCase()) !== -1) {
          filterByUserGroup.push(response);
        } else if (response.identificationNumber
          && response.identificationNumber.toLocaleLowerCase().indexOf(searchName.toLocaleLowerCase()) !== -1) {
          filterByUserGroup.push(response);
        }
      });

      return filterByUserGroup.filter((value, index, self) => self.indexOf(value) === index);
    }
  }


}

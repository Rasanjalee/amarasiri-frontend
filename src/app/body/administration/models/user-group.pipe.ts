import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userGroup'
})
export class UserGroupPipe implements PipeTransform {

  transform(completeResponses: any, searchName: any): any {
    if (!completeResponses || !searchName) {
      return completeResponses;
    }
    if (searchName) {
      const filterByUserGroup: Array<any> = [];
      completeResponses.forEach((response: any) => {
        if (response.userGroupName
          && response.userGroupName.toLocaleLowerCase().indexOf(searchName.toLocaleLowerCase()) !== -1) {
          filterByUserGroup.push(response);
        }
      });

      return filterByUserGroup.filter((value, index, self) => self.indexOf(value) === index);
    }
  }


}

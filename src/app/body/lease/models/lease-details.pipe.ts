import { Pipe, PipeTransform } from '@angular/core';
import {LeaseDetails} from "../../../classes/LeaseDetails";

@Pipe({
  name: 'leaseDetails'
})
export class LeaseDetailsPipe implements PipeTransform {

  transform(completeResponses: any, searchName: any): any {
    if (!completeResponses || !searchName) {
      return completeResponses;
    }
    if (searchName) {
      const filterByProject: Array<LeaseDetails> = [];
      completeResponses.forEach((response: LeaseDetails) => {
        if (response.vehicle.vehicleNumber
          && response.vehicle.vehicleNumber.toLocaleLowerCase().indexOf(searchName.toLocaleLowerCase()) !== -1) {
          filterByProject.push(response);
        } else if (response.leaseeMaster.firstName
          && response.leaseeMaster.firstName.toLocaleLowerCase().indexOf(searchName.toLocaleLowerCase()) !== -1){
          filterByProject.push(response);
        } else if (response.leaseeMaster.lastName
          && response.leaseeMaster.lastName.toLocaleLowerCase().indexOf(searchName.toLocaleLowerCase()) !== -1) {
          filterByProject.push(response);
        }
      });

      return filterByProject.filter((value, index, self) => self.indexOf(value) === index);
    }
  }


}

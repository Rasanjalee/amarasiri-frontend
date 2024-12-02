export class User {
  constructor(
    public address: string,
    public email: string,
    public firstName: string,
    public homeNumber: string,
    public identificationNumber: string,
    public isEnable: number,
    public isHidden: number,
    public lastName: string,
    public loginId: string,
    public mobileNumber: any,
    public password: any,
    public progileImagePath: string,
    public userGroup: UserGroup,
    public userKey: number,
    public userTypeKey: number
  ) {
  }
}

export class UserGroup {
  constructor(
    public userGroupKey: number,
    public userGroupName: any
  ) {
  }
}

export class NewUser{
  constructor(
    public username: string,
    public firstName: string,
    public lastName: string,
    public password: string,
    public identificationNumber: string,
    public userGroupKey: number,
    public mobileNumber: any,
    public homeNumber: any,
    public address: string,
    public email:string,
    public userType: number= 1,
    public profileImagePath: string,
    public isEnable: number = 1,
    public isHidden: number = 0
  ) {
  }
}
export class NewLeaseAppSettings {
  constructor(
    public documentCharge: any,//
    public latePaymentInterest: any,//
    public visitCharge: any,//
    public monthlyInterest: any,//
    public earlierSettlementInterest: any,//
    public lastModifiedDateTime: any,
    // public modifiedUserName: string,
    public userKey: number,
    public belowBenchInterestCharge:any,//
    public aboveBenchInterestCharge:any,//
    public interestChangeDelayDuration:any,//
    public benchMarkValue:any,//
    public userName :any,//
    public delayInterestCharge:any//,



  ) {
  }
}
export class LeaseAppSettings {
  constructor(
    public documentCharge: any,//
    public latePaymentInterest: any,//
    public visitCharge: any,//
    public monthlyInterest: any,//
    public earlySettlementInterest: any,//
    public modifiedDateTime: any,
    // public modifiedUserName: string,
    // public userKey: number,
    public belowBenchInterestCharge:any,//
    public aboveBenchInterestCharge:any,//
    public interestChangeDelayDuration:any,//
    public benchMarkValue:any,//
    public user :User,//
    public delayInterestCharge:any//,



  ) {
  }
}

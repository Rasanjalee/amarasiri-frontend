export class LeaseDetails {
  constructor(
    public leaseeMaster:LeaseeMasterDetails,
    public leaseMaster: LeaseMasterDetails,
    public vehicle: VehicleDetails,
    public leaseGurantors: LeaseGuarantors[],
    public leaseDocuments: LeaseDocuments[],
    public installments: LeaseInstallments[],
    public leasePaymentHistories: LeasePaymentHistory[]
  ) {
  }
}

export class LeasePaymentHistory {
  constructor(
    public paymentAmount: any,
    public paymentdateTime: any
  ) {
  }
}

export class LeaseGuarantors {
  constructor(
    public gurantorName: string,
    public identityNumber: string,
    public telephoneNumber: string,
    public address: string
  ) {
  }
}

export class LeaseDocuments {
  constructor(
    public documentName: string,
    public documentPath: string
  ) {
  }
}

export class LeaseeMasterDetails {
  constructor(
    public firstName: string,
    public lastName: string,
    public nic: string,
    public mobileNumber: string,
    public homeNumber: string,
    public address: string,
    public profimagePath: string,
    public email: string,
  ) {
  }
}

export class LeaseMasterDetails {
  constructor(
    public leaseKey: number,
    public leaseID: string,
    public leaseAmount: any,
    public annualInterestRate: any,
    public leaseDuration: any,
    public leaseStartDate: any,
    public installment: any,
    public totalInterest: any,
    public remainingTotalInterestForLastPayment: any,
    public totalLeaseCost: any,
    public remainingTotalLeaseCostForLastPayment: any,
    public cashOnCustomerHand: any,
    public totalInterestCollected: any,
    public leaseTypeKey: any,
    public documentCharge: any,
    public visitCharge: any,
    public panneltyDuration: any,
    public panneltyForStartDate: any,
    public isPaymentOutDated: any,
    public nextPaymentDate: any,
    public currentOutStandingBalance: any,
    public nextPaymentDateOutStandingBalance: any,
    public remainingLeaseAmount: any,
    public remainingCapial: any,
    public isLeaseClosed: any,
    public penaltyDurationForNextPayment: number,
    public penaltyAmountForNextPayment: any,
    public lastPaidInstallmentIndex: any,
    public remainingCapitalForToday: any,
    public closedDateTime: any,
    public closingAmount: any,
    public closingInterest: any,
    public closingCapitalAmount: any,
    public isHidden:any
  ) {
  }
}

export class VehicleDetails {
  constructor(
    public vehicleNumber: string,
    public chassisNumber: string,
    public make: string,
    public mode: string,
    public manuYear: string,
    public regYear: string,
    public numOwners: any,
    public engineNumber: string,
    public vehicleImage: string,
  ) {
  }
}

export class LeaseInstallments {
  constructor(
    public installmentIndex: number,
    public paymentDate: any,
    public beginingBalance: any,
    public beginingLeaseCost: any,
    public endingBalance: any,
    public endingLeaseBalance: any,
    public installment: any,
    public principal: any,
    public interest: any
    // public paidAmount: any,
    // public penaltyDuration: any,
    // public penaltyAmount: any,
    // public penaltyInterestRate: any,
    // public isPaymentDone: any,
    // public isLatePayment: any,
    // public isPaymentOutDated: any,
  ) {
  }
}

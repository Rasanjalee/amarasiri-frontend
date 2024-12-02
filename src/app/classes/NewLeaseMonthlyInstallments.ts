export class NewLeaseMonthlyInstallments {
  constructor(
    public leaseValuation: any,
    public cashOnHand: any,
    public installment: any,
    public totalLeaseCost: any,
    public totalInterest: any,
    public leaseStartDate: any,
    public totalDuration: any,
    public leaseType: any,
    public interestRate: any,
    public numberOfPenaltyDates:any,
    public penaltyOnStartDate:any,
    public totalLoanCost:any
  ) {
  }
}

export class NewLeasePaymentsDetails{
  constructor(
    public date: string,
    public beginLeaseCost: any,
    public monthInstallment: any,
    public monthlyInterest: any,
    public endingLeaseBalance: any,
    public leaseClosedBalance: any
  ) {
  }
}

export class LeaseInstallmentValues {
  constructor(
    public installment: number,
    public interest: number,
    public outDatedDaysCount: number,
    public penaltyAmount: number
  ) {
  }
}

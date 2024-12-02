import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NewLeaseMonthlyInstallments, NewLeasePaymentsDetails} from "../../../../../classes/NewLeaseMonthlyInstallments";
import {InterCommunicatorService} from "../../../../../service/support-services/inter-communicator.service";
import {LeaseInstallments, LeaseMasterDetails} from "../../../../../classes/LeaseDetails";
import {SettingsService} from "../../../../../service/settings.service";
import {LeaseAppSettings, NewLeaseAppSettings} from "../../../../../classes/Settings";
import {data} from "jquery";

@Component({
  selector: 'app-lease-details',
  templateUrl: './lease-details.component.html',
  styleUrls: ['./lease-details.component.css']
})
export class LeaseDetailsComponent implements OnInit {

  leaseMasterDetails: LeaseMasterDetails;
  leaseInstallmentsDetails: LeaseInstallments[] = [];

  @Output() stepFiveFormSubmitted = new EventEmitter<{leaseMaster: LeaseMasterDetails, installment: LeaseInstallments[], monthlyPayments: any}> ();
  // @Output() stepFiveFormSubmitted = new EventEmitter<{leaseMaster: LeaseMasterDetails, installment: LeaseInstallments[]}> ();
  public stepFiveForm: FormGroup;
  isSubmitted = false;

  leaseAmountsCalculated = false;
  monthlyInstallment = new NewLeaseMonthlyInstallments('','','', '', '', '', '', '', '',0,0.0,0.0);

  monthlyPaymentDetails: NewLeasePaymentsDetails[] = [];
  newLeaseAppSettings:LeaseAppSettings[]=[];
  leaseAppSettingsData: NewLeaseAppSettings =  new NewLeaseAppSettings(0.0, 0.0,
    0.0, 0.0, 0.0, new Date(), 0,'', 0,0.0,0.0,'',0.0);
  leaseAppSettingsDataLoaded = false;

  constructor(private fb: FormBuilder,
              private communicationService: InterCommunicatorService,
              private settingsService: SettingsService) {
    this.stepFiveForm = this.fb.group( {
      valuation: this.fb.control('', Validators.required),
      leaseType: this.fb.control('1'),
      duration: this.fb.control('', Validators.required),
      interest: this.fb.control('', Validators.required),
      documentCharge: this.fb.control('', Validators.required),
      visitCharge: this.fb.control('', Validators.required),
      startDate: this.fb.control(new Date().toISOString().slice(0, 10))
    });

    this.leaseMasterDetails = new LeaseMasterDetails(0, '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '', '',
      '', '', '', '', '', '', '',
      '', 0, '', '', '', '',  '', '', '','');
  }

  ngOnInit(): void {
    this.getLeaseAppSettingsData();
  }

  getLeaseAppSettingsData() {
    this.settingsService.getLeaseAppSettingsData()
      .subscribe((data: any) => {
        // this.leaseAppSettingsData =  data;
        this.newLeaseAppSettings.push(data);
        this.newLeaseAppSettings.forEach(l=>{
          // this.leaseAppSettingsData.userName = l.user.firstName+' '+l.user.lastName;
          // this.leaseAppSettingsData.userKey=l.user.userKey;
          this.leaseAppSettingsData.monthlyInterest = l.monthlyInterest;
          this.leaseAppSettingsData.documentCharge = l.documentCharge;
          this.leaseAppSettingsData.belowBenchInterestCharge = l.belowBenchInterestCharge;
          this.leaseAppSettingsData.aboveBenchInterestCharge =  l.aboveBenchInterestCharge;
          this.leaseAppSettingsData.visitCharge=l.visitCharge;
          this.leaseAppSettingsData.lastModifiedDateTime=l.modifiedDateTime;
          this.leaseAppSettingsData.benchMarkValue=l.benchMarkValue;
          this.leaseAppSettingsData.latePaymentInterest=l.latePaymentInterest;
          this.leaseAppSettingsData.delayInterestCharge=l.delayInterestCharge;
          this.leaseAppSettingsData.interestChangeDelayDuration=l.interestChangeDelayDuration;
          this.leaseAppSettingsData.earlierSettlementInterest=l.earlySettlementInterest;
        })
        // Use patchValue to update the interest control in stepFiveForm
        this.stepFiveForm.patchValue({
          interest: this.leaseAppSettingsData.monthlyInterest,
          visitCharge: this.leaseAppSettingsData.visitCharge
        });
        this.leaseAppSettingsDataLoaded = true;
      })
  }


  setDocumentChargeWithValuation() {
    if(this.stepFiveForm.get('valuation')?.value!='') {
      this.stepFiveForm.patchValue({
        documentCharge: this.stepFiveForm.get('valuation')?.value * this.leaseAppSettingsData.documentCharge / 100
      });
      // this.setInterestChange();
    }
  }

  setInterestChange(){
    if(this.stepFiveForm.get('leaseType')?.value == 3){
      if(this.stepFiveForm.get('valuation')?.value!='') {
        if (this.stepFiveForm.get('valuation')?.value <= this.leaseAppSettingsData.benchMarkValue) {
          this.stepFiveForm.patchValue({
            interest: this.leaseAppSettingsData.belowBenchInterestCharge
          })
        } else {
          this.stepFiveForm.patchValue({
            interest: this.leaseAppSettingsData.aboveBenchInterestCharge
          })
        }
      }else{
        this.stepFiveForm.patchValue({
          interest: this.leaseAppSettingsData.belowBenchInterestCharge
        })
      }
    }
    else {
      this.stepFiveForm.patchValue({
        interest:this.leaseAppSettingsData.monthlyInterest
      })
    }
  }

  submitNewLeaseValuationDetails() {
    this.calculateIntermediateMonthsWithPayments();

  }

  calculateIntermediateMonthsWithPayments() {
    this.monthlyPaymentDetails = [];
    console.log(this.leaseInstallmentsDetails.length)
    for(let i=0;i<this.leaseInstallmentsDetails.length;i++){
      this.monthlyPaymentDetails.push(
        new NewLeasePaymentsDetails(
          new Date(this.leaseInstallmentsDetails[i].paymentDate).toISOString().slice(0, 10),
        this.leaseInstallmentsDetails[i].beginingLeaseCost,
        Math.round(this.leaseInstallmentsDetails[i].installment),
          this.leaseInstallmentsDetails[i].interest,
        this.leaseInstallmentsDetails[i].endingLeaseBalance,
        this.leaseInstallmentsDetails[i].endingBalance))
    }

   /* let beginningLeaseCost = this.monthlyInstallment.totalLeaseCost;
    let remainingAmount = this.monthlyInstallment.leaseValuation;
    for (let i = 1; i <= this.monthlyInstallment.totalDuration; i++) {
      const intermediateDate = new Date(this.monthlyInstallment.leaseStartDate);
      intermediateDate.setMonth(intermediateDate.getMonth() + i);
      if (this.monthlyInstallment.leaseType === '1') {
        const payment = new NewLeasePaymentsDetails(
          new Date(intermediateDate).toISOString().slice(0, 10), beginningLeaseCost,
          this.monthlyInstallment.installment, this.monthlyInstallment.totalInterest / this.monthlyInstallment.totalDuration,
          beginningLeaseCost - this.monthlyInstallment.installment, 0
        )
        this.monthlyPaymentDetails.push(payment);

        beginningLeaseCost = beginningLeaseCost - this.monthlyInstallment.installment;
      } else if(this.monthlyInstallment.leaseType === '2'){
        const monthlyEqualInstallment = this.monthlyInstallment.leaseValuation / this.monthlyInstallment.totalDuration;
        const monthlyInterest = (remainingAmount * this.monthlyInstallment.interestRate / 100.0);

        const payment = new NewLeasePaymentsDetails(
          new Date(intermediateDate).toISOString().slice(0, 10),
          remainingAmount, (monthlyEqualInstallment + monthlyInterest), monthlyInterest,
          remainingAmount - monthlyEqualInstallment,
          (remainingAmount + monthlyInterest)
        )
        this.monthlyPaymentDetails.push(payment);

        remainingAmount =  remainingAmount - monthlyEqualInstallment;
      }
    }*/
    const json = {status: true, paymentHistory: this.monthlyPaymentDetails, lease: this.monthlyInstallment }
    // this.communicationService.setCurrentActiveNewLeasePayments(json);
    // this.setCalculatedAmounts();
    this.stepFiveFormSubmitted.emit({leaseMaster: this.leaseMasterDetails, installment: this.leaseInstallmentsDetails, monthlyPayments: json});
    // this.stepFiveFormSubmitted.emit({leaseMaster: this.leaseMasterDetails, installment: this.leaseInstallmentsDetails});
    this.isSubmitted=true;
  }


  // private setCalculatedAmounts() {
  //  for (let i = 0; i < this.monthlyPaymentDetails.length; i++) {
  //     const payment = new LeaseInstallments(
  //       i+ 1,
  //       this.monthlyPaymentDetails[i].date,
  //       this.monthlyPaymentDetails[i].beginLeaseCost,
  //       this.monthlyPaymentDetails[i].beginLeaseCost,
  //       this.monthlyPaymentDetails[i].endingLeaseBalance,
  //       this.monthlyPaymentDetails[i].endingLeaseBalance,
  //       this.monthlyPaymentDetails[i].monthInstallment,
  //       0,
  //       this.monthlyPaymentDetails[i].monthlyInterest
  //     );
  //     this.leaseInstallmentsDetails.push(payment);
  //   }
  //
  //   this.stepFiveFormSubmitted.emit({leaseMaster: this.leaseMasterDetails, installment: this.leaseInstallmentsDetails});
  // }



  formValidation() {
    return this.stepFiveForm.get('valuation')?.value !== '' && this.stepFiveForm.get('duration')?.value !== '' &&
      this.stepFiveForm.get('interest')?.value !== '' && this.stepFiveForm.get('documentCharge')?.value !== '' &&
      this.stepFiveForm.get('documentCharge')?.value !== '';
  }

  calculateLeaseAmounts() {
    this.isSubmitted = true;
    this.leaseAmountsCalculated = false;
    if (this.formValidation()) {
      this.monthlyInstallment.leaseType = this.stepFiveForm.get('leaseType')?.value;
      this.monthlyInstallment.leaseStartDate = this.stepFiveForm.get('startDate')?.value;
      this.monthlyInstallment.totalDuration = this.stepFiveForm.get('duration')?.value;
      this.monthlyInstallment.interestRate = this.stepFiveForm.get('interest')?.value;
      this.leaseMasterDetails.isLeaseClosed = 0;
      this.leaseMasterDetails.panneltyDuration = 0;
      this.leaseMasterDetails.panneltyForStartDate = 0;
      this.leaseMasterDetails.isPaymentOutDated = 0;
      this.leaseMasterDetails.totalInterestCollected = 0.0;
      this.leaseMasterDetails.penaltyAmountForNextPayment =  0.0;
      this.leaseMasterDetails.lastPaidInstallmentIndex = 0;
      this.leaseMasterDetails.remainingCapitalForToday = 0.0;
      this.leaseMasterDetails.annualInterestRate=this.stepFiveForm.get('interest')?.value
      this.leaseMasterDetails.nextPaymentDate = new Date(new Date(this.stepFiveForm.get('startDate')?.value)
        .setMonth(new Date(this.stepFiveForm.get('startDate')?.value).getMonth() + 1)).toISOString().slice(0, 10);

      if (this.monthlyInstallment.leaseType === '1') {
        let monthlyInterest = this.stepFiveForm.get('interest')?.value/100
        let monthlyInterestAmount= ((this.stepFiveForm.get('valuation')?.value*monthlyInterest) * this.stepFiveForm.get('duration')?.value) /this.stepFiveForm.get('duration')?.value
        let monthlyInstallment = ((((this.stepFiveForm.get('valuation')?.value*monthlyInterest)*this.stepFiveForm.get('duration')?.value)+this.stepFiveForm.get('valuation')?.value)/this.stepFiveForm.get('duration')?.value)

        this.monthlyInstallment.installment=(monthlyInstallment).toFixed(2);
        this.monthlyInstallment.totalLeaseCost = Math.round(monthlyInstallment*this.stepFiveForm.get('duration')?.value)
        this.monthlyInstallment.totalInterest= Math.round((monthlyInstallment*this.stepFiveForm.get('duration')?.value)-this.stepFiveForm.get('valuation')?.value)

        let startDate: Date = new Date(this.stepFiveForm.get('startDate')?.value);
        let currentDate: Date = new Date(); // current date

        let numberOfPenaltyDays: number  =  Math.floor((startDate.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000));
        this.monthlyInstallment.numberOfPenaltyDates = numberOfPenaltyDays<0?0:numberOfPenaltyDays
        let endDate: Date = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + this.stepFiveForm.get('duration')?.value);

        // Calculate the difference in days
        let numberOfLoanDays: number = Math.floor((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));

        let perDayInterest = Math.round(this.monthlyInstallment.totalInterest/numberOfLoanDays)
        let penaltyOnstartDate = perDayInterest*this.monthlyInstallment.numberOfPenaltyDates
        this.monthlyInstallment.penaltyOnStartDate = penaltyOnstartDate
        this.monthlyInstallment.cashOnHand = this.stepFiveForm.get('valuation')?.value-this.stepFiveForm.get('documentCharge')?.value-this.stepFiveForm.get('visitCharge')?.value-penaltyOnstartDate
        this.monthlyInstallment.totalLoanCost = this.monthlyInstallment.totalLeaseCost+penaltyOnstartDate
        this.monthlyInstallment.totalInterest = this.monthlyInstallment.totalInterest+penaltyOnstartDate

        this.setPaymentScheduleForStandardEqualInstallment(penaltyOnstartDate,this.monthlyInstallment.totalLeaseCost,this.stepFiveForm.get('valuation')?.value,monthlyInstallment,monthlyInterestAmount,this.stepFiveForm.get('duration')?.value,this.stepFiveForm.get('startDate')?.value,0)
        this.leaseMasterDetails.leaseAmount=this.stepFiveForm.get('valuation')?.value;
        this.leaseMasterDetails.leaseDuration = this.stepFiveForm.get('duration')?.value
        this.leaseMasterDetails.leaseStartDate = new Date(startDate).toISOString().slice(0, 10)
        this.leaseMasterDetails.panneltyDuration =numberOfPenaltyDays
        this.leaseMasterDetails.installment= (monthlyInstallment)
        this.leaseMasterDetails.totalInterest =  this.monthlyInstallment.totalInterest
        this.leaseMasterDetails.totalLeaseCost= this.monthlyInstallment.totalLeaseCost
        this.leaseMasterDetails.leaseTypeKey = this.stepFiveForm.get('leaseType')?.value
        this.leaseMasterDetails.remainingCapial = this.leaseMasterDetails.leaseAmount
        this.leaseMasterDetails.remainingLeaseAmount = this.leaseMasterDetails.totalLeaseCost
        // this.leaseMasterDetails.remarks = ;
        // this.leaseMasterDetails.hasOveridden
        this.leaseMasterDetails.cashOnCustomerHand=this.monthlyInstallment.cashOnHand
        // this.leaseMasterDetails.penaltyForStartDate;
        // this.leaseMasterDetails.leaseApprovedUserKey=;
        // this.leaseMasterDetails.leaseVehicleKey;
        // this.leaseMasterDetails.leaseProcessUserKey;

        this.leaseMasterDetails.documentCharge  = this.stepFiveForm.get('documentCharge')?.value;
        this.leaseMasterDetails.visitCharge = this.stepFiveForm.get('visitCharge')?.value;
        this.leaseMasterDetails.currentOutStandingBalance=0.0;
        this.leaseMasterDetails.remainingTotalLeaseCostForLastPayment = this.monthlyInstallment.totalLeaseCost
        this.leaseMasterDetails.remainingTotalInterestForLastPayment = this.monthlyInstallment.totalInterest
        this.leaseAmountsCalculated = true;


      }
      else if(this.monthlyInstallment.leaseType === '2'){
        let  totalLeaseInterest = this.stepFiveForm.get('interest')?.value*this.stepFiveForm.get('duration')?.value;
        let totalLeaseCost = (this.stepFiveForm.get('valuation')?.value+(this.stepFiveForm.get('valuation')?.value*(totalLeaseInterest/100)))

        let monthlyInstallment = (totalLeaseCost/this.stepFiveForm.get('duration')?.value);
        let monthlyPrincipal=(this.stepFiveForm.get('valuation')?.value/this.stepFiveForm.get('duration')?.value)

        this.leaseMasterDetails.installment = monthlyInstallment
        let totalInterest:any = (totalLeaseCost-this.stepFiveForm.get('valuation')?.value);

        let numberOfPenaltyDays = Math.floor((new Date(this.stepFiveForm.get('startDate')?.value).getTime()-new Date().getTime())/(24 * 60 * 60 * 1000))

        console.log("penDays"+numberOfPenaltyDays)
        numberOfPenaltyDays = numberOfPenaltyDays<0?0:numberOfPenaltyDays;
        let numberOfLoanDays= Math.floor((new Date(new Date(this.stepFiveForm.get('startDate')?.value).getMonth()+this.stepFiveForm.get('duration')?.value).getTime()-new Date(this.stepFiveForm.get('startDate')?.value).getTime())/(24 * 60 * 60 * 1000));

        let perDayInterest:any= (totalInterest  /numberOfLoanDays).toFixed(2)

        let penaltyOnStartDate = (perDayInterest*numberOfPenaltyDays)
        this.leaseMasterDetails.panneltyForStartDate = penaltyOnStartDate;

        this.monthlyInstallment.penaltyOnStartDate = penaltyOnStartDate
        this.monthlyInstallment.cashOnHand = (this.stepFiveForm.get('valuation')?.value-this.stepFiveForm.get('documentCharge')?.value-this.stepFiveForm.get('visitCharge')?.value-this.leaseMasterDetails.panneltyForStartDate);
        this.monthlyInstallment.totalLoanCost = totalLeaseCost+penaltyOnStartDate;
        this.monthlyInstallment.totalInterest = (totalInterest +penaltyOnStartDate).toFixed(2)
        this.monthlyInstallment.totalLeaseCost =(totalLeaseCost+penaltyOnStartDate).toFixed(2);
        this.monthlyInstallment.installment = monthlyInstallment.toFixed(2)


        this.leaseMasterDetails.panneltyDuration=numberOfPenaltyDays;

        this.leaseMasterDetails.cashOnCustomerHand = Math.round(this.stepFiveForm.get('valuation')?.value-this.stepFiveForm.get('documentCharge')?.value-this.stepFiveForm.get('visitCharge')?.value-this.leaseMasterDetails.panneltyForStartDate);

        this.leaseMasterDetails.totalLeaseCost = totalLeaseCost+penaltyOnStartDate;
        this.leaseMasterDetails.totalInterest= totalInterest +penaltyOnStartDate

        this.setPaymentScheduleForLinearEqualInstallment(penaltyOnStartDate,totalLeaseCost,this.stepFiveForm.get('valuation')?.value,monthlyInstallment,monthlyPrincipal,this.stepFiveForm.get('duration')?.value,this.stepFiveForm.get('startDate')?.value,0);
        this.leaseMasterDetails.leaseAmount=this.stepFiveForm.get('valuation')?.value;
        this.leaseMasterDetails.leaseDuration = this.stepFiveForm.get('duration')?.value
        this.leaseMasterDetails.leaseStartDate = new Date(this.stepFiveForm.get('startDate')?.value).toISOString().slice(0, 10)
        // this.leaseMasterDetails.remarks = ;
        // this.leaseMasterDetails.hasOveridden
        this.leaseMasterDetails.cashOnCustomerHand=this.monthlyInstallment.cashOnHand
        // this.leaseMasterDetails.penaltyForStartDate;
        // this.leaseMasterDetails.leaseApprovedUserKey=;
        // this.leaseMasterDetails.leaseVehicleKey;

        // this.leaseMasterDetails.leaseProcessUserKey;

        this.leaseMasterDetails.documentCharge  = this.stepFiveForm.get('documentCharge')?.value;
        this.leaseMasterDetails.visitCharge = this.stepFiveForm.get('visitCharge')?.value;
        this.leaseMasterDetails.currentOutStandingBalance=  0.0;
        this.leaseMasterDetails.isLeaseClosed = 0;

        this.leaseMasterDetails.remainingTotalLeaseCostForLastPayment = this.monthlyInstallment.totalLeaseCost
        this.leaseMasterDetails.remainingTotalInterestForLastPayment = this.monthlyInstallment.totalInterest
        this.leaseAmountsCalculated = true


      }
      else if(this.monthlyInstallment.leaseType==='3'){
        let totalLeaseInterest = (this.stepFiveForm.get('valuation')?.value * this.stepFiveForm.get('interest')?.value /100)*this.stepFiveForm.get('duration')?.value //todo
        let totalLeaseCost = this.stepFiveForm.get('valuation')?.value;
        this.monthlyInstallment.installment=0;
        this.monthlyInstallment.totalLeaseCost = totalLeaseCost;
        this.monthlyInstallment.penaltyOnStartDate = 0;
        this.monthlyInstallment.numberOfPenaltyDates = 0;
        this.monthlyInstallment.cashOnHand = this.stepFiveForm.get('valuation')?.value - this.stepFiveForm.get('documentCharge')?.value - this.stepFiveForm.get('visitCharge')?.value;
        this.monthlyInstallment.totalLoanCost =  totalLeaseCost;
        this.monthlyInstallment.totalInterest =  totalLeaseInterest;
        this.leaseMasterDetails.documentCharge  = this.stepFiveForm.get('documentCharge')?.value;
        this.leaseMasterDetails.visitCharge = this.stepFiveForm.get('visitCharge')?.value;
        this.leaseMasterDetails.isLeaseClosed = 0;
        this.leaseMasterDetails.leaseStartDate = new Date(this.stepFiveForm.get('startDate')?.value).toISOString().slice(0, 10)

        this.leaseMasterDetails.cashOnCustomerHand=this.monthlyInstallment.cashOnHand
        this.leaseMasterDetails.currentOutStandingBalance=  0.0;

        this.leaseMasterDetails.installment=0.0;
        this.leaseMasterDetails.leaseAmount=this.stepFiveForm.get('valuation')?.value;
        this.leaseMasterDetails.leaseDuration = this.stepFiveForm.get('duration')?.value;
        this.leaseMasterDetails.leaseTypeKey =3;
        this.leaseMasterDetails.remainingCapial =this.leaseMasterDetails.leaseAmount;
        this.leaseMasterDetails.remainingLeaseAmount=totalLeaseCost;
        this.leaseMasterDetails.remainingTotalInterestForLastPayment = totalLeaseInterest;
        this.leaseMasterDetails.remainingTotalLeaseCostForLastPayment = totalLeaseCost;
        this.leaseMasterDetails.totalInterest=totalLeaseInterest;
        this.leaseMasterDetails.totalLeaseCost= totalLeaseCost;
        this.getRedusingBalanceInstallmentPaymentSchedule(this.stepFiveForm.get('startDate')?.value,this.stepFiveForm.get('valuation')?.value,totalLeaseInterest);
        this.leaseAmountsCalculated = true;

      }





/*





        this.monthlyInstallment.cashOnHand =
        this.stepFiveForm.get('valuation')?.value - (this.stepFiveForm.get('documentCharge')?.value + this.stepFiveForm.get('visitCharge')?.value);

        this.monthlyInstallment.leaseValuation = this.stepFiveForm.get('valuation')?.value;
        const totalInterest = this.stepFiveForm.get('valuation')?.value * this.stepFiveForm.get('duration')?.value
          * this.stepFiveForm.get('interest')?.value / 100.0;
        this.monthlyInstallment.totalLeaseCost = this.stepFiveForm.get('valuation')?.value + totalInterest;
        this.monthlyInstallment.installment = (this.monthlyInstallment.totalLeaseCost / this.stepFiveForm.get('duration')?.value).toFixed(2);
        this.monthlyInstallment.totalInterest = totalInterest;
        this.monthlyInstallment.leaseStartDate = this.stepFiveForm.get('startDate')?.value;
        this.monthlyInstallment.leaseType = this.stepFiveForm.get('leaseType')?.value;
        this.monthlyInstallment.totalDuration = this.stepFiveForm.get('duration')?.value;
        this.monthlyInstallment.interestRate = this.stepFiveForm.get('interest')?.value;

        if (this.monthlyInstallment.leaseType === '1') {
          this.leaseMasterDetails.remainingTotalLeaseCostForLastPayment = this.stepFiveForm.get('valuation')?.value + totalInterest;
          this.leaseMasterDetails.totalLeaseCost =  this.stepFiveForm.get('valuation')?.value + totalInterest;
          this.leaseMasterDetails.currentOutStandingBalance = this.stepFiveForm.get('valuation')?.value + totalInterest;
          this.leaseMasterDetails.nextPaymentDateOutStandingBalance =  this.stepFiveForm.get('valuation')?.value + totalInterest;
        } else if (this.monthlyInstallment.leaseType === '2') {
          this.leaseMasterDetails.remainingTotalLeaseCostForLastPayment = this.stepFiveForm.get('valuation')?.value;
          this.leaseMasterDetails.totalLeaseCost =  this.stepFiveForm.get('valuation')?.value;
          this.leaseMasterDetails.currentOutStandingBalance = this.stepFiveForm.get('valuation')?.value;
          this.leaseMasterDetails.nextPaymentDateOutStandingBalance =  this.stepFiveForm.get('valuation')?.value;
        }

      this.leaseMasterDetails.leaseAmount = this.stepFiveForm.get('valuation')?.value;
      this.leaseMasterDetails.annualInterestRate = this.stepFiveForm.get('interest')?.value;
      this.leaseMasterDetails.leaseDuration = this.stepFiveForm.get('duration')?.value;
      this.leaseMasterDetails.leaseStartDate = this.stepFiveForm.get('startDate')?.value;
      this.leaseMasterDetails.installment =  (this.monthlyInstallment.totalLeaseCost / this.stepFiveForm.get('duration')?.value).toFixed(2);
      this.leaseMasterDetails.totalInterest = totalInterest;

      this.leaseMasterDetails.remainingTotalInterestForLastPayment = totalInterest;
      this.leaseMasterDetails.cashOnCustomerHand = this.stepFiveForm.get('valuation')?.value - (this.stepFiveForm.get('documentCharge')?.value + this.stepFiveForm.get('visitCharge')?.value);
      this.leaseMasterDetails.totalInterestCollected = 0.0;
      this.leaseMasterDetails.leaseTypeKey = this.stepFiveForm.get('leaseType')?.value;
      this.leaseMasterDetails.documentCharge  = this.stepFiveForm.get('documentCharge')?.value;
      this.leaseMasterDetails.visitCharge = this.stepFiveForm.get('visitCharge')?.value;
      this.leaseMasterDetails.panneltyDuration = 0;
      this.leaseMasterDetails.panneltyForStartDate = 0;
      this.leaseMasterDetails.isPaymentOutDated = 0;
      this.leaseMasterDetails.nextPaymentDate = new Date(new Date(this.stepFiveForm.get('startDate')?.value)
          .setMonth(new Date(this.stepFiveForm.get('startDate')?.value).getMonth() + 1)).toISOString().slice(0, 10);
      this.leaseMasterDetails.remainingLeaseAmount  = this.stepFiveForm.get('valuation')?.value;
      this.leaseMasterDetails.remainingCapial = this.stepFiveForm.get('valuation')?.value;
      this.leaseMasterDetails.isLeaseClosed = 0;
      this.leaseMasterDetails.penaltyDurationForNextPayment = Math.floor((new Date(this.leaseMasterDetails.nextPaymentDate).getTime() -
        new Date(this.leaseMasterDetails.leaseStartDate).getTime()) / (1000 * 60 * 60 * 24));
      this.leaseMasterDetails.penaltyAmountForNextPayment =  0.0;
      this.leaseMasterDetails.lastPaidInstallmentIndex = 0;
      this.leaseMasterDetails.remainingCapitalForToday = 0.0;
      this.leaseMasterDetails.closedDateTime = null;
      this.leaseMasterDetails.closingAmount = 0.0;
      this.leaseMasterDetails.closingInterest = 0.0;
      this.leaseMasterDetails.closingCapitalAmount = 0.0;

      this.leaseAmountsCalculated = true;
      console.log(this.monthlyInstallment)

 */
    }


  }


  setPaymentScheduleForStandardEqualInstallment(penaltyOnstartDate: number, totalLeaseCost: any, valuation: any,
                                                monthlyInstallment: number, monthlyInterestAmount: number, duration: any, startDate: any,installmentIndex:any) {
    this.leaseInstallmentsDetails=[];

    if(penaltyOnstartDate>0) {
      this.leaseInstallmentsDetails.push(new LeaseInstallments(++installmentIndex, startDate, valuation, totalLeaseCost + penaltyOnstartDate, valuation, totalLeaseCost, penaltyOnstartDate, 0, penaltyOnstartDate));
    }
    for (let i=1;i<=duration;i++){
        let payementMonth=new Date(startDate).setMonth(new Date(startDate).getMonth()+i);
        let principalDiduction=monthlyInstallment-monthlyInterestAmount
        if(i==duration){
          let lastInstallment = totalLeaseCost-(monthlyInstallment*(duration-1))
          this.leaseInstallmentsDetails.push(new LeaseInstallments(i,payementMonth,valuation - ((monthlyInstallment - monthlyInterestAmount) * (i - 1)),totalLeaseCost - (monthlyInstallment * (i - 1)),valuation - ((principalDiduction * (i - 1)) + (lastInstallment - monthlyInterestAmount)),totalLeaseCost - ((monthlyInstallment * (i -1)) + lastInstallment),lastInstallment,lastInstallment - monthlyInterestAmount,monthlyInterestAmount))
        }
        else{
          this.leaseInstallmentsDetails.push(new LeaseInstallments(i,payementMonth,valuation - ((monthlyInstallment - monthlyInterestAmount) * (i -1) ),totalLeaseCost - (monthlyInstallment * (i -1)),valuation - (principalDiduction * i),totalLeaseCost - (monthlyInstallment * i),monthlyInstallment,principalDiduction,monthlyInterestAmount));
        }
    }


  }

  setPaymentScheduleForLinearEqualInstallment(penaltyOnStartDate: any, totalLeaseCost: any, valuation: any,monthlyInstallment:any,monthlyPrincipal:any,numberOfMonths:any,startDate:any,startIndex: number) {
    this.leaseInstallmentsDetails=[];
    let detail = new Map();
    detail.set("paymentDate",startDate)
    detail.set("beginingLeaseCost",totalLeaseCost+penaltyOnStartDate)
    detail.set("begininngBalance",valuation)
    detail.set("installment",penaltyOnStartDate)
    detail.set("principal",0)
    detail.set("interest",penaltyOnStartDate)
    detail.set("endingLeaseBalance",totalLeaseCost)
    detail.set("endingBalance",valuation)
    detail.set("installmentIndex",++startIndex)
    if(penaltyOnStartDate>0){
      this.leaseInstallmentsDetails.push(new LeaseInstallments(++startIndex,
        new Date(startDate),
        valuation,
        totalLeaseCost+penaltyOnStartDate,
        valuation,
        totalLeaseCost,
        penaltyOnStartDate,
        0,
        penaltyOnStartDate));
    }

    this.setPaymentScheduleForLinearEqualInstallmentSchedule(totalLeaseCost,valuation,monthlyInstallment,monthlyPrincipal,numberOfMonths,startDate,detail,startIndex)

  }
  setPaymentScheduleForLinearEqualInstallmentSchedule(beginingLeaseBlance:any,beginingBalance:any,monthlyInstallment:any,monthlyPrincipal:any,numberOfMonths:any,startDate :any,detail:any,startIndex:any){

    this.leaseInstallmentsDetails=[];

    let interestForThisMonth = monthlyInstallment-monthlyPrincipal;
    let principalDiduction= monthlyPrincipal;
    let nextMonthBeginingPrincipalBalance =  beginingBalance-monthlyPrincipal
    let nextMonthBeginingLeaseBalance = beginingLeaseBlance-monthlyInstallment
    let paymentDate=  new Date(startDate).setMonth(new Date(startDate).getMonth()+1)
    console.log(nextMonthBeginingPrincipalBalance)
    if(nextMonthBeginingPrincipalBalance>0) {

      console.log(1)
      this.leaseInstallmentsDetails.push(new LeaseInstallments(
        ++startIndex,
        new Date(paymentDate),
        beginingBalance,
        beginingLeaseBlance,
        nextMonthBeginingPrincipalBalance,
        nextMonthBeginingLeaseBalance,
        monthlyInstallment,
        principalDiduction,
        interestForThisMonth))

      this.setPaymentScheduleForLinearEqualInstallmentSchedule(nextMonthBeginingLeaseBalance, nextMonthBeginingPrincipalBalance, monthlyInstallment, monthlyPrincipal, numberOfMonths, paymentDate, detail, startIndex)
    }
    else{
      if(beginingBalance>0 && nextMonthBeginingLeaseBalance>=0){
        let nMBPB = (beginingBalance-monthlyPrincipal)<0 ? 0:beginingBalance-monthlyPrincipal
        let nMBLB = (beginingLeaseBlance-monthlyInstallment)<0 ? 0 :beginingLeaseBlance-monthlyInstallment
        this.leaseInstallmentsDetails.push(new LeaseInstallments(++startIndex,new Date(paymentDate),beginingBalance,beginingLeaseBlance,nMBPB,nMBLB,monthlyInstallment+nextMonthBeginingLeaseBalance,principalDiduction+nextMonthBeginingPrincipalBalance,interestForThisMonth))

      }
    }
  }
  getRedusingBalanceInstallmentPaymentSchedule(startDate:any,valuation:any,totalLeaseInterst:any){
    this.leaseInstallmentsDetails=[];
    this.leaseInstallmentsDetails.push(new LeaseInstallments(1,startDate,valuation,valuation,0,0,0,valuation,totalLeaseInterst));

  }
}

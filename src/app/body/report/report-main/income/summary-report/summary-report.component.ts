import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import {LeaseService} from "../../../../../service/lease.service";

@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.css']
})
export class SummaryReportComponent implements OnInit {

  @ViewChild('divToDownload') divToDownload: ElementRef | any;
  startDate: any;
  endDate: any;
  leaseSummaryData: any;
  leaseSummaryDataLoaded: boolean = false;
  totalLeaseAmountSum: number = 0;
  totalCashGivenSum: number = 0;
  totalInterestCollected: number= 0;

  constructor(private leaseService: LeaseService) {
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    this.startDate = startOfMonth.toISOString().split('T')[0];
    this.endDate = endOfMonth.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.getSummaryData();
  }

  downloadAsPDF() {
    // const doc = new jspdf();
    // const content = this.divToDownload.nativeElement.innerText;
    //
    // doc.text(content, 10, 10);
    // const pdf = doc.output('blob');
    // FileSaver.saveAs(pdf, 'output.pdf');

    const pdfElement = this.divToDownload.nativeElement;

    html2canvas(pdfElement).then((canvas) => {
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('output.pdf');
    });
  }

  getSummaryData() {
    this.leaseSummaryDataLoaded = false;
    this.leaseService.getIncomeSummaryReportData(this.startDate, this.endDate)
      .subscribe((data: any) => {
        this.leaseSummaryData = data;
        if (data.length > 0) {
          this.setSummaryCardData(data);
        }
        this.leaseSummaryDataLoaded = true;
      })
  }

  setSummaryCardData(data: any) {
    console.log(data)
    this.totalLeaseAmountSum = data.reduce((total: any, amount: any) => total + amount.leaseAmount, 0);
    this.totalCashGivenSum = data.reduce((total: any, amount: any) => total + amount.cashOnCustomerHand, 0);
    this.totalInterestCollected = data.reduce((total: any, amount: any) => total + amount.totalInterestCollected, 0);
  }
}

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {LeaseDetails, LeaseGuarantors} from "../classes/LeaseDetails";
import {Profile} from "../classes/Profile";

// const BASE_URL = 'http://localhost:8080/amarasiri';
const BASE_URL = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class LeaseService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + Profile.PROFILE_TOKEN
    })
  };

  constructor(private httpClient: HttpClient) { }

  leaseDocumentUpload(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    // Initialize headers
    let headers = new HttpHeaders();

    // Set content type header
    // Note: For file upload, setting 'Content-Type' to 'multipart/form-data' manually is not required
    // Angular’s HttpClient does this automatically based on the FormData object

    // Retrieve token and append Authorization header
    const leToken = localStorage.getItem('le_token');
    if (leToken) {
      headers = headers.append('Authorization', `Bearer ${leToken}`);
    }

    return this.httpClient.post<string>(`${BASE_URL}/leasing/document-upload`, formData, {
      headers: headers,
      responseType: 'text' as 'json'
    });
  }

  fetchAllData(openStatus: number) {
    return this.httpClient.get(`${BASE_URL}/leasing/all?open-status=${openStatus}`, this.httpOptions);
  }

  createNewLease(payload: LeaseDetails) {
    return this.httpClient.post(`${BASE_URL}/leasing/save`, payload, this.httpOptions);
  }

  calculateLeaseInstallment(leaseId: number, selectedDate: any) {
    return this.httpClient.get(`${BASE_URL}/leasing/calculate-installment?lease-id=${leaseId}&payment-received-date=${selectedDate}`, this.httpOptions)
  }

  payMonthlyInstallment(leaseId: number, interest: number, paymentDate: any, userId: number, installment: number,
                        penaltyDuration: number, penaltyAmount: any) {
    return this.httpClient.put(`${BASE_URL}/leasing/make-payment?lease-id=${leaseId}&interest=${interest}&payment-date=${paymentDate}&user-id=${userId}&installment=${installment}&penalty-duration=${penaltyDuration}&penalty-amount=${penaltyAmount}`, '', this.httpOptions);
  }

  getIncomeReportData(startDate: string, endDate: string) {
    return this.httpClient.get(`${BASE_URL}/leasing/report/income?start-date=${startDate}&end-date=${endDate}`, this.httpOptions);
  }

  getIncomeSummaryReportData( startDate: string, endDate: string ) {
    return this.httpClient.get(`${BASE_URL}/leasing/report/income/summery?start-date=${startDate}&end-date=${endDate}`, this.httpOptions);
  }

  getOutDatedPaymentsDetails() {
    return this.httpClient.get(`${BASE_URL}/leasing/report/outdated-payments`, this.httpOptions);
  }

  editLeaseGuarantorsDetails(payload: LeaseGuarantors[]) {
    return this.httpClient.put(`${BASE_URL}/leasing/guarantors/edit`, payload, this.httpOptions);
  }
  getLeaseeById(id:string){
    return this.httpClient.get(`${BASE_URL}/leasing/leasee?nic=${id}`,this.httpOptions);
  }
  removeLeaseById(id:number,status:number){
    console.log(this.httpOptions)
    return this.httpClient.put(`${BASE_URL}/leasing/delete?id=${id}&status=${status}`,'',this.httpOptions);
  }

  payInstallment(id: number, amount: number, userId: string | null){
    return this.httpClient.put(`${BASE_URL}/leasing/make-payment?lease-id=${id}&amount=${amount}&user-id=${userId}`,'',this.httpOptions);
  }

  editPersonalDetails(id:number,landNumber:any,email:any) {
    return this.httpClient.put(`${BASE_URL}/leasing/lease/personal_detail/edit?lease-id=${id}&land-number=${landNumber}&email=${email}`,'',this.httpOptions);
  }

  saveDocuments(payLoad:any) {
    return this.httpClient.post(`${BASE_URL}/leasing/lease/documents/save`,payLoad,this.httpOptions)

  }

  getLeaseMasterById(userId:any) {
    return this.httpClient.get(`${BASE_URL}/leasing/lease/active_log?id=${userId}`,this.httpOptions);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import {  Observable, throwError,BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';


import { Employees } from './employees';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiServer = "http://localhost:3000";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  constructor(private httpClient: HttpClient) { }

  create(employees:any): Observable<Employees> {
    return this.httpClient.post<Employees>(this.apiServer + '/employees/', JSON.stringify(employees), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }  
  getById(id:any): Observable<Employees> {
    return this.httpClient.get<Employees>(this.apiServer + '/employees/' + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAll(): Observable<Employees[]> {
    return this.httpClient.get<Employees[]>(this.apiServer + '/employees/')
    .pipe(
      catchError(this.errorHandler)
    )
  }

  update(id:any, employees:any): Observable<Employees> {
    return this.httpClient.put<Employees>(this.apiServer + '/employees/' + id, JSON.stringify(employees), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  delete(id:any){
    return this.httpClient.delete<Employees>(this.apiServer + '/employees/' + id, this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  errorHandler(error:any) {
     let errorMessage = '';
     if(error.error instanceof ErrorEvent) {
       // Get client-side error
       errorMessage = error.error.message;
     } else {
       // Get server-side error
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
     }
     console.log(errorMessage);
     return throwError(errorMessage);
  }

  private msg = new BehaviorSubject('');
  cMsg = this.msg.asObservable();

  changeMsg(msg: string) {
    this.msg.next(msg)
  }


}


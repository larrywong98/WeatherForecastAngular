import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private url1="http://wxynodejs.azurewebsites.net/";
  // private options="{}"
  constructor(private http:HttpClient) { }
  getReq0(url:string){
    return this.http.get(url);
  }
  getReq1(latitude:string,longtitude:string){
    return this.http.get("http://wxynodejs.azurewebsites.net/"+"?latitude="+latitude+"&longtitude="+longtitude);
  }
  getReq2(inputText:string){
    return this.http.get("http://wxynodejs.azurewebsites.net/autocomplete"+"?inputText="+inputText);
  }
  getReq3(latitude:string,longtitude:string){
    return this.http.get("http://wxynodejs.azurewebsites.net/weathermeteogram"+"?latitude="+latitude+"&longtitude="+longtitude);
  }
  getReq4(latitude:string,longtitude:string){
    return this.http.get("http://wxynodejs.azurewebsites.net/details"+"?latitude="+latitude+"&longtitude="+longtitude);
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderDto } from 'src/app/model/security/order-dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  URL = environment.URL + 'checkout';

  constructor(private httpClient: HttpClient) { }

  public checkout(orderDto: OrderDto): Observable<any> {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json;charset=UTF-8',
    //     'Access-Control-Allow-Origin': '*'
    //   })
    // };
    return this.httpClient.post<any>(this.URL, orderDto)
  }
}
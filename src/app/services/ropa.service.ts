import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ropa } from '../model/ropa';
import { Color } from '../model/color';

@Injectable({
  providedIn: 'root'
})
export class RopaService {
  URL = environment.URL + 'ropa/';
  
  constructor(private httpClient: HttpClient) { }
  

  agregarColor(id: number, color: Color): Observable<any> {
   const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.httpClient.post<Ropa>(`${this.URL}${id}/colores`, color, httpOptions).pipe(
      
      catchError((error: any) => {
        console.error(error);
        return throwError("Error al agregar el color.");
      })
    );
  }

  public buscarRopa(termino: string): Observable<Ropa[]> {
    const url = `${this.URL}buscar?termino=${termino}`;
    return this.httpClient.get<Ropa[]>(url);
  }

  public buscarRopas(query: any) {
    return this.httpClient.post(`${this.URL}buscar`, { params: query });
  }

  public filtrarRopaPorCategoria(id: number):Observable<Ropa[]> {
    return this.httpClient.get<Ropa[]>(this.URL + `por-categoria/${id}`);
  }

  public filtrarRopaPorColor(id: number):Observable<Ropa[]> {
    return this.httpClient.get<Ropa[]>(this.URL + `por-color/${id}`);
  }

  public lista():Observable<Ropa[]> {
    return this.httpClient.get<Ropa[]>(this.URL + 'lista');
  }

  public save(ropa: Ropa):Observable<any> {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json;charset=UTF-8'

    //   })
    // };
    return this.httpClient.post<any>(this.URL + 'create', ropa);
  }

  public detail(id: number):Observable<Ropa> {
    return this.httpClient.get<Ropa>(this.URL + `detail/${id}`);
  }

  public update(id: number, ropa: Ropa):Observable<any> {
    return this.httpClient.put<any>(this.URL + `update/${id}`, ropa);
  }

  public delete(id: number):Observable<any> {
    return this.httpClient.delete<any>(this.URL + `delete/${id}`);
  }
}
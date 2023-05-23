import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ropa } from '../model/ropa';
import { ImagenColor } from '../model/imagen-color';
import { ObjectMapper } from 'json-object-mapper';

@Injectable({
  providedIn: 'root'
})
export class RopaService {
  URL = environment.URL + 'ropa/';
  
  constructor(private httpClient: HttpClient) { }
  
  agregarColor(id: number, imagenColor: ImagenColor): Observable<any> {
    return this.httpClient.put(`${this.URL}${id}/imagen-color`, imagenColor);
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

  public filtrarRopaPorTalle(id: number):Observable<Ropa[]> {
    return this.httpClient.get<Ropa[]>(this.URL + `por-talle/${id}`);
  }

  public searchProductsByPriceRange(minPrice: number, maxPrice: number):Observable<Ropa[]> {
    let params = { minPrice: minPrice.toString(), maxPrice: maxPrice.toString() };
    return this.httpClient.get<Ropa[]>(this.URL + 'por-precio-rango', {params});
  }

  public lista(page: number, size: number):Observable<Ropa[]> {
    let params = { page: page.toString(), size: size.toString() };
    return this.httpClient.get<Ropa[]>(this.URL + 'lista', {params});
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
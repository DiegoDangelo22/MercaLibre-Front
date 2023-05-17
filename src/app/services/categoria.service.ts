import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Categoria } from '../model/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  URL = environment.URL + 'categoria/';

  constructor(private httpClient: HttpClient) { }

  public lista():Observable<Categoria[]> {
    return this.httpClient.get<Categoria[]>(this.URL + 'lista');
  }

  public save(categoria: Categoria):Observable<any> {
    return this.httpClient.post<any>(this.URL + 'create', categoria);
  }

  public delete(id: number):Observable<any> {
    return this.httpClient.delete<any>(this.URL + `delete/${id}`);
  }
}
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ImagenColor } from '../model/imagen-color';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Talle } from '../model/talle';

@Injectable({
  providedIn: 'root'
})
export class TalleService {
  URL = environment.URL + 'talle/';

  constructor(private httpClient: HttpClient) { }

  public lista():Observable<Talle[]> {
    return this.httpClient.get<Talle[]>(this.URL + 'lista');
  }

  public save(talle: Talle):Observable<any> {
    return this.httpClient.post<any>(this.URL + 'create', talle);
  }

  public delete(id: number):Observable<any> {
    return this.httpClient.delete<any>(this.URL + `delete/${id}`);
  }
}
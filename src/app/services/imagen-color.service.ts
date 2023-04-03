import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ImagenColor } from '../model/imagen-color';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenColorService {
  URL = environment.URL + 'ropa/';

  constructor(private httpClient: HttpClient) { }

  public lista(id: number):Observable<ImagenColor> {
    return this.httpClient.get<ImagenColor>(this.URL + `lista-rci/${id}`);
  }

  public detail(id: number):Observable<ImagenColor> {
    return this.httpClient.get<ImagenColor>(this.URL + `ropa-color-imagen/${id}`);
  }
}

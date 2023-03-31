import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Color } from '../model/color';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  URL = environment.URL + 'color/';

  constructor(private httpClient: HttpClient) { }

  public lista():Observable<Color[]> {
    return this.httpClient.get<Color[]>(this.URL + 'lista');
  }

  public save(color: Color):Observable<any> {
    return this.httpClient.post<any>(this.URL + 'create', color);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtDto } from '../../model/security/jwt-dto';
import { NuevoUsuario } from '../../model/security/nuevo-usuario';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginUsuario } from '../../model/security/login-usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  URL = environment.URL + 'auth/';

  constructor(private httpClient: HttpClient) { }

  public nuevo(nuevoUsuario: NuevoUsuario): Observable<any>{
    return this.httpClient.post<JwtDto>(this.URL + 'nuevo', nuevoUsuario)
  }
  
  public login(loginUsuario: LoginUsuario): Observable<JwtDto>{
    return this.httpClient.post<JwtDto>(this.URL + 'login', loginUsuario)
  }
}
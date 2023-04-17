import { Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUsuario } from 'src/app/model/security/login-usuario';
import { AuthService } from 'src/app/services/security/auth.service';
import { TokenService } from 'src/app/services/security/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLogged = false;
  isLogginFail = false;
  loginUsuario!: LoginUsuario;
  errMsj!: string;
  roles: string[] = [];
  formLogin: FormGroup;
  constructor(private tokenService: TokenService, private authService: AuthService, private router: Router, private formBuilder: FormBuilder)
  {
    this.formLogin=this.formBuilder.group(
      {
        nombreUsuario:['',[Validators.required]],
        password:['',[Validators.required]]
      }
    )
  }

  onLogin(): void{
    this.loginUsuario = new LoginUsuario(this.formLogin.value.nombreUsuario, this.formLogin.value.password); 
    this.authService.login(this.loginUsuario).subscribe(data =>{
        this.isLogged = true;
        this.isLogginFail = false;
        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(data.nombreUsuario);
        this.tokenService.setAuthorities(data.authorities);
        this.roles = data.authorities;
        this.router.navigate(['/products']);
      }, err =>{
        this.isLogged = false;
        this.isLogginFail = true;
        this.errMsj = err.error.mensaje;
        console.log(this.errMsj);
        if(this.errMsj == undefined) {
          this.errMsj = "Datos incorrectos";
        }
      })
  }
}
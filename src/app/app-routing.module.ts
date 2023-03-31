import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { ProductsComponent } from './components/products/products.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';

const routes: Routes = [{path:'login', component: LoginComponent},
                        {path:'products', component: ProductsComponent},
                        {path:'contact', component: ContactComponent},
                        {path:'search/:termino', component: SearchResultsComponent},
                        {path:'administration', component: AdminComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

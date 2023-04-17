import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { ProductsComponent } from './components/products/products.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

const routes: Routes = [{path:'', redirectTo:'products', pathMatch:'prefix'},
                        {path:'login', component: LoginComponent},
                        {path:'products', component: ProductsComponent},
                        {path:'contact', component: ContactComponent},
                        {path:'search/:termino', component: SearchResultsComponent},
                        {path:'details/:id', component: ProductDetailsComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

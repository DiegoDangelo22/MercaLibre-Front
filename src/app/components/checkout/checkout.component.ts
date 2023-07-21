import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { OrderDto } from 'src/app/model/security/order-dto';
import { CheckoutService } from 'src/app/services/security/checkout.service';
import { RopaService } from 'src/app/services/ropa.service';
import { loadScript } from "@paypal/paypal-js";
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartProducts: any;
  payment!: any;
  items: any[] = [];
  totalPrice: number = 0;

  constructor(public header: HeaderComponent, private checkoutService: CheckoutService, private ropaService: RopaService, private router: Router) {

    // Acá abajo es un código mio
    this.header.cartProducts.forEach((clbk:any)=> {
      console.log(this.header.cartProducts)
      this.totalPrice += clbk.precio;
      this.ropaService.detail(clbk.id).subscribe((data:any) => {
        let ropa = data;
        this.items.push({name: `${ropa.nombre}`, quantity: `${clbk.cantidad}`, description: `${ropa.descripcion}`, unit_amount: {currency_code: "USD", value: `${ropa.precio}`}})
        console.log(this.items)
        console.log(this.totalPrice)
      })
    })
  }

  ngOnInit(): void {
    // console.log(this.header.cartProducts)
    // this.doCheckout();
    this.paypalRenderer();
  }

  async paypalRenderer() {
    let paypal: any;

    try {
        paypal = await loadScript({ clientId: "AQD2-4_3an7FrIt9iiKgyxdLd2J_W3H6IwQ74AuTvOv-dTwDGLT-f_Csfj2DeI7nxPZ9t95GrPv8r8QC" });
    } catch (error) {
        console.error("failed to load the PayPal JS SDK script", error);
    }
    
    if (paypal) {
        try {
            await paypal.Buttons(
              {
                style: {
                  color: 'blue',
                  shape: 'pill'
                },
                createOrder: ()=> {
                  // This function sets up the details of the transaction, including the amount and line item details.
                  return fetch(`${environment.URL}checkout`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      intent: "CAPTURE",
                      purchase_units: [{
                        items: this.items,
                        amount: {
                          currency_code: "USD",
                          value: `${this.totalPrice}`
                        }
                      }]
                    })
                  }).then((response) => response.json())
                    .then((order) => order.id);
                },
                onApprove: (data:any) => {
                  console.log(data)
                  // This function captures the funds from the transaction.
                  return fetch(`${environment.URL}checkout/capture-paypal-order`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    orderID: data.orderID,
                    items: this.header.cartProducts
                  })
                  }).then((res) => res.json())
                    .then((details) => {
                      let jsonResponse = JSON.parse(details.body);
                      console.log(jsonResponse)
                      console.log('Transaction completed by ' + jsonResponse.payer.name.given_name)
                      localStorage.removeItem('cart-products');
                      window.location.href = 'checkout/success';
                    })
                }
              }
            ).render(".paypal-container");
        } catch (error) {
            console.error("failed to render the PayPal Buttons", error);
        }
    }
  }

  doCheckout() {
    // this.header.cartProducts.forEach(clbk=> {
    //   this.totalPrice += clbk.precio;
    //   this.ropaService.detail(clbk.id).subscribe(data => {
    //     let ropa = data;
    //     console.log(ropa)
    //     this.items.push({name: `${ropa.nombre}`, quantity: `${clbk.cantidad}`, description: `${ropa.descripcion}`, unit_amount: {currency_code: "USD", value: `${ropa.precio}`}})
    //   })
    // })

    const orderDtoJSON = [{
      "items": this.items,
      "amount": {
        "currency_code": "USD",
        "value": `${this.totalPrice}`
      }
    }]

    let orderDto = new OrderDto("CAPTURE", orderDtoJSON);
    console.log(orderDto)
    this.checkoutService.checkout(orderDto).subscribe((res:any)=> {
      this.payment = res.links.filter((e:any)=> e.rel=='approve');
    })
  }
}
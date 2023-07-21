export class OrderDto {
    intent: string;
    purchase_units: any[];

    constructor(intent: string, purchase_units: any[]) {
        this.intent = intent;
        this.purchase_units = purchase_units;
    }
}
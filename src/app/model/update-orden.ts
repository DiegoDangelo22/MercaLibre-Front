export class UpdateOrden {
    draggedOrden: number;
    targetOrden: number;

    constructor(draggedOrden: number, targetOrden: number) {
        this.draggedOrden = draggedOrden;
        this.targetOrden = targetOrden;
    }
}
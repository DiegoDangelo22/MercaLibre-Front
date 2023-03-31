export class JwtDto {
    token!: string;
    type!: string;
    nombreUsuario! : string;
    userId!: number;
    authorities!: string[];
}
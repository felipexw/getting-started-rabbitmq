import { IsDate, IsNumber, IsString } from "class-validator";

export class OrdersDto {
    @IsNumber()
    readonly total!: number;

    @IsString()
    readonly id: string;

    @IsDate()
    readonly date: Date;
}
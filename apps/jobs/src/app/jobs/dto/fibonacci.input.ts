import { IsNotEmpty, IsNumber } from 'class-validator';

export class FibonacciJobData {
  @IsNotEmpty()
  @IsNumber()
  iterations: number;
}

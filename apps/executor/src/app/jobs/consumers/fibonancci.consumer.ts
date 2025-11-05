import { Injectable, OnModuleInit } from '@nestjs/common';
import { PulsarConsumer, PulsarClient } from '@distributed-job/pulsar';
import { FibonancciJobData } from '../interfaces/fibonancci.interface';
import { iterate } from 'fibonacci';

@Injectable()
export class FibonacciConsumer
  extends PulsarConsumer<FibonancciJobData>
  implements OnModuleInit
{
  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient, 'FibonacciJob');
  }

  protected async onMessage(data: FibonancciJobData): Promise<void> {
    // console.log("fibonancci consumer received message:", data);
    // await this.acknowledge(data);
    const result = iterate(data.iterations);
    this.logger.log(result);
  }
}

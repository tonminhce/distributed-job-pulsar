import { Job } from '../decorators/job.decorator';
import { FibonacciJobData } from '../dto/fibonacci.input';
import { AbstractJob } from './abstract-job';
import { PulsarClient } from 'libs/pulsar/src/lib/pulsar.client';

@Job({
  name: 'FibonacciJob',
  description:
    'Generate a Fibonacci sequence up to a specified number and store the result to database.',
})
export class FibonacciJob extends AbstractJob<FibonacciJobData> {
  protected messageClass = FibonacciJobData;

  constructor(pulsarClient: PulsarClient) {
    super(pulsarClient);
  }
}

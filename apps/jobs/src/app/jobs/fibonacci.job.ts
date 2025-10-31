import { Job } from './decorators/job.decorator';
import { AbstractJob } from './abstract-job';

@Job({
  name: 'FibonacciJob',
  description:
    'Generate a Fibonacci sequence up to a specified number and store the result to database.',
})
export class FibonacciJob extends AbstractJob {}

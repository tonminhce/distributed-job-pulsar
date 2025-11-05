import { PulsarModule } from '@distributed-job/pulsar';
import { Module } from '@nestjs/common';
import { FibonacciConsumer } from './consumers/fibonancci.consumer';

@Module({
  imports: [PulsarModule],
  providers: [FibonacciConsumer],
})
export class JobsModule {}

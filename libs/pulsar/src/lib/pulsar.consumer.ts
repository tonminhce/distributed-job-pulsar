import { Consumer, Message } from 'pulsar-client';
import { PulsarClient } from './pulsar.client';
import { deserialize } from './serialize';
import { Logger } from '@nestjs/common';

export abstract class PulsarConsumer<T> {
  private consumer!: Consumer;
  protected readonly logger = new Logger(this.topic);
  constructor(
    private readonly pulsarClient: PulsarClient,
    private readonly topic: string
  ) {}

  async onModuleInit() {
    this.consumer = await this.pulsarClient.createConsumer(
      this.topic,
      this.listener.bind(this)
    );
  }

  private async listener(mes: Message) {
    try {
      const data = deserialize<T>(mes.getData());
      this.logger.debug(
        `Received message on topic ${this.topic}: ${JSON.stringify(data)}`
      );
      await this.onMessage(data);
    } catch (err) {
      this.logger.error(err);
    } finally {
      //tu dong acknowledge message sau khi xu ly xong
      await this.consumer.acknowledge(mes);
    }
  }

  protected async acknowledge(msg: Message) {
    await this.consumer.acknowledge(msg);
  }
  protected abstract onMessage(data: T): Promise<void>;
}

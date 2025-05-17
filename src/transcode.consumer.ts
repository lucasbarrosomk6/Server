import { Processor, Process, OnQueueActive } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('transcode')
export class TranscodeConsumer {
  private readonly logger = new Logger(TranscodeConsumer.name);

  sleep = (t) => new Promise((resolve) => setTimeout(resolve, t * 1000));

  @Process()
  async handleTranscode(job: Job<unknown>) {
    for (let i = 0; i < 100; i++) {
      await this.sleep(Math.random());
      await job.update(i);
      await job.log(`Processing job at interval ${i}`);
      this.logger.debug(`Processing job at interval ${i}`);
      if (Math.random() * 200 < 1) throw new Error(`Random error ${i}`);
    }
    return 'Done';
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}

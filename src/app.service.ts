import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class AppService {
  constructor(@InjectQueue('transcode') private transcodeQueue: Queue) {}

  getHello(): string {
    return 'Hello World!';
  }

  async transcode(userId?: string) {
    const job = await this.transcodeQueue.add(
      {
        fileName: './file.mp3',
        userId,
        timestamp: new Date().toISOString(),
      },
      {
        delay: 5000,
        removeOnComplete: true,
      },
    );

    return { 
      message: 'Transcode job added to queue',
      jobId: job.id,
      userId,
    };
  }
}

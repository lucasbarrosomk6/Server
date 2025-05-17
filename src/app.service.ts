import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class AppService {
  constructor(@InjectQueue('transcode') private transcodeQueue: Queue) {}

  getHello(): string {
    return 'Hello World!';
  }
  async transcode() {
    await this.transcodeQueue.add(
      {
        fileName: './file.mp3',
      },
      {
        delay: 5000,
      },
    );

    return 'test';
  }
}

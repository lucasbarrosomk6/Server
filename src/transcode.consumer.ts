import { Processor, Process, OnQueueActive } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { SupabaseService } from './auth/services/supabase.service';

interface TranscodeJobData {
  fileName: string;
  userId?: string;
  timestamp: string;
}

@Processor('transcode')
export class TranscodeConsumer {
  private readonly logger = new Logger(TranscodeConsumer.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  private sleep = (t: number) => new Promise((resolve) => setTimeout(resolve, t * 1000));

  @Process()
  async handleTranscode(job: Job<TranscodeJobData>) {
    const { userId, fileName, timestamp } = job.data;
    
    this.logger.log(`Starting transcode job ${job.id} for user ${userId || 'anonymous'}`);
    
    try {
      // Simulate processing
      for (let i = 0; i < 10; i++) {
        await this.sleep(0.5);
        await job.progress(i * 10);
        
        // Log progress to Supabase if user is authenticated
        if (userId) {
          await this.logToSupabase(userId, {
            jobId: job.id.toString(),
            progress: i * 10,
            status: 'processing',
            fileName,
            timestamp
          });
        }
        
        this.logger.debug(`Processing ${fileName} - ${i * 10}% complete`);
      }
      
      // Final update
      if (userId) {
        await this.logToSupabase(userId, {
          jobId: job.id.toString(),
          progress: 100,
          status: 'completed',
          fileName,
          timestamp
        });
      }
      
      return { 
        success: true, 
        message: 'Transcode completed successfully',
        jobId: job.id,
        userId,
        fileName
      };
    } catch (error) {
      this.logger.error(`Error processing job ${job.id}: ${error.message}`);
      
      if (userId) {
        await this.logToSupabase(userId, {
          jobId: job.id.toString(),
          progress: 0,
          status: 'failed',
          error: error.message,
          fileName,
          timestamp
        });
      }
      
      throw error; // Let Bull handle the retry logic
    }
  }

  private async logToSupabase(userId: string, data: any) {
    try {
      const { data: result, error } = await this.supabaseService
        .getClient()
        .from('job_logs')
        .upsert([
          {
            user_id: userId,
            job_id: data.jobId,
            status: data.status,
            progress: data.progress,
            metadata: {
              fileName: data.fileName,
              timestamp: data.timestamp,
              error: data.error
            }
          }
        ], { onConflict: 'user_id,job_id' });

      if (error) {
        this.logger.error('Failed to log to Supabase', error);
      }
      return result;
    } catch (error) {
      this.logger.error('Error logging to Supabase', error);
    }
  }

  @OnQueueActive()
  onActive(job: Job<TranscodeJobData>) {
    const { userId, fileName } = job.data;
    this.logger.log(
      `Starting job ${job.id} - File: ${fileName} - User: ${userId || 'anonymous'}`
    );
  }
}

import { FailedJobRepository } from '../repositories/failed-job.repository';
import { PrintJobRepository } from '../repositories/print-job.repository';
import { PrintJobStatus } from '../types';
import { logger } from '../../utils/logger';
export class FailedJobService {
    failRepo = new FailedJobRepository();
    jobRepo = new PrintJobRepository();
    async getFailedJobs() {
        return await this.failRepo.findAll();
    }
    async getFailedJobById(id) {
        return await this.failRepo.findById(id);
    }
    /**
     * Manually schedules a reprint job, resetting statistics and purging historical log details.
     */
    async retryFailedJob(failedId) {
        logger.info(`[FailedJobService] Manual retry requested for FailedJob ID: ${failedId}`);
        try {
            const failedJob = await this.failRepo.findById(failedId);
            if (!failedJob) {
                throw new Error('Troubleshooting failure log record not found.');
            }
            const originalJob = await this.jobRepo.findById(failedJob.print_job_id);
            if (!originalJob) {
                throw new Error('Original print spool reference was lost or deleted.');
            }
            logger.info(`[FailedJobService] Resetting spool statistics for manual dispatch: ${originalJob.id}`);
            // 1. Reset retry statistics and return status to WAITING
            await this.jobRepo.update(originalJob.id, {
                status: PrintJobStatus.WAITING,
                retry_count: 0,
                error_message: null
            });
            // 2. Delete the troubleshooting failure log record
            await this.failRepo.delete(failedId);
            logger.info(`[FailedJobService] Print spool successfully placed back in the Active queue.`);
            return { success: true, newJobId: originalJob.id };
        }
        catch (e) {
            logger.error(`[FailedJobService] Manual retry failure: ${e.message}`, e.stack);
            return { success: false, error: e.message };
        }
    }
    async purgeFailedJob(failedId) {
        logger.info(`[FailedJobService] Purging failed job troubleshooting log: ${failedId}`);
        return await this.failRepo.delete(failedId);
    }
}

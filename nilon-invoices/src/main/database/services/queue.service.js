import { PrintJobRepository } from '../repositories/print-job.repository';
import { FailedJobRepository } from '../repositories/failed-job.repository';
import { PrintJobStatus } from '../types';
import { logger } from '../../utils/logger';
export class QueueService {
    jobRepo = new PrintJobRepository();
    failRepo = new FailedJobRepository();
    async getActiveJobs() {
        return await this.jobRepo.findActive();
    }
    async getHistoryJobs(limit = 100) {
        return await this.jobRepo.findHistory(limit);
    }
    async getJobById(id) {
        return await this.jobRepo.findById(id);
    }
    async registerPrintJob(dto) {
        logger.info(`[QueueService] Enqueueing new print spool job: ${dto.id} for Order: ${dto.order_id}`);
        // Clean up any old duplicate job record
        const existing = await this.jobRepo.findById(dto.id);
        if (existing) {
            await this.jobRepo.delete(dto.id);
        }
        return await this.jobRepo.create(dto);
    }
    async updateJobStatus(id, status, errorMsg) {
        logger.info(`[QueueService] Spool job ID: ${id} status transitioning to: ${status}`);
        const updateDto = { status };
        if (errorMsg !== undefined) {
            updateDto.error_message = errorMsg;
        }
        if (status === PrintJobStatus.COMPLETED) {
            updateDto.printed_at = new Date();
            // Remove any failed job logs since it completed successfully
            await this.failRepo.deleteByPrintJobId(id);
        }
        return await this.jobRepo.update(id, updateDto);
    }
    /**
     * Safe retry queue runner incorporating exponential backoff
     */
    async handleJobFailure(jobId, errorCode, errorMessage, stackTrace) {
        const job = await this.jobRepo.findById(jobId);
        if (!job) {
            logger.error(`[QueueService] Cannot retry non-existent print job ID: ${jobId}`);
            return;
        }
        const maxRetries = job.max_retries || 5;
        const currentAttempt = job.retry_count + 1;
        logger.warn(`[QueueService] Job ${jobId} failed print query (Attempt ${currentAttempt}/${maxRetries}): ${errorMessage}`);
        if (currentAttempt < maxRetries) {
            // Update job statistics
            await this.jobRepo.update(jobId, {
                retry_count: currentAttempt,
                status: PrintJobStatus.WAITING,
                error_message: `Attempt ${currentAttempt} failed: ${errorMessage}`
            });
            // Exponential backoff strategy (delay = base * 2 ^ (attempt - 1))
            const backoffDelay = 2000 * Math.pow(2, currentAttempt - 1);
            logger.warn(`[QueueService] Scheduling automatic retry for job ${jobId} in ${backoffDelay}ms...`);
            setTimeout(async () => {
                try {
                    logger.info(`[QueueService] Executing auto-retry for job: ${jobId}`);
                    // Trigger print dispatcher logic here in the manager
                    // We can dispatch a custom internal event or let the processor handle it
                    const retryJob = await this.jobRepo.findById(jobId);
                    if (retryJob && retryJob.status === PrintJobStatus.WAITING) {
                        // Set status to PRINTING and dispatch print test or action
                        await this.jobRepo.update(jobId, { status: PrintJobStatus.PRINTING });
                        // Direct import of manager or event triggers
                        const event = new CustomEvent('db_spool_retry', { detail: { jobId } });
                        if (typeof window !== 'undefined') {
                            window.dispatchEvent(event);
                        }
                    }
                }
                catch (e) {
                    logger.error(`[QueueService] Failed to execute retry routine: ${e.message}`);
                }
            }, backoffDelay);
        }
        else {
            // Max retries exceeded. Mark as FAILED and register troubleshooting failed job
            logger.error(`[QueueService] Job ${jobId} exceeded maximum retries. Escalating to troubleshooting failed_jobs list.`);
            await this.jobRepo.update(jobId, {
                retry_count: currentAttempt,
                status: PrintJobStatus.FAILED,
                error_message: `FATAL_FAILURE: ${errorMessage}`
            });
            // Register failed job entry
            const failId = `FAIL-${Date.now()}-${Math.floor(Math.random() * 100)}`;
            await this.failRepo.create({
                id: failId,
                print_job_id: jobId,
                error_code: errorCode,
                error_message: errorMessage,
                stack_trace: stackTrace || null,
                retry_attempts: currentAttempt
            });
        }
    }
    async purgeSpool(jobId) {
        logger.info(`[QueueService] Purging print job from active spools: ${jobId}`);
        return await this.jobRepo.delete(jobId);
    }
}

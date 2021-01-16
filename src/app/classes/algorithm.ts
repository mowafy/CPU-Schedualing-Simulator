import { Job } from './job';

export abstract class Algorithm {
    protected isPreemptive: boolean = false;

    processQueue(readyQueue: Job[], currentJob: Job | undefined) {
        if (currentJob && this.isPreemptive) { readyQueue.push(currentJob); }
        readyQueue = this.orderQueue(readyQueue);
        if (currentJob && !this.isPreemptive) { readyQueue.unshift(currentJob); }
    }

    protected orderQueue(readyQueue: Job[]) {
        return readyQueue.sort((a, b) => { return a.compareByArrive(b); });
    }
}

/**
 * "First Come First Serve" is a non-preemptive algorithm.
 */
export class FirstComeFirstServe extends Algorithm { }

/**
 * "Shortest job first" is a non-preemptive algorithm.
 * Ready queue is reordered by shortest burst time job every time a new job arrives.
 */
export class ShortestJobFirst extends Algorithm {
    protected orderQueue(readyQueue: Job[]) {
        return readyQueue.sort((a, b) => { return a.compareByBurst(b); });
    }
}

/**
 * "Non-preemptive priority" is a non-preemptive algorithm.
 * Ready queue is reordered by priority job every time a new job arrives.
 */
export class Priority extends Algorithm {
    protected orderQueue(readyQueue: Job[]) {
        return readyQueue.sort((a, b) => { return a.compareByPriority(b); })
    }
}

/**
 * "Preemptive priority" is a preemptive algorithm.
 * Ready queue is reordered by priority job every time a new job arrives including the current job.
 */
export class PreemptivePriority extends Priority {
    protected isPreemptive: boolean = true;
}

/**
 * "Shortest time remaining first" is a preemptive algorithm.
 * Ready queue is reordered by shortest remaining time every time a new job arrives including the current job.
 */
export class STRF extends Algorithm {
    protected isPreemptive = true;
    protected orderQueue(readyQueue: Job[]) {
        return readyQueue.sort((a, b) => { return a.compareByRemaining(b); })
    }
}

/**
 * "Round Robin" is a non-preemptive algorithm.
 * It lets every job to be processed by the CPU for a certain time "quantum time"
 *  then replace it by the next job in the ready queue.
 * when a job finishes its quantum time it returns to the end of the ready queue.
 */
export class RoundRobin extends Algorithm {
    quantumTime: number = 2;
    private processTime: number = 0; // how much time a current job has been running

    processQueue(readyQueue: Job[], currentJob: Job) {
        if (!currentJob) { this.processTime = 0; return; }
        this.processTime++;
        if (this.processTime === this.quantumTime) {
            readyQueue.push(currentJob);
            this.processTime = 0;
        }
        else {
            readyQueue.unshift(currentJob);
        }
    }
}

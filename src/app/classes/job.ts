/**
 * represents a CPU job
 */
export class Job {
    id: number = 0;
    arrivalTime: number = 0;
    burst: number = 0;
    priority: number = 0;

    startTime: number = 0;
    finishTime: number = 0;
    remaining: number = 0;
    
    static createRandomJob(jobId: number) {
        /* random numbers limits are selected by try and error to make sure job GUI representation 
         won't exceed the program screen limits */
        let random = (max: number, min: number =1) => { return Math.floor(Math.random() * max) + min; }
        let arriveTime = jobId === 1 ? 1 : random(30, 2);
        let burst = random(12);
        let priority = random(125);
        return new Job(jobId, arriveTime, burst, priority);
    }
    constructor(jobId: number, arriveTime: number, burst: number, priority: number) {
        this.id = jobId;
        this.arrivalTime = arriveTime;
        this.burst = burst;
        this.priority = priority;
        this.remaining = this.burst;
    }

    get started(){
        return this.burst !== this.remaining;
    }
    get finished(){
        return this.remaining === 0;
    }
    get percent(){
        return Math.floor(((this.burst - this.remaining) * 100) / this.burst);
    }

    reset(){
        this.startTime = 0;
        this.finishTime = 0;
        this.remaining = this.burst;
    }
    process(simulationTime: number){
        if(this.finished){ throw new Error("Can't work on finished job"); }
        if(!this.started){ this.startTime = simulationTime; }
        this.remaining--;
        if(this.finished){ this.finishTime = simulationTime + 1; }
    }
    getTurnaroundTime(simulationTime: number){
        if(!this.started){ return 0; }
        if(this.finished){ return this.finishTime - this.arrivalTime; }
        return simulationTime + 1 - this.arrivalTime;
    }
    getWaitingTime(simulationTime: number) {
        return this.getTurnaroundTime(simulationTime) - (this.burst - this.remaining);
    }

    clone(){
        let job = new Job(this.id, this.arrivalTime, this.burst, this.priority);
        job.startTime = this.startTime;
        job.finishTime = this.finishTime;
        job.remaining = this.remaining;
        return job;
    }

    compareById(other: Job) {
        return this.id - other.id;
    }
    compareByArrive(other: Job) {
        let tmp = this.arrivalTime - other.arrivalTime;
        return tmp === 0 ? this.compareById(other) : tmp;
    }
    compareByBurst(other: Job) {
        let tmp = this.burst - other.burst;
        return tmp === 0 ? this.compareByArrive(other) : tmp;
    }
    compareByPriority(other: Job) {
        let tmp = this.priority - other.priority;
        return tmp === 0 ? this.compareByArrive(other) : tmp;
    }
    compareByRemaining(other: Job) {
        let tmp = this.remaining - other.remaining;
        return tmp === 0 ? this.compareByArrive(other) : tmp;
    }
}
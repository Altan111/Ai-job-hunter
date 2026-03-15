export interface Job {
  title: string;
  company: string;
  description: string;
  url: string;
}

export type JobStatus = 'Pending' | 'Applied' | 'Skipped';

export interface JobResult extends Job {
  id: number;
  status: JobStatus;
}

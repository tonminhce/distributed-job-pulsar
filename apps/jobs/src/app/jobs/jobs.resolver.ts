import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Job } from './models/job.model';
import { JobsService } from './jobs.service';
import { ExecuteJobInput } from './dto/job-execute.input';
import { UseGuards } from '@nestjs/common';
import { GraphQLAuthGuard } from '@distributed-job/nestjs';

@Resolver()
export class JobsResolver {
  constructor(private readonly jobsService: JobsService) {}

  @Query(() => [Job], { name: 'jobs' })
  @UseGuards(GraphQLAuthGuard)
  async getAllJobs() {
    return this.jobsService.getAllJobs();
  }

  @Mutation(() => Job)
  async executeJob(@Args('executeJobInput') executeJobInput: ExecuteJobInput) {
    return this.jobsService.executeJob(executeJobInput.name);
  }
}

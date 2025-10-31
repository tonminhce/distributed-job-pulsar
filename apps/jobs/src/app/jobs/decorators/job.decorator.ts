import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';
import { JobMetadata } from '../interfaces/job-metadata.interface';

export const JOB_METADATA_KEY = '7%TSD>-aZK2RBss';

export const Job = (jobMetadata: JobMetadata) =>
  applyDecorators(SetMetadata(JOB_METADATA_KEY, jobMetadata), Injectable());

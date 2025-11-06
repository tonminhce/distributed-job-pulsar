import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error('Exception caught:', exception);

    if (exception instanceof HttpException) {
      throw exception;
    }

    throw new HttpException(
      exception instanceof Error ? exception.message : 'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

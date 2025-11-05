import {
  Injectable,
  CanActivate,
  OnModuleInit,
  ExecutionContext,
  Inject,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, map, Observable, of } from 'rxjs';
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  AuthServiceClient,
} from 'types/proto/auth';

@Injectable()
export class GraphQLAuthGuard implements CanActivate, OnModuleInit {
  private authService: AuthServiceClient;
  private readonly logger = new Logger(GraphQLAuthGuard.name);

  constructor(@Inject(AUTH_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const token = this.getRequest(context).cookies?.Authentication;
    if (!token) {
      return false;
    }
    return this.authService.authenticate({ token }).pipe(
      map((res) => {
        this.logger.log('Authenticated user:', res);
        this.getRequest(context).user = res;
        return true;
      }),
      catchError((err) => {
        this.logger.error('Authentication error:', err);
        return of(false);
      })
    );
  }

  private getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}

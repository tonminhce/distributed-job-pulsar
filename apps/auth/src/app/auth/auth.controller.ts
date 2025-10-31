import { Controller } from '@nestjs/common';
import {
  AuthenticateRequest,
  AuthServiceController,
  AuthServiceControllerMethods,
  User,
} from 'types/proto/auth';
import { Observable } from 'rxjs';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  authenticate(
    request: AuthenticateRequest
  ): Promise<User> | Observable<User> | User {
    console.log('Authenticate request received:', request);

    return {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
    };
  }
}

import { Controller, Post, Req, Res } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginOutput } from './login.schema';
import { LoginService } from './login.service';

@Controller('authentication/login')
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Post()
  @ApiTags('Authentication')
  @ApiBasicAuth()
  @ApiResponse({
    status: 200,
    description: 'Return autherized token.',
    type: LoginOutput,
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. confirmation code required!',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Credential is required!',
  })
  @ApiBearerAuth()
  async login(@Req() request, @Res() response): Promise<void> {
    let [tel, password]: string[] = [];

    try {
      // decode tel and password from basic auth header
      const base64Credentials: string =
        request.headers.authorization.split(' ')[1];

      const credentials: string = Buffer.from(
        base64Credentials,
        'base64',
      ).toString('ascii');
      [tel, password] = credentials.split(':');
    } catch (error) {
      response.status(400).send();
      console.trace(error);
      return;
    }

    try {
      const authenticate: { status: number; message: string } =
        await this.loginService.authenticate(tel, password);

      if (authenticate.status === 200) {
        response.status(200).send(authenticate.message);
        return;
      }

      response.status(authenticate.status).send(authenticate.message);
      return;
    } catch (error) {
      console.trace(error);
      response.status(403).send();
      return;
    }
  }
}

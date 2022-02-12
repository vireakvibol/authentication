import { Controller, Post, Req, Res } from '@nestjs/common';
import { ApiBasicAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterOutput } from './register.schema';
import { RegisterService } from './register.service';

@Controller('authentication/register')
export class RegisterController {
  constructor(private registerService: RegisterService) {}

  @Post()
  @ApiTags('Authentication')
  @ApiBasicAuth()
  @ApiResponse({
    status: 200,
    description: 'Return autherized token.',
    type: RegisterOutput,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbiden! Phone number is already exisited.',
    type: RegisterOutput,
  })
  async create(@Req() request, @Res() response): Promise<void> {
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
      if ((await this.registerService.findByTel(tel)) !== null) {
        response.status(200).send();
        return;
      }

      const token: string = await this.registerService.register(tel, password);

      response.status(200).send(token);
      return;
    } catch (error) {
      console.trace(error);
      response.status(500).send();
      return;
    }
  }
}

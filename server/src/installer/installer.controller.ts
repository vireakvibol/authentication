import { Controller, Get, Put, Req, Res } from '@nestjs/common';
import {} from 'fastify';
import { InstallerService } from './installer.service';

@Controller('installer')
export class InstallerController {
  constructor(private installerService: InstallerService) {}

  @Get()
  async get(@Req() request, @Res() response): Promise<void> {
    // check if admin user is already existed
    if (await this.installerService.isInstalled()) {
      setTimeout(async (): Promise<void> => {
        response.status(404).response.send({
          statusCode: 404,
          message: 'Cannot GET ' + request.path,
          error: 'Not Found',
        });
      }, 2000);
      return;
    }

    response.header('Content-Type', 'text/html');
    response.status(200).send(await this.installerService.getInstallerHtml());
  }

  @Put()
  async put(@Req() request, @Res() response): Promise<void> {
    // check if admin user is already existed
    if (await this.installerService.isInstalled()) {
      setTimeout(async (): Promise<void> => {
        response.status(404).send({
          statusCode: 404,
          message: 'Cannot GET ' + request.path,
          error: 'Not Found',
        });
      }, 2000);
      return;
    }

    if (
      !request.body.email ||
      !request.body.password ||
      !request.body.firebase ||
      !request.body.privateKey
    ) {
      response.status(404).send();
      return;
    }

    if (
      !(await this.installerService.install(
        request.body.email,
        request.body.password,
        request.body.firebase,
        request.body.privateKey,
      ))
    ) {
      response.status(500).send();
      return;
    }

    response.status(201);
  }
}

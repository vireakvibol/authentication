import { ApiResponseProperty } from '@nestjs/swagger';

export class LoginOutput {
  @ApiResponseProperty()
  readonly token: string;
}

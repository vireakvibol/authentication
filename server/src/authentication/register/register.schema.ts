import { ApiResponseProperty } from '@nestjs/swagger';

export class RegisterOutput {
  @ApiResponseProperty()
  readonly token: string;
}

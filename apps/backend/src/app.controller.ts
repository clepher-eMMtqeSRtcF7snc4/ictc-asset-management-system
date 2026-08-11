import { Controller, Get } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller()
export class AppController {
  @Get()
  @AllowAnonymous() // Allow anonymous access
  health() {
    return true;
  }
}

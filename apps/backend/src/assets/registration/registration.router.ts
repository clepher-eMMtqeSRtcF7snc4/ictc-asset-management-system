import { Router } from 'nestjs-trpc-v2';
import { RegistrationService } from './registration.service';

@Router()
export class RegistrationRouter {
  constructor(private readonly registrationService: RegistrationService) {}
}

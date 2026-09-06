import { Injectable, Inject } from '@nestjs/common';
import { ContextOptions, TRPCContext } from 'nestjs-trpc-v2';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AppContext implements TRPCContext {
  constructor(private readonly authService: AuthService) {}

  async create(
    opts: ContextOptions,
  ): Promise<Record<string, unknown>> {
    const session = await this.authService.getSession(opts.req);
    
    return {
      req: opts.req,
      res: opts.res,
      user: session?.user || null,
      session: session?.session || null,
    };
  }
}

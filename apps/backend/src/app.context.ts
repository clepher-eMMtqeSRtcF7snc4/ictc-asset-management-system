import { Injectable } from '@nestjs/common';
import { ContextOptions, TRPCContext } from 'nestjs-trpc-v2';
import { AuthService } from '@thallesp/nestjs-better-auth';

@Injectable()
export class AppContext implements TRPCContext {
  constructor(private readonly authService: AuthService) {}

  async create(
    opts: ContextOptions,
  ): Promise<Record<string, unknown>> {
    const session = await this.authService.api.getSession({
      headers: opts.req.headers,
    });
    
    return {
      req: opts.req,
      res: opts.res,
      user: session?.user || null,
      session: session?.session || null,
    };
  }
}

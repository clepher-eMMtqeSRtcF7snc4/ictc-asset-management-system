import { Injectable } from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';
import {
  MiddlewareOptions,
  MiddlewareResponse,
  TRPCMiddleware,
} from 'nestjs-trpc-v2';

@Injectable()
export class AuthTrpcMiddleware implements TRPCMiddleware {
  constructor(private readonly authservice: AuthService) {}
  async use(
    opts: MiddlewareOptions<{ req: any; res: any }>,
  ): Promise<MiddlewareResponse> {
    const { ctx, next } = opts;

    try {
      const session = await this.authservice.api.getSession({
        headers: ctx.req.headers,
      });

      if (session?.user && session.session) {
        return next({
          ctx: {
            ...ctx,
            user: session.user,
            session: session.session,
          },
        });
      }
      throw new Error('Unauthorize');
    } catch (error) {
      throw new Error('Unauthorize');
    }
  }
}

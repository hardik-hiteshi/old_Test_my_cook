import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../../user/schema/user.schema';

interface IRequest extends Express.Request {
  user: UserDocument;
}
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: IRequest = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

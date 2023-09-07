import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import mongoose from 'mongoose';
import { SignInUserDto } from './dtos';
import { UserLogService } from '../user-log/user-log.service';
import { UserRepository } from '../user/repository/user.repository';

@Injectable()
export class AuthService {
  public constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userRepo: UserRepository,
    private ulServices: UserLogService,
  ) {}

  public async signIn(body: SignInUserDto): Promise<object> {
    const user = await this.userRepo.findOne({
      /* eslint-disable @typescript-eslint/naming-convention */
      'contact.mail': body.mail,
    });
    if (!user) throw new BadRequestException('invalid user or password');

    const pwMatched = await bcrypt.compare(body.password, user.password);
    if (!pwMatched) throw new BadRequestException('invalid user or password');

    const token = await this.signJwt(user._id);
    const data = {
      niceName: user.niceName,
      displayName: user.name.displayName,
      email: user.contact.mail,
      role: user.role,
      allowedRegions: user.allowedRegions,
      token,
    };

    return data;
  }

  public async signJwt(
    id: mongoose.Types.ObjectId,
    expiresIn?: string,
  ): Promise<string> {
    const payload = {
      sub: id,
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: expiresIn ?? '24h',
    });

    return token;
  }
}

import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(body: SignupDto): Promise<User> {
    const { name, email, password } = body;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new NotAcceptableException('user already exists');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userModel.create({
      email,
      password: hashPassword,
      name,
    });
    return newUser;
  }

  async login(body: LoginDto): Promise<{
    success: boolean;
    access_token: string;
  }> {
    const { email, password } = body;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('user not exists');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('password not match');
    }
    const access_token = await this.jwtService.signAsync({ userId: user._id });
    return { success: true, access_token };
  }
}

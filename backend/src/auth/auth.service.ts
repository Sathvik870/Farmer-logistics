import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :username', { username })
      .getOne();
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    if (!user.authorized) {
      throw new UnauthorizedException(
        'Your account is pending approval by an administrator.',
      );
    }
    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }
  async signUp(signUpDto: SignUpDto): Promise<Omit<User, 'password'>> {
    const { username, email, password, phoneNumber } = signUpDto;

    const existingUser = await this.usersRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const newUser = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    const savedUser = await this.usersRepository.save(newUser);

    const { password: _, ...user } = savedUser;
    return user;
  }
}

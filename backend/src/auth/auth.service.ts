import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { MetricsService } from '../metrics/metrics.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private metricsService: MetricsService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    console.log('Login attempt:', { email: loginDto.email, userFound: !!user, passwordMatch: user ? user.password === loginDto.password : false });

    if (!user || user.password !== loginDto.password) {
      console.log('Throwing UnauthorizedException');
      this.metricsService.incrementUserLogins(false);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.metricsService.incrementUserLogins(true);

    const access_token = await this.jwtService.signAsync({ sub: user.id, email: user.email });

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      },
      access_token,
    };
  }

  async signup(signupDto: SignupDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: signupDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = this.usersRepository.create({
      name: signupDto.name,
      email: signupDto.email,
      password: signupDto.password,
      age: signupDto.age,
    });

    const savedUser = await this.usersRepository.save(user);
    
    // Track user registration metric
    this.metricsService.incrementUserRegistrations();

    const access_token = await this.jwtService.signAsync({ sub: savedUser.id, email: savedUser.email });

    return {
      success: true,
      data: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        age: savedUser.age,
        created_at: savedUser.createdAt,
        updated_at: savedUser.updatedAt,
      },
      access_token,
    };
  }
} 
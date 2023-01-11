import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { UserEntity } from 'src/modules/user/entities/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { UserModule } from 'src/modules/user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LocalStrategy } from './strategies/local.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'

const passModule = PassportModule.register({ defaultStrategy: 'jwt' })
const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get('AUTH_SECRET'),
      signOptions: { expiresIn: '3d' },
    }
  },
})

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    passModule,
    jwtModule,
    forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [jwtModule, passModule],

})
export class AuthModule { }

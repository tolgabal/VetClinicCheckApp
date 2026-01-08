import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Animal } from './animal/animal.entity';
import { AnimalType } from './animaltype/animaltype.entity';
import { User } from './user/user.entity';
import { UserRole } from './userrole/userrole.entity';
import { Vaccine } from './vaccine/vaccine.entity';
import { AnimalModule } from './animal/animal.module';
import { AnimalTypeModule } from './animaltype/animaltype.module';
import { UserModule } from './user/user.module';
import { UserRoleModule } from './userrole/userrole.module';
import { VaccineModule } from './vaccine/vaccine.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'vet-clinic.sqlite',
      entities: [Animal, AnimalType, User, UserRole, Vaccine],
      synchronize: true,
    }),

    AnimalModule,
    AnimalTypeModule,
    UserModule,
    UserRoleModule,
    VaccineModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

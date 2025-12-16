import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt';

export class AuthService {

    constructor( 
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser (identifier: string, password: string) {

        let user;

        if(identifier.includes('@')) {
            user = await this.userService.findByEmail(identifier);
        } else {
            user = await this.userService.findByUsername(identifier);
        }

        if ( user && (await bcrypt.compare(password, user.password))) {

            const {password, ...result} = user;
            return result;

        }

        return null;

    }

    async login(user: any) {

        const payload = { 
            username: user.username, 
            sub: user.id,   // Standart JWT ID alanı
            role: user.userRole
        };

        return {
            accessToken: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.userRole 
            }
        };
    }

}
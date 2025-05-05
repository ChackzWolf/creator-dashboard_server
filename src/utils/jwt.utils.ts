import jwt from 'jsonwebtoken';
import { config } from '../configs/env.configs';
import { IJWT } from '../interfaces/IUtils/I.jwt';

export class JWT implements IJWT{

    generateToken (id: string, role:string): string {
        return jwt.sign({ id, role }, config.JWT_SECRET || 'secret', {
            expiresIn: '30d',
        });
    };

}
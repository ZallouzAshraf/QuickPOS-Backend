import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'yourSecretKey-quickpos',
  signOptions: {
    expiresIn: '60m',
  },
}));

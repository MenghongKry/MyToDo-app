import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { User } from '../users/entities/user.entity.js';
import { RefreshToken } from './entities/refresh-token.entity.js';

describe('AuthService', () => {
  let service: AuthService;
  const refreshTokens = { findOne: vi.fn(), update: vi.fn(), save: vi.fn(), create: vi.fn((x) => x) };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: getRepositoryToken(RefreshToken), useValue: refreshTokens },
        { provide: JwtService, useValue: { signAsync: vi.fn().mockResolvedValue('access') } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('rejects an unknown refresh token', async () => {
    refreshTokens.findOne.mockResolvedValue(null);
    await expect(service.refresh('nope')).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rotates a valid refresh token', async () => {
    const user = { id: 'u1', email: 'a@b.com', role: 'USER' };
    refreshTokens.findOne.mockResolvedValue({ id: 't1', revoked: false, expiresAt: new Date(Date.now() + 60_000), user });
    const result = await service.refresh('good');
    expect(refreshTokens.update).toHaveBeenCalledWith('t1', { revoked: true });
    expect(result.accessToken).toBe('access');
    expect(result.refreshToken).not.toBe('good');
  });
});

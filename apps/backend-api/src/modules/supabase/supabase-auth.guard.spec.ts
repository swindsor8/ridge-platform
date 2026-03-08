import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SupabaseAuthGuard } from './supabase-auth.guard';

const mockRequest = (authHeader?: string) => ({
  headers: { authorization: authHeader },
});

const mockContext = (req: object): ExecutionContext =>
  ({
    switchToHttp: () => ({ getRequest: () => req }),
  }) as unknown as ExecutionContext;

describe('SupabaseAuthGuard', () => {
  let guard: SupabaseAuthGuard;
  let mockSupabaseService: { db: { auth: { getUser: jest.Mock } } };

  beforeEach(() => {
    mockSupabaseService = {
      db: { auth: { getUser: jest.fn() } },
    };
    guard = new SupabaseAuthGuard(mockSupabaseService as never);
  });

  it('throws UnauthorizedException when no authorization header', async () => {
    const ctx = mockContext(mockRequest());
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException when token is invalid', async () => {
    mockSupabaseService.db.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error('invalid'),
    });
    const ctx = mockContext(mockRequest('Bearer bad-token'));
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });

  it('attaches user to request and returns true for valid token', async () => {
    const fakeUser = { id: 'user-123', email: 'test@test.com' };
    mockSupabaseService.db.auth.getUser.mockResolvedValue({
      data: { user: fakeUser },
      error: null,
    });
    const req = mockRequest('Bearer valid-token');
    const ctx = mockContext(req);
    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
    expect((req as never as { user: unknown }).user).toEqual(fakeUser);
  });
});

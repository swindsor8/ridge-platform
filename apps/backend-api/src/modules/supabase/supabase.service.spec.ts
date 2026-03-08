import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service';

describe('SupabaseService', () => {
  let service: SupabaseService;

  beforeEach(async () => {
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

    const module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [SupabaseService],
    }).compile();

    service = module.get(SupabaseService);
  });

  it('should expose a db client', () => {
    expect(service.db).toBeDefined();
  });

  it('db client should have a from() method', () => {
    expect(typeof service.db.from).toBe('function');
  });
});

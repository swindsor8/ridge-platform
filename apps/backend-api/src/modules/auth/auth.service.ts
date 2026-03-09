import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private supabase: SupabaseService) {}

  async register(dto: RegisterDto): Promise<{ id: string; email: string }> {
    // 1. Create auth user via admin API (service role key required)
    const { data: authData, error: authError } =
      await this.supabase.db.auth.admin.createUser({
        email: dto.email,
        password: dto.password,
        email_confirm: true,
      });

    if (authError) {
      if (authError.message.includes('already registered')) {
        throw new ConflictException('Email already in use');
      }
      throw new InternalServerErrorException(authError.message);
    }

    const userId = authData.user.id;

    // 2. Insert public profile row
    const { error: profileError } = await this.supabase.db
      .from('users')
      .insert({
        id: userId,
        email: dto.email,
        username: dto.username,
        display_name: dto.displayName,
        state: dto.state,
      });

    if (profileError) {
      // Roll back: delete auth user
      await this.supabase.db.auth.admin.deleteUser(userId);
      if (profileError.message.includes('unique')) {
        throw new ConflictException('Username already taken');
      }
      throw new InternalServerErrorException(profileError.message);
    }

    return { id: userId, email: dto.email };
  }

  async getProfile(userId: string) {
    const { data, error } = await this.supabase.db
      .from('users')
      .select('id, email, username, display_name, state, created_at')
      .eq('id', userId)
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }
}

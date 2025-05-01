export class CreateAdminDto {
  full_name: string;
  username: string;
  email: string;
  hashed_password: string;
  heshed_refresh_token: string;
  is_creator: boolean;
  is_active: boolean;
}

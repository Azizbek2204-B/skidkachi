import { PartialType } from "@nestjs/swagger";
import { CreateAdminDto } from "./create-admin.dto";

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  full_name: string;
  username: string;
  email: string;
  hashed_password: string;
  heshed_refresh_token: string;
  is_creator: boolean;
  is_active: boolean;
}

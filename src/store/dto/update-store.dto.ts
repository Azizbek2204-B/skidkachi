import { PartialType } from "@nestjs/swagger";
import { CreateStoreDto } from "./create-store.dto";

export class UpdateStoreDto extends PartialType(CreateStoreDto) {
  name: string;
  location: string;
  phone: string;
  owner_id: number;
  since: Date;
  region_id: number;
  district_id: number;
  address: string;
  status_id: number;
}

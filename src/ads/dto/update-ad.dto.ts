import { PartialType } from "@nestjs/swagger";
import { CreateAdDto } from "./create-ad.dto";

export class UpdateAdDto extends PartialType(CreateAdDto) {
  title: string;
  description: string;
  start_date: Date;
  target_url: string;
  placement: string;
  status: string;
  view_count: number;
}

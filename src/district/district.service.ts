import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { District } from './models/district.model';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';

@Injectable()
export class DistrictService {
  constructor(
    @InjectModel(District)
    private districtRepository: typeof District,
  ) {}

  async create(createDistrictDto: CreateDistrictDto): Promise<District> {
    return this.districtRepository.create(createDistrictDto);
  }

  async findAll(): Promise<District[]> {
    return this.districtRepository.findAll({ include: { all: true } });
  }

  async findOne(id: number): Promise<District> {
    const district = await this.districtRepository.findByPk(id, {
      include: { all: true },
    });
    if (!district) {
      throw new NotFoundException(`District with id ${id} not found`);
    }
    return district;
  }

  async update(id: number, updateDistrictDto: UpdateDistrictDto): Promise<District> {
    const district = await this.findOne(id);
    return district.update(updateDistrictDto);
  }

  async remove(id: number): Promise<void> {
    const district = await this.findOne(id);
    await district.destroy();
  }
}
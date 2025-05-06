import { Injectable } from '@nestjs/common';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Ad } from './models/ad.model';
import { AdsModule } from './ads.module';

@Injectable()
export class AdsService {
  constructor(@InjectModel(Ad) private readonly adsModel: typeof Ad) {
    
  }
  create(createAdDto: CreateAdDto) {
    return this.adsModel.create(createAdDto)
  }

  findAll() {
    return this.adsModel.findAll()
  }

  findOne(id: number) {
    return this.adsModel.findByPk(id)
  }

  update(id: number, updateAdDto: UpdateAdDto) {
    return this.adsModel.update(updateAdDto, {where:{id}})
  }

  remove(id: number) {
    return this.adsModel.destroy({where: {id}})
  }
}

import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Media } from './models/media.model';

@Injectable()
export class MediaService {
  constructor(@InjectModel(Media) private readonly mediaModel: typeof Media) {
    
  }
  create(createMediaDto: CreateMediaDto) {
    return this.mediaModel.create(createMediaDto)
  }

  findAll() {
    return this.mediaModel.findAll()
  }

  findOne(id: number) {
    return this.mediaModel.findByPk(id)
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return this.mediaModel.update(updateMediaDto, {where: {id}})
  }

  remove(id: number) {
    return this.mediaModel.destroy({where:{id}})
  }
}

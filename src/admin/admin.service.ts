import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './models/admin.model';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin) private readonly adminModel:typeof Admin) {
    
  }
  create(createAdminDto: CreateAdminDto) {
    return this.adminModel.create(createAdminDto)
  }

  findAll() {
    return this.adminModel.findAll()
  }

  findOne(id: number) {
    return this.adminModel.findByPk(id)
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return this.adminModel.update(updateAdminDto, {where:{id}})
  }

  remove(id: number) {
    return this.adminModel.destroy({where:{id}})
  }

  async findByEmail(email: string) {
    return this.adminModel.findOne({ where: { email } });
  }  
}

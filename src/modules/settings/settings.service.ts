import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateSettingsDto } from './dto/settings.dto';
import { Setting, SettingDocument } from './settings.schema';
 

@Injectable()
export class SettingsService {
  constructor(@InjectModel(Setting.name) private settingModel: Model<SettingDocument>) {}

  create(createDto: CreateSettingsDto) {
    return this.settingModel.create(createDto);
  }

  findAll() {
    return this.settingModel.find().exec();
  }

  findByUser(userId: string) {
    return this.settingModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  update(id: string, updateDto: Partial<CreateSettingsDto>) {
    return this.settingModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  delete(id: string) {
    return this.settingModel.findByIdAndDelete(id).exec();
  }
}

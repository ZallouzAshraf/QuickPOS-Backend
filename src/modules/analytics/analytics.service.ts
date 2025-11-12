import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Analytics, AnalyticsDocument } from './analytics.schema';
import { CreateAnalyticsDto } from './dto/analytics.dto';
 

@Injectable()
export class AnalyticsService {
  constructor(@InjectModel(Analytics.name) private analyticsModel: Model<AnalyticsDocument>) {}

  create(createDto: CreateAnalyticsDto) {
    return this.analyticsModel.create(createDto);
  }

  findAll() {
    return this.analyticsModel.find().exec();
  }

  findByUser(userId: string) {
    return this.analyticsModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  update(id: string, updateDto: Partial<CreateAnalyticsDto>) {
    return this.analyticsModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  delete(id: string) {
    return this.analyticsModel.findByIdAndDelete(id).exec();
  }
}

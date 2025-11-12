import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';
import { License, LicenseDocument } from './license.schema';

@Injectable()
export class LicenseService {
  constructor(@InjectModel(License.name) private readonly licenseModel: Model<LicenseDocument>) {}

  async create(createLicenseDto: CreateLicenseDto) {
    const createdLicense = new this.licenseModel(createLicenseDto);
    return createdLicense.save();
  }

  findAll() {
    return this.licenseModel.find().exec();
  }

  async findOne(id: string) {
    const license = await this.licenseModel.findById(id).exec();
    if (!license) {
      throw new NotFoundException('License not found.');
    }
    return license;
  }

  async update(id: string, updateLicenseDto: UpdateLicenseDto) {
    const updatedLicense = await this.licenseModel
      .findByIdAndUpdate(id, updateLicenseDto, { new: true })
      .exec();
    if (!updatedLicense) {
      throw new NotFoundException('License not found.');
    }
    return updatedLicense;
  }

  async remove(id: string) {
    const deletedLicense = await this.licenseModel.findByIdAndDelete(id).exec();
    if (!deletedLicense) {
      throw new NotFoundException('License not found.');
    }
    return deletedLicense;
  }
}


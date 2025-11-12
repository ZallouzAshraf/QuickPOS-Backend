import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale, SaleDocument } from './sales.schema';

@Injectable()
export class SalesService {
  constructor(@InjectModel(Sale.name) private readonly saleModel: Model<SaleDocument>) {}

  create(createSaleDto: CreateSaleDto) {
    return this.saleModel.create(createSaleDto);
  }

  findAll() {
    return this.saleModel.find().exec();
  }

  async findOne(id: string) {
    const sale = await this.saleModel.findById(id).exec();
    if (!sale) {
      throw new NotFoundException('Sale not found.');
    }
    return sale;
  }

  async update(id: string, updateSaleDto: UpdateSaleDto) {
    const updatedSale = await this.saleModel
      .findByIdAndUpdate(id, updateSaleDto, { new: true })
      .exec();
    if (!updatedSale) {
      throw new NotFoundException('Sale not found.');
    }
    return updatedSale;
  }

  async remove(id: string) {
    const deletedSale = await this.saleModel.findByIdAndDelete(id).exec();
    if (!deletedSale) {
      throw new NotFoundException('Sale not found.');
    }
    return deletedSale;
  }
}


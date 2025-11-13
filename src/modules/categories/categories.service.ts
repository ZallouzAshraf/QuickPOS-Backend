import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './categories.schema';
import { AddCategoryItemDto, CreateCategoryDto, UpdateCategoryDto, UpdateCategoryItemDto } from './dto/create-categorie.dto';
 
@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.categoryModel.find().exec();
    return categories.map(cat => ({
      ...cat.toObject(),
      categories: cat.categories.filter(item => item.isActive === true)
    })) as Category[];
  }
  

  async findByUserId(userId: string): Promise<Category> {
    const category = await this.categoryModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
    if (!category) {
      throw new NotFoundException(`Categories for user ${userId} not found`);
    }
    return category;
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return updatedCategory;
  }

  async addCategoryItem(userId: string, addCategoryItemDto: AddCategoryItemDto): Promise<Category> {
    const category = await this.categoryModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        { $push: { categories: addCategoryItemDto } },
        { new: true, upsert: true },
      )
      .exec();
    return category;
  }

  async updateCategoryItem(
    userId: string,
    categoryName: string,
    updateCategoryItemDto: UpdateCategoryItemDto,
  ): Promise<Category> {
    const updateFields: any = {};
    if (updateCategoryItemDto.name !== undefined) {
      updateFields['categories.$.name'] = updateCategoryItemDto.name;
    }
    if (updateCategoryItemDto.isActive !== undefined) {
      updateFields['categories.$.isActive'] = updateCategoryItemDto.isActive;
    }

    const updatedCategory = await this.categoryModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId), 'categories.name': categoryName },
        { $set: updateFields },
        { new: true },
      )
      .exec();

    if (!updatedCategory) {
      throw new NotFoundException(`Category ${categoryName} not found for user ${userId}`);
    }
    return updatedCategory;
  }

  async deleteCategoryItem(userId: string, categoryName: string): Promise<Category> {
    const updatedCategory = await this.categoryModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        { $pull: { categories: { name: categoryName } } },
        { new: true },
      )
      .exec();

    if (!updatedCategory) {
      throw new NotFoundException(`Categories for user ${userId} not found`);
    }
    return updatedCategory;
  }

  async delete(id: string): Promise<Category> {
    const deletedCategory = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!deletedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return deletedCategory;
  }
}
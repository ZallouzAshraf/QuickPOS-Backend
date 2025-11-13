import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './categories.controller';
import { CategoryService } from './categories.service';
import { Category, CategorySchema } from './categories.schema';
 

@Module({
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}


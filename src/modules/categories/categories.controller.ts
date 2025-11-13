import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CategoryService } from './categories.service';
import { AddCategoryItemDto, CreateCategoryDto, UpdateCategoryDto, UpdateCategoryItemDto } from './dto/create-categorie.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category successfully created.' })
  @ApiBody({ type: CreateCategoryDto })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'List of all categories.' })
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get categories by user ID' })
  @ApiParam({ name: 'userId', type: String })
  @ApiResponse({ status: 200, description: 'Categories for the specified user.' })
  async findByUserId(@Param('userId') userId: string) {
    return this.categoryService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Category details.' })
  async findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'Category successfully updated.' })
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Post('user/:userId/item')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add an item to a user category' })
  @ApiParam({ name: 'userId', type: String })
  @ApiBody({ type: AddCategoryItemDto })
  @ApiResponse({ status: 201, description: 'Item successfully added.' })
  async addCategoryItem(
    @Param('userId') userId: string,
    @Body() addCategoryItemDto: AddCategoryItemDto,
  ) {
    return this.categoryService.addCategoryItem(userId, addCategoryItemDto);
  }

  @Put('user/:userId/item/:categoryName')
  @ApiOperation({ summary: 'Update a category item by category name' })
  @ApiParam({ name: 'userId', type: String })
  @ApiParam({ name: 'categoryName', type: String })
  @ApiBody({ type: UpdateCategoryItemDto })
  @ApiResponse({ status: 200, description: 'Item successfully updated.' })
  async updateCategoryItem(
    @Param('userId') userId: string,
    @Param('categoryName') categoryName: string,
    @Body() updateCategoryItemDto: UpdateCategoryItemDto,
  ) {
    return this.categoryService.updateCategoryItem(userId, categoryName, updateCategoryItemDto);
  }

  @Delete('user/:userId/item/:categoryName')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a category item by category name' })
  @ApiParam({ name: 'userId', type: String })
  @ApiParam({ name: 'categoryName', type: String })
  @ApiResponse({ status: 204, description: 'Item successfully deleted.' })
  async deleteCategoryItem(
    @Param('userId') userId: string,
    @Param('categoryName') categoryName: string,
  ) {
    return this.categoryService.deleteCategoryItem(userId, categoryName);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Category successfully deleted.' })
  async delete(@Param('id') id: string) {
    return this.categoryService.delete(id);
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';

@ApiTags('sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a sale' })
  @ApiResponse({ status: 201, description: 'Sale created successfully.' })
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sales' })
  @ApiResponse({ status: 200, description: 'List of sales returned.' })
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sale by id' })
  @ApiResponse({ status: 200, description: 'Sale found.' })
  @ApiResponse({ status: 404, description: 'Sale not found.' })
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a sale' })
  @ApiResponse({ status: 200, description: 'Sale updated successfully.' })
  @ApiResponse({ status: 404, description: 'Sale not found.' })
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(id, updateSaleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a sale' })
  @ApiResponse({ status: 200, description: 'Sale removed successfully.' })
  @ApiResponse({ status: 404, description: 'Sale not found.' })
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}


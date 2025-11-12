import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsDto } from './dto/analytics.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new analytics record' })
  @ApiResponse({ status: 201, description: 'Analytics created successfully.' })
  create(@Body() createDto: CreateAnalyticsDto) {
    return this.analyticsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all analytics records' })
  @ApiResponse({ status: 200, description: 'List of all analytics returned.' })
  findAll() {
    return this.analyticsService.findAll();
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get analytics by user ID' })
  @ApiResponse({ status: 200, description: 'Analytics for the specified user returned.' })
  @ApiResponse({ status: 404, description: 'Analytics not found for this user.' })
  findByUser(@Param('userId') userId: string) {
    return this.analyticsService.findByUser(userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an analytics record' })
  @ApiResponse({ status: 200, description: 'Analytics updated successfully.' })
  @ApiResponse({ status: 404, description: 'Analytics not found.' })
  update(@Param('id') id: string, @Body() updateDto: Partial<CreateAnalyticsDto>) {
    return this.analyticsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an analytics record' })
  @ApiResponse({ status: 200, description: 'Analytics deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Analytics not found.' })
  delete(@Param('id') id: string) {
    return this.analyticsService.delete(id);
  }
}

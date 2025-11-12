import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsDto } from './dto/analytics.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post()
  create(@Body() createDto: CreateAnalyticsDto) {
    return this.analyticsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.analyticsService.findAll();
  }

  @Get(':userId')
  findByUser(@Param('userId') userId: string) {
    return this.analyticsService.findByUser(userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: Partial<CreateAnalyticsDto>) {
    return this.analyticsService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.analyticsService.delete(id);
  }
}

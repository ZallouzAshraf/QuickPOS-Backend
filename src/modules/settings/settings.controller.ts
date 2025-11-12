import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingsDto } from './dto/settings.dto';
 

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  create(@Body() createDto: CreateSettingsDto) {
    return this.settingsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @Get(':userId')
  findByUser(@Param('userId') userId: string) {
    return this.settingsService.findByUser(userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: Partial<CreateSettingsDto>) {
    return this.settingsService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.settingsService.delete(id);
  }
}

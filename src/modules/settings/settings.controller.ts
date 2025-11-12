import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingsDto } from './dto/settings.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new settings record' })
  @ApiResponse({ status: 201, description: 'Settings created successfully.' })
  create(@Body() createDto: CreateSettingsDto) {
    return this.settingsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all settings' })
  @ApiResponse({ status: 200, description: 'List of all settings returned.' })
  findAll() {
    return this.settingsService.findAll();
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get settings by user ID' })
  @ApiResponse({ status: 200, description: 'Settings for the specified user returned.' })
  @ApiResponse({ status: 404, description: 'Settings not found for this user.' })
  findByUser(@Param('userId') userId: string) {
    return this.settingsService.findByUser(userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a settings record' })
  @ApiResponse({ status: 200, description: 'Settings updated successfully.' })
  @ApiResponse({ status: 404, description: 'Settings not found.' })
  update(@Param('id') id: string, @Body() updateDto: Partial<CreateSettingsDto>) {
    return this.settingsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a settings record' })
  @ApiResponse({ status: 200, description: 'Settings deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Settings not found.' })
  delete(@Param('id') id: string) {
    return this.settingsService.delete(id);
  }
}

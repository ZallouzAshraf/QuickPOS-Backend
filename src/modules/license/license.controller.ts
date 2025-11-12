import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LicenseService } from './license.service';
import { CreateLicenseDto } from './dto/create-license.dto';
import { UpdateLicenseDto } from './dto/update-license.dto';

@ApiTags('licenses')
@Controller('licenses')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a license' })
  @ApiResponse({ status: 201, description: 'License created successfully.' })
  create(@Body() createLicenseDto: CreateLicenseDto) {
    return this.licenseService.create(createLicenseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all licenses' })
  @ApiResponse({ status: 200, description: 'List of licenses returned.' })
  findAll() {
    return this.licenseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a license by id' })
  @ApiResponse({ status: 200, description: 'License found.' })
  @ApiResponse({ status: 404, description: 'License not found.' })
  findOne(@Param('id') id: string) {
    return this.licenseService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a license' })
  @ApiResponse({ status: 200, description: 'License updated successfully.' })
  @ApiResponse({ status: 404, description: 'License not found.' })
  update(@Param('id') id: string, @Body() updateLicenseDto: UpdateLicenseDto) {
    return this.licenseService.update(id, updateLicenseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a license' })
  @ApiResponse({ status: 200, description: 'License removed successfully.' })
  @ApiResponse({ status: 404, description: 'License not found.' })
  remove(@Param('id') id: string) {
    return this.licenseService.remove(id);
  }
}


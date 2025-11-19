import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@ApiTags('invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une facture' })
  @ApiResponse({ status: 201, description: 'Facture créée avec succès.' })
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les factures' })
  @ApiResponse({ status: 200, description: 'Liste des factures retournée.' })
  findAll() {
    return this.invoicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une facture' })
  @ApiResponse({ status: 200, description: 'Facture trouvée.' })
  @ApiResponse({ status: 404, description: 'Facture introuvable.' })
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une facture' })
  @ApiResponse({ status: 200, description: 'Facture mise à jour.' })
  @ApiResponse({ status: 404, description: 'Facture introuvable.' })
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoicesService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une facture' })
  @ApiResponse({ status: 200, description: 'Facture supprimée.' })
  @ApiResponse({ status: 404, description: 'Facture introuvable.' })
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(id);
  }
}



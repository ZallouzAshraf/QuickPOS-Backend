import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice, InvoiceDocument, InvoiceItem } from './invoices.schema';

type InvoiceItemInput = {
  productId: string | Types.ObjectId;
  name: string;
  sku?: string;
  description?: string;
  quantity: number;
  unitPrice: number;
};

@Injectable()
export class InvoicesService {
  constructor(@InjectModel(Invoice.name) private readonly invoiceModel: Model<InvoiceDocument>) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const taxRate = createInvoiceDto.taxRate ?? 0;
    const discountRate = createInvoiceDto.discountRate ?? 0;
    const { normalizedItems, subtotal, taxAmount, discountAmount, total } = this.computeInvoiceAmounts({
      items: createInvoiceDto.items,
      taxRate,
      discountRate,
    });

    const invoiceNumber = await this.generateUniqueInvoiceNumber();

    return this.invoiceModel.create({
      ...createInvoiceDto,
      invoiceNumber,
      items: normalizedItems,
      subtotal,
      taxAmount,
      discountAmount,
      total,
      taxRate,
      discountRate,
      issuedAt: createInvoiceDto.issuedAt ?? new Date(),
    });
  }

  findAll() {
    return this.invoiceModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const invoice = await this.invoiceModel.findById(id).exec();
    if (!invoice) {
      throw new NotFoundException('Invoice not found.');
    }
    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    const invoice = await this.invoiceModel.findById(id).exec();
    if (!invoice) {
      throw new NotFoundException('Invoice not found.');
    }

    const nextTaxRate = updateInvoiceDto.taxRate ?? invoice.taxRate ?? 0;
    const nextDiscountRate = updateInvoiceDto.discountRate ?? invoice.discountRate ?? 0;

    let shouldRecomputeTotals = false;
    if (updateInvoiceDto.items) {
      shouldRecomputeTotals = true;
      const recomputed = this.computeInvoiceAmounts({
        items: updateInvoiceDto.items,
        taxRate: nextTaxRate,
        discountRate: nextDiscountRate,
      });
      invoice.items = recomputed.normalizedItems as InvoiceItem[];
      invoice.subtotal = recomputed.subtotal;
      invoice.taxAmount = recomputed.taxAmount;
      invoice.discountAmount = recomputed.discountAmount;
      invoice.total = recomputed.total;
    }

    if (!shouldRecomputeTotals && (updateInvoiceDto.taxRate !== undefined || updateInvoiceDto.discountRate !== undefined)) {
      const currentItems = invoice.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));
      const recomputed = this.computeInvoiceAmounts({
        items: currentItems,
        taxRate: nextTaxRate,
        discountRate: nextDiscountRate,
      });
      invoice.items = recomputed.normalizedItems as InvoiceItem[];
      invoice.subtotal = recomputed.subtotal;
      invoice.taxAmount = recomputed.taxAmount;
      invoice.discountAmount = recomputed.discountAmount;
      invoice.total = recomputed.total;
    }

    invoice.taxRate = nextTaxRate;
    invoice.discountRate = nextDiscountRate;

    if (updateInvoiceDto.clientId !== undefined) invoice.clientId = updateInvoiceDto.clientId as any;
    if (updateInvoiceDto.clientName !== undefined) invoice.clientName = updateInvoiceDto.clientName;
    if (updateInvoiceDto.clientEmail !== undefined) invoice.clientEmail = updateInvoiceDto.clientEmail;
    if (updateInvoiceDto.clientPhone !== undefined) invoice.clientPhone = updateInvoiceDto.clientPhone;
    if (updateInvoiceDto.clientAddress !== undefined) invoice.clientAddress = updateInvoiceDto.clientAddress;
    if (updateInvoiceDto.currency !== undefined) invoice.currency = updateInvoiceDto.currency;
    if (updateInvoiceDto.paymentMethod !== undefined) invoice.paymentMethod = updateInvoiceDto.paymentMethod;
    if (updateInvoiceDto.status !== undefined) invoice.status = updateInvoiceDto.status;
    if (updateInvoiceDto.dueDate !== undefined) invoice.dueDate = updateInvoiceDto.dueDate as any;
    if (updateInvoiceDto.issuedAt !== undefined) invoice.issuedAt = updateInvoiceDto.issuedAt as any;

    await invoice.save();
    return invoice;
  }

  async remove(id: string) {
    const invoice = await this.invoiceModel.findByIdAndDelete(id).exec();
    if (!invoice) {
      throw new NotFoundException('Invoice not found.');
    }
    return invoice;
  }

  private async generateUniqueInvoiceNumber() {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    for (let attempt = 0; attempt < 5; attempt++) {
      const randomPart = Math.floor(Math.random() * 9000 + 1000);
      const candidate = `INV-${datePart}-${randomPart}`;
      const exists = await this.invoiceModel.exists({ invoiceNumber: candidate });
      if (!exists) {
        return candidate;
      }
    }
    return `INV-${datePart}-${Date.now()}`;
  }

  private computeInvoiceAmounts({
    items,
    taxRate = 0,
    discountRate = 0,
  }: {
    items: InvoiceItemInput[];
    taxRate?: number;
    discountRate?: number;
  }) {
    const normalizedItems = items.map((item) => ({
      ...item,
      lineTotal: this.roundCurrency(item.quantity * item.unitPrice),
    }));

    const subtotal = this.roundCurrency(normalizedItems.reduce((acc, item) => acc + item.lineTotal, 0));
    const taxAmount = this.roundCurrency(subtotal * (taxRate / 100));
    const discountAmount = this.roundCurrency((subtotal + taxAmount) * (discountRate / 100));
    const total = this.roundCurrency(subtotal + taxAmount - discountAmount);

    return {
      normalizedItems,
      subtotal,
      taxAmount,
      discountAmount,
      total,
    };
  }

  private roundCurrency(value: number) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}



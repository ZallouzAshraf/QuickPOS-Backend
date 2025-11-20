import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum InvoiceStatus {
  PAID = "paid",
  PENDING = "pending",
  OVERDUE = "overdue",
}

@Schema({ _id: false, versionKey: false })
export class InvoiceItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  unitPrice: number;

  @Prop({ type: Number, required: true })
  lineTotal: number;
}

export const InvoiceItemSchema = SchemaFactory.createForClass(InvoiceItem);

@Schema({ timestamps: true, versionKey: false })
export class Invoice {
  @Prop({ unique: true, required: true })
  invoiceNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'Client' })
  clientId?: Types.ObjectId;

  @Prop()
  clientName?: string;

  @Prop()
  clientEmail?: string;

  @Prop()
  clientPhone?: string;

  @Prop()
  clientAddress?: string;

  @Prop({ type: [InvoiceItemSchema], default: [] })
  items: InvoiceItem[];

  @Prop({ required: true })
  currency: string;

  @Prop({ type: Number, default: 0 })
  taxRate: number;

  @Prop({ type: Number, default: 0 })
  discountRate: number;

  @Prop({ type: Number, required: true })
  subtotal: number;

  @Prop({ type: Number, default: 0 })
  taxAmount: number;

  @Prop({ type: Number, default: 0 })
  discountAmount: number;

  @Prop({ type: Number, required: true })
  total: number;

  @Prop({ type: String, enum: InvoiceStatus, default: InvoiceStatus.PENDING })
  status: InvoiceStatus;

  @Prop()
  paymentMethod: string;

  @Prop({ type: Date, default: Date.now })
  issuedAt: Date;

  @Prop({ type: Date })
  dueDate?: Date;
}

export type InvoiceDocument = Invoice & Document;
export const InvoiceSchema = SchemaFactory.createForClass(Invoice);



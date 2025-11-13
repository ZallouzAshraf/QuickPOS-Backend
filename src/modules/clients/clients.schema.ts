import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ClientType {
  INDIVIDUAL = 'Particulier',
  COMPANY = 'Entreprise',
}

export enum ClientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({ timestamps: true })
export class Client {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ type: String, enum: ClientType, required: true })
  type: ClientType;

  @Prop({ lowercase: true, trim: true, required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  address?: string;

  @Prop()
  city?: string;

  @Prop()
  postalCode?: string;

  @Prop()
  country?: string;

  @Prop({ type: Number, default: 0 })
  discountRate: number;

  @Prop({ type: String, enum: ClientStatus, default: ClientStatus.ACTIVE })
  status: ClientStatus;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export type ClientDocument = Client & Document;
export const ClientSchema = SchemaFactory.createForClass(Client);

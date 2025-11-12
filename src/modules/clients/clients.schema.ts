import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClientDocument = Client & Document;

export type ClientType = 'Particulier' | 'Entreprise';
export type ClientStatus = 'Actif' | 'Inactif';

@Schema({ timestamps: true })
export class Client {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String, enum: ['Particulier', 'Entreprise'], default: 'Particulier' })
  type: ClientType;

  @Prop({ required: true, unique: true })
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

  @Prop({ default: 0, min: 0, max: 100 })
  discountRate: number;

  @Prop({ type: String, enum: ['Actif', 'Inactif'], default: 'Actif' })
  status: ClientStatus;

  @Prop({ type: String, required: true })
  storeId: string;

  @Prop()
  createdBy?: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);

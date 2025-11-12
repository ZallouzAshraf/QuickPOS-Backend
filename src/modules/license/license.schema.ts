// src/modules/license/license.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LicenseDocument = License & Document;

export type LicenseStatus = 'Active' | 'Inactive' | 'Expired';

@Schema({ timestamps: true })
export class License {
  @Prop({ required: true, unique: true })
  key: string; 

  @Prop({ required: true })
  storeId: string;

  @Prop({ default: 'Active', enum: ['Active', 'Inactive', 'Expired'] })
  status: LicenseStatus;


  @Prop()
  expiresAt?: Date;

  @Prop()
  createdBy?: string;
}

export const LicenseSchema = SchemaFactory.createForClass(License);

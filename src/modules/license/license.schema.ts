import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class License {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ type: Boolean, default: false })
  active: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date })
  expiresAt: Date;
}

export type LicenseDocument = License & Document;
export const LicenseSchema = SchemaFactory.createForClass(License);

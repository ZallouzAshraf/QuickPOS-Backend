import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Setting {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, default: 'TND' })
  currency: string;

  @Prop({ type: String, default: 'fr' })
  language: string;

  @Prop({ type: String, default: 'Africa/Tunis' })
  timezone: string;

  @Prop({ type: Boolean, default: true })
  notificationsEnabled: boolean;

}

export type SettingDocument = Setting & Document;
export const SettingSchema = SchemaFactory.createForClass(Setting);

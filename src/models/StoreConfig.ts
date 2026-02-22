import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStoreConfig extends Document {
  storeName: string;
  logo?: string;
  primaryColor: string;
  whatsappNumber?: string;
  /** 'image' | 'video' – type of hero media shown on the store homepage */
  heroMediaType?: 'image' | 'video';
  /** URL of hero image or video (used when heroMediaType is set) */
  heroMediaUrl?: string;
  updatedAt: Date;
}

const StoreConfigSchema = new Schema<IStoreConfig>(
  {
    storeName: { type: String, required: true, default: 'My Store' },
    logo: { type: String },
    primaryColor: { type: String, default: '#0f172a' },
    whatsappNumber: { type: String },
    heroMediaType: { type: String, enum: ['image', 'video'] },
    heroMediaUrl: { type: String },
  },
  { timestamps: true }
);

// Single document for store settings
export const StoreConfig: Model<IStoreConfig> = mongoose.models.StoreConfig ?? mongoose.model<IStoreConfig>('StoreConfig', StoreConfigSchema);

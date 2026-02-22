import { StoreConfig } from '@/models';
import { connectDB } from '@/lib/db';
import { NotFoundError } from '@/lib/errors';
import type { StoreConfigInput } from '@/lib/validations';

export async function getStoreConfig() {
  await connectDB();
  let config = await StoreConfig.findOne().lean();
  if (!config) {
    const created = await StoreConfig.create({
      storeName: 'My Store',
      primaryColor: '#0f172a',
    });
    config = created.toObject();
  }
  return config;
}

export async function updateStoreConfig(input: StoreConfigInput) {
  await connectDB();
  let config = await StoreConfig.findOne();
  if (!config) {
    config = await StoreConfig.create({
      storeName: input.storeName ?? 'My Store',
      primaryColor: input.primaryColor ?? '#0f172a',
      logo: input.logo ?? undefined,
      whatsappNumber: input.whatsappNumber ?? undefined,
      heroMediaType: input.heroMediaType ?? undefined,
      heroMediaUrl: input.heroMediaUrl ?? undefined,
    });
  } else {
    if (input.storeName !== undefined) config.storeName = input.storeName;
    if (input.primaryColor !== undefined) config.primaryColor = input.primaryColor;
    if (input.logo !== undefined) config.logo = input.logo ?? undefined;
    if (input.whatsappNumber !== undefined) config.whatsappNumber = input.whatsappNumber ?? undefined;
    if (input.heroMediaType !== undefined) config.heroMediaType = input.heroMediaType ?? undefined;
    if (input.heroMediaUrl !== undefined) config.heroMediaUrl = input.heroMediaUrl ?? undefined;
    await config.save();
  }
  return config.toObject();
}

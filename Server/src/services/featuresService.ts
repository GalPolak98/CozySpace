import { FeaturesModel, IFeatures } from '../models/Features';

class FeaturesService {
  async getFeatures(): Promise<IFeatures | null> {
    const features = await FeaturesModel.findOne();
    return features;
  }

  async updateFeatures(featuresData: Partial<IFeatures>): Promise<IFeatures | null> {
    const features = await FeaturesModel.findOne();
    if (!features) {
      return await FeaturesModel.create(featuresData);
    }
    
    Object.assign(features, featuresData);
    await features.save();
    return features;
  }
}

export const featuresService = new FeaturesService();
import { TherapistModel, ITherapist } from '../models/Therapist';

export class TherapistService {
  async getAllActiveTherapists() {
    try {
      console.log('Fetching active therapists from database');
      
      const therapists = await TherapistModel.find()
        .select('userId personalInfo professionalInfo')
        .sort({ 'personalInfo.lastName': 1, 'personalInfo.firstName': 1 });

      console.log(`Found ${therapists.length} therapists`);
      
      // Transform database records into the format expected by the frontend
      return therapists.map(therapist => ({
        id: therapist.userId,
        label: `Dr. ${therapist.personalInfo.firstName} ${therapist.personalInfo.lastName}`,
        sublabel: `Specializes in ${therapist.professionalInfo.specialization} • ${therapist.professionalInfo.experienceLevel}`
      }));
    } catch (error) {
      console.error('Error fetching therapists:', error);
      throw error;
    }
  }

  async registerTherapist(userData: any) {
    try {
      const existingTherapist = await TherapistModel.findOne({ userId: userData.userId });
      
      if (existingTherapist) {
        const updatedTherapist = await TherapistModel.findOneAndUpdate(
          { userId: userData.userId },
          {
            personalInfo: userData.personalInfo,
            professionalInfo: userData.professionalInfo,
          },
          { new: true }
        );
        return updatedTherapist;
      }

      const therapist = new TherapistModel({
        userId: userData.userId,
        personalInfo: userData.personalInfo,
        professionalInfo: userData.professionalInfo,
      });

      await therapist.save();
      return therapist;
    } catch (error) {
      console.error('Error registering therapist:', error);
      throw error;
    }
  }
}

export const therapistService = new TherapistService();
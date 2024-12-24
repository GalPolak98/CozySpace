import { TherapistModel, ITherapist } from '../models/Therapist';

export class TherapistService {
  async getAllActiveTherapists() {
    try {
      console.log('Fetching active therapists from database');
      
      const therapists = await TherapistModel.find()
        .select('userId personalInfo professionalInfo patients')
        .sort({ 'personalInfo.lastName': 1, 'personalInfo.firstName': 1 });

      console.log(`Found ${therapists.length} therapists`);
      
      return therapists.map(therapist => ({
        id: therapist.userId,
        label: `Dr. ${therapist.personalInfo.firstName} ${therapist.personalInfo.lastName}`,
        sublabel: `Specializes in ${therapist.professionalInfo.specialization} • ${therapist.professionalInfo.experienceLevel}`,
        patientCount: therapist.patients.length
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
        patients: []
      });

      await therapist.save();
      return therapist;
    } catch (error) {
      console.error('Error registering therapist:', error);
      throw error;
    }
  }

  async getPatientsForTherapist (userId: string) {
    console.log('Getting patients for therapist:', userId);
    const therapist = await TherapistModel.findOne({ userId });
    if (!therapist) {
      throw new Error('Patient not found');
    }
    return therapist.patients;  
  }
}





export const therapistService = new TherapistService();
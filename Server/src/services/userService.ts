import { PatientModel, IPatient } from '../models/Patient';
import { UserModel, IUser } from '../models/User';
import { TherapistModel, ITherapist } from '../models/Therapist';

class UserService {
  async registerUser(userData: any) {
    const session = await UserModel.startSession();
    session.startTransaction();

    try {
      const user = new UserModel({
        userId: userData.userId,
        userType: userData.userType,
        personalInfo: userData.personalInfo,
        timestamp: userData.timestamp,
      });
      await user.save({ session });

      if (userData.userType === 'patient') {
        const therapistId = userData.patientInfo?.therapistInfo?.selectedTherapistId;
        
        const patient = new PatientModel({
          userId: userData.userId,
          personalInfo: userData.personalInfo,
          therapistInfo: {
            selectedTherapistId: therapistId || null,
            dataSharing: userData.patientInfo.therapistInfo.dataSharing
          },
          toolsPreferences: userData.patientInfo.toolsPreferences,
          timestamp: userData.timestamp
        });
        await patient.save({ session });

        if (therapistId) {
          await TherapistModel.findOneAndUpdate(
            { userId: therapistId },
            {
              $addToSet: {
                patients: {
                  userId: userData.userId,
                  fullName: `${userData.personalInfo.firstName} ${userData.personalInfo.lastName}`
                }
              }
            },
            { session }
          );
        }
      } else {
        const therapist = new TherapistModel({
          userId: userData.userId,
          personalInfo: userData.personalInfo,
          professionalInfo: userData.professionalInfo,
          patients: [],
          timestamp: userData.timestamp,
        });
        await therapist.save({ session });
      }

      await session.commitTransaction();
      return user;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async updatePatientTherapist(patientId: string, newTherapistId: string | null) {
    const session = await UserModel.startSession();
    session.startTransaction();

    try {
      const patient = await PatientModel.findOne({ userId: patientId });
      if (!patient) throw new Error('Patient not found');

      if (patient.therapistInfo.selectedTherapistId) {
        await TherapistModel.findOneAndUpdate(
          { userId: patient.therapistInfo.selectedTherapistId },
          { $pull: { patients: { userId: patientId } } },
          { session }
        );
      }

      patient.therapistInfo.selectedTherapistId = newTherapistId;
      await patient.save({ session });

      if (newTherapistId) {
        await TherapistModel.findOneAndUpdate(
          { userId: newTherapistId },
          {
            $addToSet: {
              patients: {
                userId: patientId,
                fullName: `${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`
              }
            }
          },
          { session }
        );
      }

      await session.commitTransaction();
      return patient;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getUserProfile(userId: string) {
    const user = await UserModel.findOne({ userId });
    if (!user) return null;

    let profile;
    if (user.userType === 'patient') {
      profile = await PatientModel.findOne({ userId });
    } else {
      profile = await TherapistModel.findOne({ userId });
    }

    return { user, profile };
  }
}

// Create and export a single instance
export const userService = new UserService();
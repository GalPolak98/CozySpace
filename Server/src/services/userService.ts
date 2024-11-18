import { UserModel, IUser } from '../models/User';
import { PatientModel } from '../models/Patient';
import { TherapistModel } from '../models/Therapist';

export class UserService {
  async registerUser(userData: any) {
    const session = await UserModel.startSession();
    session.startTransaction();

    try {
      // Create base user
      const user = new UserModel({
        userId: userData.userId,
        userType: userData.userType,
        personalInfo: userData.personalInfo,
        timestamp: userData.timestamp,
      });

      await user.save({ session });

      // Create type-specific profile
      if (userData.userType === 'patient') {
        const patient = new PatientModel({
          userId: userData.userId,
          personalInfo: userData.personalInfo,
          therapistInfo: userData.patientInfo.therapistInfo,
          toolsPreferences: userData.patientInfo.toolsPreferences,
          timestamp: userData.timestamp
        });
        await patient.save({ session });
      } else {
        const therapist = new TherapistModel({
          userId: userData.userId,
          personalInfo: userData.personalInfo,
          professionalInfo: userData.professionalInfo,
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

export const userService = new UserService();
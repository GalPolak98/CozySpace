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

  async saveGuidedNotes(userId: string, guidedNoteData: any) {
    const session = await PatientModel.startSession();
    session.startTransaction();

    try {

      const patient = await PatientModel.findOne({ userId }).session(session);

      if (!patient) {
        throw new Error('Patient not found');
      }

      patient.guidedNotes.push(guidedNoteData);
      await patient.save({ session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

async addGeneralNotes(userId: string, noteData: any) {
  const session = await PatientModel.startSession();
  session.startTransaction();
  try {
    const patient = await PatientModel.findOne({ userId }).session(session);
    if (!patient) {
      throw new Error('Patient not found');
    }

    patient.notes.push(noteData);
    await patient.save({ session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

async getNotesForUser(userId: string) {
  const patient = await PatientModel.findOne({ userId });
  if (!patient) {
    throw new Error('Patient not found');
  }
  return patient.notes;  // Assuming 'notes' is an array field in PatientModel
}


async updateNoteForUser(userId: string, noteId: string, noteData: any) {
  const session = await PatientModel.startSession();
  session.startTransaction();

  try {
    const patient = await PatientModel.findOne({ userId }).session(session);
    if (!patient) {
      throw new Error('Patient not found');
    }

    // Find the note by its ID
    const note = patient.notes.find(n => n._id.toString() === noteId);
    if (!note) {
      throw new Error('Note not found');
    }

    // Update the note's content
    note.content = noteData.content || note.content;
    note.timestamp = noteData.timestamp || note.timestamp; // update timestamp if provided

    await patient.save({ session });

    await session.commitTransaction();
    return note;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

async saveRecording(userId: string, recordingData: any) {
  const session = await PatientModel.startSession();
  session.startTransaction();

  try {
    const patient = await PatientModel.findOne({ userId }).session(session);
    if (!patient) {
      throw new Error('Patient not found');
    }

    patient.recordings.push(recordingData);
    await patient.save({ session });

    await session.commitTransaction();
    return { success: true, message: 'Recording saved successfully' };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

// Delete a note for a user
async deleteNoteForUser(userId: string, noteId: string) {
  const session = await PatientModel.startSession();
  session.startTransaction();

  try {
    const patient = await PatientModel.findOne({ userId }).session(session);
    if (!patient) {
      throw new Error('Patient not found');
    }

    // Find the note based on noteId (_id)
    const noteIndex = patient.notes.findIndex(note => note._id.toString() === noteId);
    if (noteIndex === -1) {
      throw new Error('Note not found');
    }

    // Remove the note from the array
    const deletedNote = patient.notes.splice(noteIndex, 1);
    await patient.save({ session });

    await session.commitTransaction();
    return deletedNote[0]; // Return the deleted note
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}


}

// Create and export a single instance
export const userService = new UserService();
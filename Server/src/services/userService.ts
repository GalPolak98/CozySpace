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

async saveNotification(userId: string, notificationData: any) {
  const session = await PatientModel.startSession();
  session.startTransaction();

  try {
    const patient = await PatientModel.findOne({ userId }).session(session);
    if (!patient) {
      throw new Error('Patient not found');
    }

    patient.notifications.push(notificationData);
    await patient.save({ session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

async updateNotificationTappedStatus(userId: string, expoNotificationId: string, tapped: boolean) {
  const session = await PatientModel.startSession();
  session.startTransaction();

  try {
    const patient = await PatientModel.findOne({ userId }).session(session);

    if (!patient) {
      throw new Error('Patient not found');
    }

    console.log('Looking for notification ID:', expoNotificationId);
    console.log('Available notifications:', patient.notifications.map(n => ({
      id: n.expoNotificationId,
      tapped: n.tapped
    })));

    // Find the notification using the expoNotificationId
    const notificationIndex = patient.notifications.findIndex(
      notification => notification.expoNotificationId?.toString() === expoNotificationId
    );
    
    if (notificationIndex === -1) {
      throw new Error(`Notification with ID ${expoNotificationId} not found`);
    }

    // Update the notification
    patient.notifications[notificationIndex].tapped = tapped;
    await patient.save({ session });

    await session.commitTransaction();
    return { success: true, message: 'Notification updated successfully' };
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

export const userService = new UserService();
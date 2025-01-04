import { PatientModel } from '../models/Patient';
import { UserModel } from '../models/User';
import { TherapistModel } from '../models/Therapist';
import mongoose from 'mongoose';
import { DassResponse, DassAnalysis, SCALE_MAPPINGS, SEVERITY_THRESHOLDS, ScaleScores, ScaleSeverity } from '../types/dass';

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
  return patient.notes;  
}


async updateNoteForUser(userId: string, noteId: string, noteData: any) {
  const session = await PatientModel.startSession();
  session.startTransaction();

  try {
    const patient = await PatientModel.findOne({ userId }).session(session);
    if (!patient) {
      throw new Error('Patient not found');
    }

    const note = patient.notes.find(n => n._id.toString() === noteId);
    if (!note) {
      throw new Error('Note not found');
    }

    note.content = noteData.content || note.content;
    note.timestamp = noteData.timestamp || note.timestamp; 

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

async getNotificationsForUser(userId: string) {
  const patient = await PatientModel.findOne({ userId });
  if (!patient) {
    throw new Error('Patient not found');
  }
  return patient.notifications;  
}


async getRecordingsForUser(userId: string) {
  const patient = await PatientModel.findOne({ userId });
  if (!patient) {
    throw new Error('Patient not found');
  }
  return patient.recordings;  
}

async getGuidedNotesForUser(userId: string) {
  const patient = await PatientModel.findOne({ userId });
  if (!patient) {
    throw new Error('Patient not found');
  }
  return patient.guidedNotes;  
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

    const noteIndex = patient.notes.findIndex(note => note._id.toString() === noteId);
    if (noteIndex === -1) {
      throw new Error('Note not found');
    }

    const deletedNote = patient.notes.splice(noteIndex, 1);
    await patient.save({ session });

    await session.commitTransaction();
    return deletedNote[0]; 
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

async updatePatientPreferences(userId: string, updateData: {
  therapistInfo?: {
    selectedTherapistId: string | null;
    dataSharing: {
      anxietyTracking: boolean;
      personalDocumentation: boolean;
    };
  };
  toolsPreferences?: any;
}) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('Updating preferences for patient:', userId);
    console.log('Update data:', updateData);

    const patient = await PatientModel.findOne({ userId }).session(session);
    if (!patient) {
      throw new Error('Patient not found');
    }

    const oldTherapistId = patient.therapistInfo.selectedTherapistId;
    const newTherapistId = updateData.therapistInfo?.selectedTherapistId;

    console.log('Old therapist:', oldTherapistId);
    console.log('New therapist:', newTherapistId);

    if (oldTherapistId !== newTherapistId) {
      if (oldTherapistId && oldTherapistId !== 'none') {
          await TherapistModel.findOneAndUpdate(
          { userId: oldTherapistId },
          { 
            $pull: { 
              patients: { 
                userId: userId  
              } 
            } 
          },
          { session, new: true }
        );
      }

      if (newTherapistId && newTherapistId !== 'none') {
        const fullName = `${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`;
        
        await TherapistModel.findOneAndUpdate(
          { userId: newTherapistId },
          { 
            $addToSet: { 
              patients: {
                userId: userId,  
                fullName: fullName
              } 
            } 
          },
          { session, new: true }
        );
      }
    }

    if (updateData.therapistInfo) {
      patient.therapistInfo = updateData.therapistInfo;
    }
    if (updateData.toolsPreferences) {
      patient.toolsPreferences = updateData.toolsPreferences;
    }

    await patient.save({ session });
    await session.commitTransaction();
    
    return patient;
  } catch (error) {
    await session.abortTransaction();
    console.error('Update patient preferences error:', error);
    throw error;
  } finally {
    session.endSession();
  }
}


async saveBreathingSession(userId: string, sessionData: {
  timestamp: string;
  durationSec: number;
  patternType: string;
  completed: boolean;
}) {
  const session = await PatientModel.startSession();
  session.startTransaction();

  try {
    const patient = await PatientModel.findOne({ userId }).session(session);
    if (!patient) {
      throw new Error('Patient not found');
    }

    patient.breathingSessions.push(sessionData);
    await patient.save({ session });

    await session.commitTransaction();
    return { success: true, message: 'Breathing session saved successfully' };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

async getBreathingSessions(userId: string) {
  const patient = await PatientModel.findOne({ userId });
  if (!patient) {
    throw new Error('Patient not found');
  }
  return patient.breathingSessions;
}

async getAllPatients() {
  const session = await UserModel.startSession();
  session.startTransaction();

  try {
    const patients = await PatientModel.find({}, {
      'userId': 1,
      'personalInfo.firstName': 1,
      'personalInfo.lastName': 1,
      'personalInfo.email': 1
    });

    await session.commitTransaction();
    return patients;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

private calculateScaleScore(answers: { questionId: number; score: number }[], scaleQuestions: number[]): number {
  return scaleQuestions.reduce((sum, questionId) => {
    const answer = answers.find(a => a.questionId === questionId);
    return sum + (answer?.score || 0);
  }, 0);
}

private determineScaleSeverity(score: number, thresholds: typeof SEVERITY_THRESHOLDS.depression): string {
  if (score <= thresholds.normal[1]) return 'Normal';
  if (score <= thresholds.mild[1]) return 'Mild';
  if (score <= thresholds.moderate[1]) return 'Moderate';
  if (score <= thresholds.severe[1]) return 'Severe';
  return 'Extremely Severe';
}

private analyzeDassResponse(responseData: DassResponse): DassAnalysis {
  const scaleScores: ScaleScores = {
    depression: this.calculateScaleScore(responseData.answers, SCALE_MAPPINGS.depression),
    anxiety: this.calculateScaleScore(responseData.answers, SCALE_MAPPINGS.anxiety),
    stress: this.calculateScaleScore(responseData.answers, SCALE_MAPPINGS.stress)
  };

  const severity: ScaleSeverity = {
    depression: this.determineScaleSeverity(scaleScores.depression, SEVERITY_THRESHOLDS.depression),
    anxiety: this.determineScaleSeverity(scaleScores.anxiety, SEVERITY_THRESHOLDS.anxiety),
    stress: this.determineScaleSeverity(scaleScores.stress, SEVERITY_THRESHOLDS.stress)
  };

  return { scaleScores, severity };
}

async saveDassResponse(userId: string, responseData: DassResponse) {
  const session = await PatientModel.startSession();
  session.startTransaction();

  try {
    const patient = await PatientModel.findOne({ userId }).session(session);
    if (!patient) {
      throw new Error('Patient not found');
    }

    const analysis = this.analyzeDassResponse(responseData);

    const enrichedResponse: DassResponse = {
      ...responseData,
      analysis
    };

    patient.dassResponses.push(enrichedResponse);
    await patient.save({ session });

    await session.commitTransaction();
    return { 
      success: true, 
      message: 'DASS response saved successfully',
      analysis 
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

async getDassResponsesForUser(userId: string) {
  try {
    const patient = await PatientModel.findOne({ userId });
    if (!patient) {
      return null;
    }

    return patient.dassResponses;
  } catch (error) {
    throw error;
  }
}

async getLatestDassResponse(userId: string) {
  try {
    const patient = await PatientModel.findOne({ userId });
    if (!patient || !patient.dassResponses.length) {
      return null;
    }

    return patient.dassResponses[patient.dassResponses.length - 1];
  } catch (error) {
    throw error;
  }
}

async getDassAnalyticsSummary(userId: string) {
  try {
    const patient = await PatientModel.findOne({ userId });
    if (!patient || !patient.dassResponses.length) {
      return null;
    }

    const responses = patient.dassResponses;
    const latestResponse = responses[responses.length - 1];

    const trends = {
      depression: this.calculateTrend(responses, 'depression'),
      anxiety: this.calculateTrend(responses, 'anxiety'),
      stress: this.calculateTrend(responses, 'stress')
    };

    return {
      latestAnalysis: latestResponse.analysis,
      responseCount: responses.length,
      trends,
      lastUpdated: latestResponse.timestamp
    };
  } catch (error) {
    throw error;
  }
}

private calculateTrend(responses: DassResponse[], scale: keyof ScaleScores): 'increasing' | 'decreasing' | 'stable' {
  if (responses.length < 2) return 'stable';

  const latest = responses[responses.length - 1].analysis?.scaleScores[scale] || 0;
  const previous = responses[responses.length - 2].analysis?.scaleScores[scale] || 0;

  if (latest > previous) return 'increasing';
  if (latest < previous) return 'decreasing';
  return 'stable';
}
}

export const userService = new UserService();
import { RequestHandler } from 'express';
import { userService } from '../services/userService';
import { PatientModel } from '../models/Patient';
import { DassResponse } from '../types/dass';

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile: RequestHandler = async (req, res, next) => {
  try {
    const profile = await userService.getUserProfile(req.params.userId);
    if (!profile) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

export const updatePatientTherapist: RequestHandler = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { therapistId } = req.body;
    
    const updatedPatient = await userService.updatePatientTherapist(patientId, therapistId);
    res.json({ success: true, patient: updatedPatient });
  } catch (error) {
    next(error);
  }
};

export const saveGuidedNotes: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const guidedNoteData = req.body;

    await userService.saveGuidedNotes(userId, guidedNoteData);

    res.status(200).json({ success: true, message: 'Guided note saved successfully.' });
  } catch (error) {
    return next(error);
  }
};

export const addNote: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const noteData = req.body;

    await userService.addGeneralNotes(userId, noteData);

    res.status(200).json({ success: true, message: 'Note added successfully.' });
  } catch (error) {
    return next(error);
  }
};

export const updateNote: RequestHandler = async (req, res, next) => {
  try {
    const { userId, noteId } = req.params;
    const noteData = req.body;

    const updatedNote = await userService.updateNoteForUser(userId, noteId, noteData);

    if (!updatedNote) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    return next(error);
  }
};

export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const notes = await userService.getNotesForUser(userId);

    if (!notes) {
      res.status(404).json({ error: 'No notes found for this user' });
      return;
    }

    res.status(200).json({ success: true, notes });
  } catch (error) {
    return next(error);
  }
};


export const getNotification: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Call the userService to get the notes for the user
    const notification = await userService.getNotificationsForUser(userId);
    if (!notification) {
      res.status(404).json({ error: 'No notifications found for this user' });
      return;
    }
    console.log(notification, 'Notification');
    res.status(200).json({ success: true, notification });
  } catch (error) {
    return next(error);
  }
};

export const getGuidedNotes: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Call the userService to get the notes for the user
    const notes = await userService.getGuidedNotesForUser(userId);

    if (!notes) {
      res.status(404).json({ error: 'No notes found for this user' });
      return;
    }

    res.status(200).json({ success: true, notes });
  } catch (error) {
    return next(error);
  }
};

export const getRecordings: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Call the userService to get the notes for the user
    const record = await userService.getRecordingsForUser(userId);

    if (!record) {
      res.status(404).json({ error: 'No records found for this user' });
      return;
    }

    res.status(200).json({ success: true, record });
  } catch (error) {
    return next(error);
  }
};

export const saveRecording: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const recordingData = req.body;

    const result = await userService.saveRecording(userId, recordingData);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  try {
    const { userId, noteId } = req.params;
    const deletedNote = await userService.deleteNoteForUser(userId, noteId);

    if (!deletedNote) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

export const saveNotification: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const notificationData = req.body;

    const result = await userService.saveNotification(userId, notificationData);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateNotificationTappedStatus: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;
    let { expoNotificationId } = req.params;
    const { tapped } = req.body;


    await userService.updateNotificationTappedStatus(userId, expoNotificationId, tapped);
    res.status(200).json({ success: true, message: 'Notification updated successfully' });
  } catch (error) {
    next(error);
  }
};


export const updateUserPreferences: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { therapistInfo, toolsPreferences } = req.body;

    const updatedPatient = await userService.updatePatientPreferences(userId, {
      therapistInfo,
      toolsPreferences
    });

    res.json({ success: true, patient: updatedPatient });
  } catch (error) {
    console.error('Controller error:', error);
    next(error);
  }
};

export const saveBreathingSession: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const sessionData = req.body;

    const result = await userService.saveBreathingSession(userId, sessionData);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getBreathingSessions: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const sessions = await userService.getBreathingSessions(userId);
    res.status(200).json({ success: true, sessions });
  } catch (error) {
    next(error);
  }
};

export const getAllPatients: RequestHandler = async (req, res, next) => {
  try {
    const patients = await userService.getAllPatients();
    res.status(200).json({ success: true, patients });
  } catch (error) {
    next(error);
  }
};

export const saveDassResponse: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const responseData: DassResponse = {
      userId,
      ...req.body
    };

    const result = await userService.saveDassResponse(userId, responseData);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getDassResponses: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const responses = await userService.getDassResponsesForUser(userId);
    
    if (!responses) {
      res.status(404).json({ error: 'No DASS responses found for this user' });
      return;
    }

    const sortedResponses = responses.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    res.status(200).json({ 
      success: true, 
      responses: sortedResponses
    });
  } catch (error) {
    next(error);
  }
};
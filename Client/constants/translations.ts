type GenderSpecificText = {
  male: string;
  female: string;
  default: string;
};

export interface TranslationType {
  [key: string]: any;
}

export const translations = {
    en: {
      translation: {
        languageName: 'English',
        languageNameInNative: 'English',
        common: {
          welcome: 'Welcome',
          settings: 'Settings',
          language: 'Language',
          next: 'Next',
          skip: 'Skip',
          getStarted: 'Get Started',
          logout: 'Logout',
          cancel: 'Cancel',
          save: 'Save',
          delete: 'Delete',
          submit: 'Submit',
          error: 'Error',
          success: 'Success',
          logoutConfirm: 'Are you sure you want to logout?',
          logoutError: 'Failed to logout. Please try again.',
          enabled: 'Enabled',
          enable: 'Enable',
          back: 'Back',
          continue: 'Continue',
          complete: 'Complete',
          typing: 'typing',
          typeMessage: "Type your message...",
          paste: "Paste",
          copy: 'copy',
          inputOptions: "Input Options",
          select: "Select",
          noSharedInfo: "This patient is not sharing any information with you at the moment.",
          selectPatientMessage: "Select a patient to track their information",
        },
        onboarding: {
          welcome: {
            title: 'Welcome to CozySpace',
            description: 'Your personal companion for finding peace and comfort in daily life.',
          },
          support: {
            title: 'Real-Time Support',
            description: 'Access guided breathing exercises and calming techniques whenever you need a moment of peace.',
          },
          track: {
            title: 'Track Your Journey',
            description: 'Monitor your well-being and discover patterns to build better self-care routines.',
          },
          connect: {
            title: 'Connect with Care',
            description: 'Safely share your progress with your wellness professional and build a stronger support system.',
          },
        },
        auth: {
            welcomeBack: 'Welcome Back!',
            createAccount: 'Create Account',
            signInContinue: 'Sign in to continue',
            beginJourney: 'Begin your journey with us',
            emailPlaceholder: 'Email Address',
            passwordPlaceholder: 'Password',
            confirmPasswordPlaceholder: 'Confirm Password',
            signIn: 'Sign In',
            noAccount: "Don't have an account? Sign Up",
            haveAccount: 'Already have an account? Sign In',
            termsNotice: 'By continuing, you agree to our Terms of Service and Privacy Policy',
            authError: "Authentication error. Please try signing in again.",
          },
          reports: {
            averageAnxietyIntensity: 'Average Anxiety Intensity',
            averageEpisodeDuration: 'Average Episode Duration',
            notesCreated: 'Notes Created',
            anxietyEvents: 'Anxiety Events',
            dateRange: 'Date Range',
            change: 'Edit',
            weeklyAnxietyLevels: 'Anxiety Levels',
            selectStartDate: 'Select Start Date',
            selectEndtDate: 'Select End Date'
          },
          information:{
            recordings: 'Recordings',
            notes: 'Notes',
            patientInformation: 'Patient Information',
            description: 'Access and manage your medical information'
          },
          errors: {
            invalidEmail: 'Please enter a valid email address',
            userDisabled: 'This account has been disabled',
            userNotFound: 'No account found with this email',
            wrongPassword: 'Incorrect email or password',
            emailInUse: 'An account already exists with this email',
            weakPassword: 'Password must be at least 6 characters',
            networkError: 'Network error. Please check your connection',
            tooManyRequests: 'Too many attempts. Please try again later',
            operationNotAllowed: 'This operation is not allowed',
            invalidCredentials: 'Invalid login credentials',
            invalidPassword: 'Invalid password',
            missingPassword: 'Please enter a password',
            missingEmail: 'Please enter an email address',
            unexpected: 'An unexpected error occurred',
            fillAllFields: 'Please fill in all fields',
            passwordsNoMatch: 'Passwords do not match',
            authFailed: 'Failed to complete authentication',
            error: "Error",
            loadError: "Failed to load data",
            playingRecording: 'Failed to play recording',
          },

          success: {
            default: "Success",
            updated: "Updated successfully",
            saved: "Saved successfully",
          },

          homePatient: {
            talkToAI: 'Talk to your personal assistant',
            guidedDocumenting: 'Guided Documenting',
            documentNow: 'Document Now'
          },
          homeTherapist: {
            patientNotes: 'Patient Notes',
            patientReports: 'Patient Reports',
          },
          recording: {
            statusRecording: {
              idle: "Idle",
              recording: "Recording",
              stopped: "Stopped",
            },
            startRecording: 'Start recording for documentation',
            stopRecording: 'Stop recording for documentation',
            alreadyInProgress: 'A recording is already in progress.',
            startError: 'Failed to start recording.',
            saveError: 'Failed to save recording. Please try again.',
            saveSuccess: 'Recording saved successfully!',
            recordedOn: 'Recorded on',
            at: 'At',
            status: 'Status',
            noRecordingsMessage: "No recordings available!"

          },
          tabsPatient: {
            home: 'Home',
            profile: 'Profile',
            reports: 'Reports',
            information: 'Information',
          },
          note: {
            placeholder: 'Write your thoughts here...',
            editNote: 'Edit Note',
            documenting: 'Documenting',
            latestNote: 'Latest Note',
            addNote: 'Add Note',
            fetchError: 'Failed to fetch notes. Please try again.',
            saveSuccess: 'Note saved successfully!',
            saveError: 'Failed to save note. Please try again.',
            deleteSuccess: 'Note deleted successfully!',
            deleteError: 'Failed to delete note. Please try again.',
            updateSuccess: 'Note updated successfully!',
            updateError: 'Failed to update note. Please try again.',
            noNotesMessage: "No notes available!",
          },
          directedNote: {
            notAuthenticated: 'User is not authenticated.',
            submitSuccess: 'Your responses have been submitted.',
            submitFailed: 'Something went wrong. Please try again.',
            connectionError: 'Unable to submit the note at the moment. Please check your connection.',
            describeExperience: 'Describe your current experience with anxiety',
            describeTrigger: 'What might have triggered this anxiety episode?',
            copingStrategies: "Are there any coping strategies you're using?",
            physicalSensations: "Describe any physical sensations you're feeling",
            emotionalState: 'How would you describe your emotional state?',
            currentThoughts: 'What thoughts are you having right now?',
          },
          anxiety: {
            ratingQuestion: 'How would you rate your current anxiety level?',
            lowAnxiety: 'Low Anxiety',
            moderateAnxiety: 'Moderate Anxiety',
            highAnxiety: 'High Anxiety'
          },



          roleSelection: {
            title: 'How would you like to use CozySpace?',
            patientTitle: "I'm Seeking Help",
            patientDescription: 'Get personalized support, track your health data and connect with your therapist',
            therapistTitle: "I'm a Therapist",
            therapistDescription: 'Help patients maintain a calm and stable routine, monitor their progress and provide professional support'
          },
          personalInfo: {
            firstName: 'First Name',
            lastName: 'Last Name',
            male: 'Male',
            female: 'Female',
            selectGender: 'Select gender',
          },
          therapistSelection: {
            dropdownLabel: '',
            dropdownPlaceholder: 'Choose a therapist to work with',
            noTherapistOption: "I don't want to work with a therapist now",
            noTherapistDesc: 'You can select a therapist later',
            dataSharingTitle: 'Data Sharing Settings',
            noTherapistsError: 'No therapists data in response',
            loadError: 'Failed to load therapists',
            anxietyTrackingLabel: 'Monitor your health data including graphs and statistics',
            anxietyTrackingDesc: 'Share your periodic health reports',
            personalDocLabel: 'Personal Documentation',
            personalDocDesc: 'Share your personal notes, progress, and therapy-related documents',
            privacyNotice: 'Your therapist will only see the data you choose to share. You can change these settings at any time.',
          },
          customization: {
            smartJewelryTitle: 'Smart Jewelry Integration',
            enableJewelry: 'Enable Smart Jewelry',
            jewelryDescription: 'Connect your CozySpace smart jewelry',
            vibrationAlerts: 'Anxiety Alert Vibrations',
            vibrationDescription: 'Activate gentle vibration when sensors detect anxiety',
            musicTherapyTitle: 'Music Therapy',
            enableMusic: 'Enable Music Therapy',
            musicDescription: 'Use calming music to manage stress and anxiety'
          },
          music: {
            selectType: 'Select Music Type',
            tracksCount: '{count} tracks',
            categories: {
            natureSounds: 'Nature Sounds',
            meditation: 'Meditation',
            classical: 'Classical',
            }
        },
        therapistQualifications: {
            education: 'Educational Background',
            selectEducation: 'Select your education level',
            experience: 'Years of Experience',
            selectExperience: 'Select your experience level',
            workplace: 'Current Workplace',
            workplacePlaceholder: 'e.g., Private Practice, Hospital Name',
            specialization: 'Primary Specialization',
            selectSpecialization: 'Select your specialization',
            licenseNumber: 'Professional License Number',
            licenseNumberPlaceholder: 'Enter your license number'
          },

          completion: {
            therapistTitle: "Welcome to CozySpace Professional",
            therapistMessage: "Your professional profile has been set up successfully. You can now start helping patients manage their anxiety effectively.",
            patientTitle: "Welcome to CozySpace",
            patientMessage: "Your profile has been set up successfully. You're ready to start managing your health optimally with professional support.",            availableFeatures: "Available Features"
          },
          therapistFeatures: {
            patientTracking: "Access to patient anxiety tracking",
            secureCommunication: "Secure communication platform",
            dashboard: "Professional dashboard",
            patientTools: "Patient management tools"
          },
          patientFeatures: {
            anxietyTracking: "Real-time physical data monitoring through smart jewelry integration",
            smartJewelry: "Access to periodic health reports",
            musicTherapy: "Tools for managing a calm and stable routine",
            professionalSupport: "Professional support and healthcare provider sharing"
          },

          registration: {
            selectRole: "Please select your role to continue",
            fillNames: "Please fill in both first and last name",
            fillAllFields: "Please fill all fields",
            completeAllFields: "Please complete all professional information fields",
            selectTherapist: "Please select a therapist to continue",
            selectMusicCategory: "Please select a music category",
            selectTrack: "Please select a specific track",
            registrationFailed: "Failed to complete registration. Please try again.",
            selectRoleSubtitle: "Let's start by selecting your role",
            personalInfo: "Personal Information",
            tellAboutYourself: "Tell us about yourself",
            connectTherapist: "Connect with a Therapist",
            chooseTherapist: "Choose your therapist and set sharing preferences",
            professionalBackground: "Professional Background",
            qualifications: "Tell us about your qualifications",
            customizeExperience: "Customize Your Experience",
            setupTools: "Set up your stress and anxiety management tools",
            allSet: "You're All Set!",
            welcomeProfessional: "Welcome to the CozySpace professional network",
            startManaging: "Let's start managing your health together"
          },

          chat: {
            titleHistory: "Chat History",
            deleteChat: "Delete Chat",
            confirmDelete: "Are you sure you want to delete this chat?",
            noMessages: "No messages",
            noChatHistory: "No chat history yet"
          },

          profile: {
            saveSuccess: "Your profile has been updated successfully",
            saveError: "Failed to update profile. Please try again.",
            myProfile: "My Profile",
            personalInfo: "Personal Information",
            preferences: "Preferences",
            save: "Save Changes",
            fullName: 'Full name',
            gender: 'Gender'
          },

          location: {
            permissionNeeded: 'Location Permission Required',
            permissionMessage: 'This app needs access to location.',
            retry: 'Try Again',
            errorMessage: 'There was an error requesting location permissions. Please try again.',
          },

          breathing: {
            title: "Breathing Exercises",
            start: "Start",
            stop: "Stop",
            inhale: "Inhale",
            hold: "Hold",
            holdIn: "Hold",
            holdOut: "Hold",
            exhale: "Exhale",
            musicOn: "Play music",
            musicOff: "Turn off music",
            menuTitle: "Breathing Exercises",
            guideMessages: {
              ready: "Ready to start your breathing exercise?",
              inProgress: "Focus on your breath",
              inhaleGuide: "Inhale deeply through your nose",
              holdGuide: "Hold your breath gently",
              exhaleGuide: "Exhale slowly through your mouth",
              sessionComplete: "Great job! Take a moment to notice how you feel",
              tip: "Find a comfortable position and keep your shoulders relaxed",
            },
            sessionCount: "Session {{count}}",
            breathingTechnique: "4-4-4 Breathing Technique",
            focusMessage: "Take a moment to breathe and relax",
            circle: {
              ready: "Ready?", 
            },
            patternSelection: {
              title: "Select Breathing exercise",
              timing: {
                inhale: "Inhale",
                exhale: "Exhale",
                hold: "Hold",
                seconds: "s"
              },
            },
            stats: {
              guidance: "Guidance",
              minutes: "min",
              seconds: "sec",
              pattern: "Pattern"
            },
            breathingGuide: {
              guide: "Guide",
              about: "About",
              benefits: "Benefits",
              howToPractice: "How to Practice",
              preparation: "Preparation",
              tips: "Tips",
              patterns: {
                "4-4-4-4": {
                  name: "Box Breathing",
                  description: "Box breathing (4-4-4-4) is a powerful stress-management technique. It helps activate your body's natural relaxation response.",
                  preparation: [
                     "Find a quiet, comfortable place to sit or lie down",
                     "Keep your back straight but relaxed",
                     "Rest your hands gently on your lap or by your sides",
                     "Close your eyes or maintain a soft, unfocused gaze",
                      "Take a moment to notice your natural breathing",
                  ],
                  benefits: [
                    "Reduces stress and anxiety levels",
                    "Improves concentration and focus",
                    "Helps regulate blood pressure",
                    "Promotes better sleep quality",
                    "Enhances emotional control",
                    "Increases mindfulness"
                  ],
                  steps: [
                      "Inhale deeply through your nose for 4 seconds",
                      "Hold your breath for 4 seconds",
                      "Exhale slowly through your mouth for 4 seconds",
                      "Hold empty lungs for 4 seconds",
                      "Repeat the process"
                  ]
                },
              "4-7-8": {
                name: "Relaxing Breath",
                description: "The 4-7-8 breathing technique, also known as 'relaxing breath,' is a powerful tool for managing anxiety and sleep. Developed by Dr. Andrew Weil, it acts as a natural tranquilizer for your nervous system.",
                preparation: [
                  "Find a quiet, comfortable place to sit or lie down",
                  "Keep your back straight but relaxed",
                  "Place the tip of your tongue against the upper part of your palate, next to your front teeth",
                  "Close your eyes or maintain a soft, unfocused gaze",
                   "Take a moment to notice your natural breathing",
                ],
                benefits: [
                  "Helps manage anxiety and panic attacks",
                  "Improves sleep quality and helps with insomnia",
                  "Reduces stress response",
                  "Controls cravings and emotional reactions",
                  "Lowers heart rate and blood pressure",
                  "Enhances meditation practice"
                ],
                steps: [
                   "Inhale quietly through your nose for 4 seconds",
                   "Hold your breath for 7 seconds",
                   "Exhale completely through your mouth making a whoosh sound for 8 seconds",
                   "Start the next cycle immediately without pause",
                ],
                tips: [
                  "Keep the tip of your tongue in position throughout the exercise",
                  "Exhale through your mouth around your tongue",
                  "Try to make the exhalation long and audible",
                  "Start with 4 cycles and gradually increase",
                ]
              }
            }
          },
          },
        }
    },
    he: {
      translation: {
        languageName: 'Hebrew',
        languageNameInNative: 'עברית',
        common: {
          welcome: {
            male: 'ברוך הבא',
            female: 'ברוכה הבאה',
            default: 'ברוכים הבאים'
          },
          settings: 'הגדרות',
          language: 'שפה',
          next: 'הבא',
          skip: 'דלג',
          getStarted: 'בואו נתחיל',
          logout: 'התנתק',
          cancel: 'בטל',
          save: 'שמור',
          delete: 'מחק',
          submit: 'שלח',
          error: 'שגיאה',
          success: 'הצלחה',
          logoutConfirm: 'האם את/ה בטוח/ה שברצונך להתנתק?',
          logoutError: 'ההתנתקות נכשלה. אנא נסה/י שוב.',
          enabled: 'מופעל',
          enable: 'הפעל',
          back: 'חזור',
          continue: 'המשך',
          complete: 'סיים',
          typing: 'מקליד',
          typeMessage: {
            male: 'הקלד את ההודעה שלך...',
            female: 'הקלידי את ההודעה שלך...',
            default: 'הקלידו את ההודעה שלכם...'
          },
          paste: "הדבק",
          copy: 'העתק',
          inputOptions: "אפשרויות קלט",
          select: "בחר",
          noSharedInfo:"המטופל לא משתף כרגע מידע איתך.",
          selectPatientMessage : "בחר מטופל למעקב אחר המידע שלו",
        },
        onboarding: {
          welcome: {
            title: 'ברוכים הבאים ל CozySpace',
            description: 'המלווה האישי שלך למציאת שלווה ונוחות בחיי היומיום.',
          },
          support: {
            title: 'תמיכה בזמן אמת',
            description: 'גש לתרגילי נשימה מודרכים וטכניקות הרגעה בכל פעם שאתה זקוק לרגע של שלווה.',
          },
          track: {
            title: 'עקוב אחר המסע שלך',
            description: 'עקוב אחר הרווחה שלך וגלה דפוסים לבניית שגרת טיפוח עצמי טובה יותר.',
          },
          connect: {
            title: 'התחבר לטיפול',
            description: 'שתף את ההתקדמות שלך בבטחה עם איש המקצוע שלך וחזק את מערכת התמיכה שלך.',
          },
        },
        auth: {
            welcomeBack: 'ברוך שובך!',
            createAccount: 'צור חשבון',
            signInContinue: 'התחבר כדי להמשיך',
            beginJourney: 'התחל את המסע שלך איתנו',
            emailPlaceholder: 'כתובת אימייל',
            passwordPlaceholder: 'סיסמה',
            confirmPasswordPlaceholder: 'אשר סיסמה',
            signIn: 'התחבר',
            noAccount: 'אין לך חשבון? הירשם',
            haveAccount: 'כבר יש לך חשבון? התחבר',
            termsNotice: 'בהמשך, אתה מסכים לתנאי השירות ומדיניות הפרטיות שלנו',
            authError: "שגיאת אימות. אנא נסה להתחבר שוב.",
          },
          errors: {
            invalidEmail: 'אנא הזן כתובת אימייל תקינה',
            userDisabled: 'חשבון זה הושבת',
            userNotFound: 'לא נמצא חשבון עם אימייל זה',
            wrongPassword: 'אימייל או סיסמה שגויים',
            emailInUse: 'קיים כבר חשבון עם אימייל זה',
            weakPassword: 'הסיסמה חייבת להכיל לפחות 6 תווים',
            networkError: 'שגיאת רשת. אנא בדוק את החיבור שלך',
            tooManyRequests: 'יותר מדי ניסיונות. אנא נסה שוב מאוחר יותר',
            operationNotAllowed: 'פעולה זו אינה מורשית',
            invalidCredentials: 'פרטי התחברות לא תקינים',
            invalidPassword: 'סיסמה לא תקינה',
            missingPassword: 'אנא הזן סיסמה',
            missingEmail: 'אנא הזן כתובת אימייל',
            unexpected: 'אירעה שגיאה בלתי צפויה',
            fillAllFields: 'אנא מלא את כל השדות',
            passwordsNoMatch: 'הסיסמאות אינן תואמות',
            authFailed: 'ההתחברות נכשלה',
            error: "שגיאה",
            loadError: "טעינת הנתונים נכשלה",
            playingRecording: 'נכשל בניגון ההקלטה',
          },

          success: {
            default: "הצלחה",
            updated: "עודכן בהצלחה",
            saved: "נשמר בהצלחה",
          },
          homeTherapist: {
            patientNotes: 'פתקי המטופל',
            patientReports: 'נתונים סטטיסטיים על המטופל',
          },
          homePatient: {
            talkToAI: {
              male: 'שוחח עם העוזר האישי שלך',
              female: 'שוחחי עם העוזר האישי שלך',
              default: 'שוחחו עם העוזר האישי שלכם'
            },

            guidedDocumenting: {
              male: 'תיעוד מונחה',
              female: 'תיעוד מונחה',
              default: 'תיעוד מונחה'
            },
            documentNow: {
              male: 'תעד עכשיו',
              female: 'תעדי עכשיו',
              default: 'תעדו עכשיו'
            }
          },
          recording: {
            statusRecording: {
              idle: "התחל",
              recording: "מקליט",
              stopped: "עצר",
            },
            startRecording: {
              male: 'התחל הקלטה לתיעוד',
              female: 'התחילי הקלטה לתיעוד',
              default: 'התחילו הקלטה לתיעוד'
            },
            stopRecording: {
              male: 'עצור הקלטה לתיעוד',
              female: 'עצרי הקלטה לתיעוד',
              default: 'עצרו הקלטה לתיעוד'
            },
            alreadyInProgress: 'הקלטה כבר מתבצעת.',
            startError: 'נכשל בהתחלת ההקלטה.',
            saveError: 'נכשל בשמירת ההקלטה. אנא נסה שוב.',
            saveSuccess: 'ההקלטה נשמרה בהצלחה!',
            recordedOn: 'הוקלט בתאריך',
            at: 'בשעה',
            status: 'סטטוס',
            noRecordingsMessage:"אין הקלטות זמינות!"

          },
          tabsPatient: {
            home: 'בית',
            profile: 'פרופיל',
            reports: 'דוחות',
            information: 'מידע'
          },
          information:{
            recordings: 'הקלטות',
            notes: 'פתקים',
            patientInformation: 'מידע על המטופל',
            description: 'גש למידע הרפואי שלך ונהל אותו'
          },
          reports: {
            averageAnxietyIntensity: 'עוצמת חרדה ממוצעת',
            averageEpisodeDuration: 'משך פרק ממוצע',
            notesCreated: 'כמות פתקים',
            anxietyEvents: 'אירועי חרדה',
            dateRange: 'טווח זמנים',
            change: 'ערוך',
            weeklyAnxietyLevels: 'רמות חרדה ',
            selectStartDate: 'בחר תאריך התחלה',
            selectEndtDate: 'בחר תאריך סיום'
          },
          note: {
            placeholder: {
              male: 'כתוב את המחשבות שלך כאן...',
              female: 'כתבי את המחשבות שלך כאן...',
              default: 'כתבו את המחשבות שלכם כאן...'
            },
            editNote: {
              male: 'ערוך פתק',
              female: 'ערכי פתק',
              default: 'ערכו פתק'
            },
            addNote: {
              male: 'הוסף פתק',
              female: 'הוסיפי פתק',
              default: 'הוסיפו פתק'
            },
            documenting: 'תיעוד',
            latestNote: 'הפתק האחרון',
            fetchError: 'נכשל בטעינת הפתקים. אנא נסה שוב.',
            saveSuccess: 'הפתק נשמר בהצלחה!',
            saveError: 'נכשל בשמירת הפתק. אנא נסה שוב.',
            deleteSuccess: 'הפתק נמחק בהצלחה!',
            deleteError: 'נכשל במחיקת הפתק. אנא נסה שוב.',
            updateSuccess: 'הפתק עודכן בהצלחה!',
            updateError: 'נכשל בעדכון הפתק. אנא נסה שוב.',
            noNotesMessage: "אין פתקים זמינים!"
          },
          directedNote: {
            notAuthenticated: 'המשתמש אינו מחובר.',
            submitSuccess: 'התשובות שלך נשלחו בהצלחה.',
            submitFailed: 'משהו השתבש. אנא נסה שוב.',
            connectionError: 'לא ניתן לשלוח את ההערה כרגע. אנא בדוק את החיבור שלך.',
            describeExperience: 'תאר את החוויה הנוכחית שלך עם חרדה',
            describeTrigger: 'מה יכול היה לגרום להתקף החרדה הזה?',
            copingStrategies: 'האם אתה משתמש באסטרטגיות התמודדות כלשהן?',
            physicalSensations: 'תאר תחושות גופניות שאתה מרגיש',
            emotionalState: 'כיצד היית מתאר את מצבך הרגשי?',
            currentThoughts: 'אילו מחשבות עוברות לך בראש כרגע?',
          },
          anxiety: {
            ratingQuestion: 'כיצד היית מדרג את רמת החרדה הנוכחית שלך?',
            lowAnxiety: 'חרדה נמוכה',
            moderateAnxiety: 'חרדה בינונית',
            highAnxiety: 'חרדה גבוהה'
          },



          roleSelection: {
            title: 'כיצד תרצה להשתמש ב CozySpace?',
            patientTitle: 'אני מחפש עזרה',
            
            patientDescription: 'קבל/י תמיכה מותאמת אישית, עקוב/י אחר נתוני הבריאות שלך והתחבר/י למטפל המקצועי שלך',
            therapistTitle: 'אני מטפל',
            therapistDescription: 'עזור/י למטופלים לנהל שגרה רגועה ויציבה, עקוב/י אחר התקדמותם וספק/י להם תמיכה מקצועית',
          },
          personalInfo: {
            firstName: 'שם פרטי',
            lastName: 'שם משפחה',
            male: 'זכר',
            female: 'נקבה',
            selectGender: 'בחר/י מגדר',
          },
          therapistSelection: {
            dropdownLabel: '',
            dropdownPlaceholder: 'בחר/י מטפל לעבוד איתו',
            noTherapistOption: 'איני מעוניין/ת לעבוד עם מטפל כרגע',
            noTherapistDesc: 'תוכל/י לבחור מטפל מאוחר יותר',
            dataSharingTitle: 'הגדרות שיתוף מידע',
            noTherapistsError: 'אין נתוני מטפלים בתשובה',
            loadError: 'טעינת המטפלים נכשלה',
            anxietyTrackingLabel: 'מעקב אחר נתוני הבריאות שלך כולל גרפים וסטטיסטיקות',
            anxietyTrackingDesc: 'שתף/י את דוחות הבריאות התקופתיים',
            personalDocLabel: 'תיעוד אישי',
            personalDocDesc: 'שתף/י את הפתקים האישיים, ההתקדמות והמסמכים הקשורים לטיפול שלך',
            privacyNotice: 'המטפל שלך יראה רק את המידע שתבחר לשתף. תוכל/י לשנות הגדרות אלה בכל עת.',
          },
          customization: {
            smartJewelryTitle: 'שילוב תכשיטים חכמים',
            enableJewelry: 'הפעל/י תכשיט חכם',
            jewelryDescription: 'התחבר/י לתכשיטים החכמים של CozySpace',
            vibrationAlerts: 'התראות רטט לחרדה',
            vibrationDescription: 'הפעל/י רטט עדין בעת זיהוי חרדה ע"י החיישנים',
            musicTherapyTitle: 'תרפיה במוזיקה',
            enableMusic: 'הפעל/י תרפיה במוזיקה',
            musicDescription: 'השתמש/י במוזיקה מרגיעה לניהול מצבי לחץ וחרדה ',
          },
          music: {
            selectType: 'בחר/י סוג מוזיקה',
            tracksCount: '{count} רצועות',
            categories: {
              natureSounds: 'צלילי טבע',
              meditation: 'מדיטציה',
              classical: 'קלאסי',
            }
          },
          therapistQualifications: {
            education: 'רקע השכלתי',
            selectEducation: 'בחר/י את רמת ההשכלה שלך',
            experience: 'שנות ניסיון',
            selectExperience: 'בחר/י את רמת הניסיון שלך',
            workplace: 'מקום עבודה נוכחי',
            workplacePlaceholder: 'לדוגמה: קליניקה פרטית, שם בית חולים',
            specialization: 'התמחות ראשית',
            selectSpecialization: 'בחר/י את ההתמחות שלך',
            licenseNumber: 'מספר רישיון מקצועי',
            licenseNumberPlaceholder: 'הכנס/י את מספר הרישיון שלך'
          },

          completion: {
            therapistTitle: "ברוכים הבאים ל-CozySpace Professional",
            therapistMessage: "הפרופיל המקצועי שלך הוגדר בהצלחה. כעת תוכל/י להתחיל לעזור למטופלים לנהל את החרדה שלהם ביעילות.",
            patientTitle: "ברוכים הבאים ל-CozySpace",
            patientMessage: "הפרופיל שלך הוגדר בהצלחה. אתה מוכן להתחיל לנהל את הבריאות שלך בצורה הטובה ביותר עם תמיכה מקצועית.",
            availableFeatures: "תכונות זמינות"
          },
          therapistFeatures: {
            patientTracking: "גישה לדוחות חרדה של מטופלים",
            secureCommunication: "פלטפורמת תקשורת מאובטחת",
            dashboard: "לוח בקרה מקצועי",
            patientTools: "כלים לניהול מטופלים"
          },
          patientFeatures: {
            anxietyTracking: "מעקב אחר נתונים פיזיים בזמן אמת באמצעות שילוב תכשיטים חכמים",
            smartJewelry: "גישה לדוחות בריאות תקופתיים",
            musicTherapy: "כלים לניהול שגרה רגועה ויציבה",
            professionalSupport: "תמיכה מקצועית ושיתוף אנשי מקצוע"
          },
          registration: {
            selectRole: "אנא בחר/י את תפקידך להמשך",
            fillNames: "אנא מלא/י שם פרטי ושם משפחה",
            fillAllFields: "נא למלא את כל השדות",
            completeAllFields: "אנא מלא/י את כל שדות המידע המקצועי",
            selectTherapist: "אנא בחר/י מטפל להמשך",
            selectMusicCategory: "אנא בחר/י קטגוריית מוזיקה",
            selectTrack: "אנא בחר/י שיר ספציפי",
            registrationFailed: "ההרשמה נכשלה. אנא נסה/י שוב.",
            selectRoleSubtitle: "בוא/י נתחיל בבחירת תפקידך",
            personalInfo: "מידע אישי",
            tellAboutYourself: "ספר/י לנו על עצמך",
            connectTherapist: "התחבר/י למטפל",
            chooseTherapist: "בחר/י את המטפל שלך והגדר/י העדפות שיתוף",
            professionalBackground: "רקע מקצועי",
            qualifications: "ספר/י לנו על הכישורים שלך",
            customizeExperience: "התאם/י אישית את החוויה שלך",
            setupTools: "הגדר/י את כלי ניהול מצבי הלחץ והחרדה שלך",
            allSet: "הכל מוכן!",
            welcomeProfessional: "ברוכים הבאים לרשת המקצועית של CozySpace",
            startManaging: "בוא/י נתחיל לנהל את הבריאות שלך יחד"
          },
          chat: {
            titleHistory: "היסטוריית הצ'אט",
            deleteChat: {
              male: "מחק צ'אט",
              female: "מחקי צ'אט",
              default: "מחקו צ'אט"
            },
            confirmDelete: {
              male: "האם אתה בטוח שברצונך למחוק צ'אט זה?",
              female: "האם את בטוחה שברצונך למחוק צ'אט זה?",
              default: "האם אתם בטוחים שברצונכם למחוק צ'אט זה?"
            },
            noMessages: "אין הודעות",
            noChatHistory: "אין עדיין היסטוריית צ'אט"
          },

          profile: {
            saveSuccess: "הפרופיל שלך עודכן בהצלחה",
            saveError: "נכשל בעדכון הפרופיל. אנא נסה שוב.",
            myProfile: "הפרופיל שלי",
            personalInfo: "מידע אישי",
            preferences: "העדפות",
            save: {
              male: "שמור שינויים",
              female: "שמרי שינויים",
              default: "שמרו שינויים"
            },
            fullName: 'שם מלא',
            gender: 'מין'
          },

          location: {
            permissionNeeded: 'נדרשת הרשאת מיקום',
            permissionMessage: 'האפליקציה צריכה גישה למיקום.',
            retry: 'נסה שוב',
            errorMessage: 'אירעה שגיאה בבקשת הרשאות מיקום. אנא נסה שוב.',
          },

          breathing: {
            title: "תרגילי נשימה",
            start: {
              male: "התחל",
              female: "התחילי",
              default: "התחילו"
            },
            stop: {
              male: "עצור",
              female: "עצרי",
              default: "עצרו"
            },
            inhale: "שאיפה",
            hold: "החזקה",
            holdIn: "החזקה",
            holdOut: "החזקה",
            exhale: "נשיפה",
            musicOn: {
              male: "הפעל מוזיקה",
              female: "הפעילי מוזיקה",
              default: "הפעילו מוזיקה"
            },
            musicOff: {
              male: "כבה מוזיקה",
              female: "כבי מוזיקה",
              default: "כבו מוזיקה"
            },
            menuTitle: "תרגילי נשימה",
            guideMessages: {
              ready: {
                male: "מוכן להתחיל את תרגיל הנשימה?",
                female: "מוכנה להתחיל את תרגיל הנשימה?",
                default: "מוכנים להתחיל את תרגיל הנשימה?"
              },
              inProgress: {
                male: "התמקד בנשימה",
                female: "התמקדי בנשימה",
                default: "התמקדו בנשימה"
              },
              inhaleGuide: {
                male: "שאף אוויר עמוק דרך האף",
                female: "שאפי אוויר עמוק דרך האף",
                default: "שאפו אוויר עמוק דרך האף"
              },
              holdGuide: {
                male: "החזק את הנשימה בעדינות",
                female: "החזיקי את הנשימה בעדינות",
                default: "החזיקו את הנשימה בעדינות"
              },
              exhaleGuide: {
                male: "נשוף לאט דרך הפה",
                female: "נשפי לאט דרך הפה",
                default: "נשפו לאט דרך הפה"
              },
              sessionComplete: {
                male: "כל הכבוד! קח רגע להרגיש את ההשפעה",
                female: "כל הכבוד! קחי רגע להרגיש את ההשפעה",
                default: "כל הכבוד! קחו רגע להרגיש את ההשפעה"
              },
              tip: {
                male: "מצא תנוחה נוחה ושמור על הכתפיים רפויות",
                female: "מצאי תנוחה נוחה ושמרי על הכתפיים רפויות",
                default: "מצאו תנוחה נוחה ושמרו על הכתפיים רפויות"
              }
            },
            sessionCount: "אימון {{count}}",
            breathingTechnique: "טכניקת נשימה 4-4-4",
            focusMessage: {
              male: "קח רגע לנשום ולהירגע",
              female: "קחי רגע לנשום ולהירגע",
              default: "קחו רגע לנשום ולהירגע"
            },
            circle: {
              ready: {
                male: "מוכן?",
                female: "מוכנה?",
                default: "מוכנים?"
              }
            },
            patternSelection: {
              title: {
                male: "בחר תרגיל נשימה",
                female: "בחרי תרגיל נשימה",
                default: "בחרו תרגיל נשימה"
              },
              timing: {
                inhale: "שאיפה",
                exhale: "נשיפה",
                hold: "החזקה",
                seconds: "שניות"
              },
            },
            stats: {
              guidance: "הדרכה",
              minutes: "דקות",
              seconds: "שניות",
              pattern: "תבנית"
            },
            breathingGuide: {
              guide: "מדריך",
              about: "אודות",
              benefits: "יתרונות",
              howToPractice: "איך לתרגל",
              preparation: "הכנה",
              tips: "טיפים",
              patterns: {
                "4-4-4-4": {
                  name: "נשימת קופסה",
                  description: "נשימת קופסה (4-4-4-4) היא טכניקה חזקה לניהול מתח. היא מסייעת להפעיל את תגובת ההרגעה הטבעית של גופך.",
                  preparation: [
                    {
                      male: "מצא מקום שקט ונוח לשבת או לשכב",
                      female: "מצאי מקום שקט ונוח לשבת או לשכב",
                      default: "מצאו מקום שקט ונוח לשבת או לשכב"
                    },
                    {
                      male: "שמור על הגב ישר אך רפוי",
                      female: "שמרי על הגב ישר אך רפוי",
                      default: "שמרו על הגב ישר אך רפוי"
                    },
                    {
                      male: "הנח את ידיך בעדינות על ברכיך או בצדי גופך",
                      female: "הניחי את ידייך בעדינות על ברכייך או בצדי גופך",
                      default: "הניחו את ידיכם בעדינות על ברכיכם או בצדי גופכם"
                    },
                    {
                      male: "עצום את עיניך או שמור על מבט רך ולא ממוקד",
                      female: "עצמי את עינייך או שמרי על מבט רך ולא ממוקד",
                      default: "עצמו את עיניכם או שמרו על מבט רך ולא ממוקד"
                    },
                    {
                      male: "קח רגע להרגיש את הנשימה הטבעית שלך",
                      female: "קחי רגע להרגיש את הנשימה הטבעית שלך",
                      default: "קחו רגע להרגיש את הנשימה הטבעית שלכם"
                    }
                  ],
                  benefits: [
                    "מפחית רמות מתח וחרדה",
                    "משפר ריכוז וקשב",
                    "עוזר בויסות לחץ דם",
                    "מקדם איכות שינה טובה יותר",
                    "מחזק שליטה רגשית",
                    "מגביר מודעות"
                  ],
                  steps: [
                    {
                      male: "שאף עמוק דרך האף במשך 4 שניות",
                      female: "שאפי עמוק דרך האף במשך 4 שניות",
                      default: "שאפו עמוק דרך האף במשך 4 שניות"
                    },
                    {
                      male: "החזק את הנשימה למשך 4 שניות",
                      female: "החזיקי את הנשימה למשך 4 שניות",
                      default: "החזיקו את הנשימה למשך 4 שניות"
                    },
                    {
                      male: "נשוף לאט דרך הפה במשך 4 שניות",
                      female: "נשפי לאט דרך הפה במשך 4 שניות",
                      default: "נשפו לאט דרך הפה במשך 4 שניות"
                    },
                    {
                      male: "החזק ריאות ריקות למשך 4 שניות",
                      female: "החזיקי ריאות ריקות למשך 4 שניות",
                      default: "החזיקו ריאות ריקות למשך 4 שניות"
                    },
                    {
                      male: "חזור על התהליך",
                      female: "חזרי על התהליך",
                      default: "חזרו על התהליך"
                    }
                  ]
                },
                "4-7-8": {
                  name: "נשימה מרגיעה",
                  description:  "טכניקת הנשימה 4-7-8, המכונה גם 'נשימה מרגיעה', היא כלי חזק לניהול חרדה ושינה. פותחה על ידי ד\"ר אנדרו וייל, והיא פועלת כמרגיעה טבעית למערכת העצבים שלך.",
                  preparation: [
                    {
                      male: "מצא מקום שקט ונוח לשבת או לשכב",
                      female: "מצאי מקום שקט ונוח לשבת או לשכב",
                      default: "מצאו מקום שקט ונוח לשבת או לשכב"
                    },
                    {
                      male: "שמור על הגב ישר אך רפוי",
                      female: "שמרי על הגב ישר אך רפוי",
                      default: "שמרו על הגב ישר אך רפוי"
                    },
                     "כדאי להצמיד את קצה הלשון לחלק העליון של החך, בצמוד לשיניים הקדמיות",
                    {
                      male: "עצום את עיניך או שמור על מבט רך ולא ממוקד",
                      female: "עצמי את עינייך או שמרי על מבט רך ולא ממוקד",
                      default: "עצמו את עיניכם או שמרו על מבט רך ולא ממוקד"
                    },
                    {
                      male: "קח רגע להרגיש את הנשימה הטבעית שלך",
                      female: "קחי רגע להרגיש את הנשימה הטבעית שלך",
                      default: "קחו רגע להרגיש את הנשימה הטבעית שלכם"
                    }
                  ],
                  benefits: [
                    "עוזר בניהול חרדה והתקפי פאניקה",
                    "משפר איכות שינה ועוזר בנדודי שינה",
                    "מפחית תגובת מתח",
                    "שולט בדחפים ותגובות רגשיות",
                    "מוריד דופק ולחץ דם",
                    "משפר תרגול מדיטציה"
                  ],
                  steps: [
                    {
                      male: "שאף בשקט דרך האף במשך 4 שניות",
                      female: "שאפי בשקט דרך האף במשך 4 שניות",
                      default: "שאפו בשקט דרך האף במשך 4 שניות"
                    },
                    {
                      male: "החזק את הנשימה למשך 7 שניות",
                      female: "החזיקי את הנשימה למשך 7 שניות",
                      default: "החזיקו את הנשימה למשך 7 שניות"
                    },
                    {
                      male: "נשוף לחלוטין דרך הפה, כשאתה משמיע קול של נשיפה במשך 8 שניות",
                      female: "נשפי לחלוטין דרך הפה, כשאת משמיעה קול של נשיפה במשך 8 שניות",
                      default: "נשפו לחלוטין דרך הפה, כשאתם משמיעים קול של נשיפה במשך 8 שניות"
                    },
                    {
                      male: "התחל את המחזור הבא מיד ללא הפסקה",
                      female: "התחילי את המחזור הבא מיד ללא הפסקה",
                      default: "התחילו את המחזור הבא מיד ללא הפסקה"
                    }
                  ],
                  tips: [
                    {
                      male: "שמור על קצה הלשון במקומו לאורך כל התרגיל",
                      female: "שמרי על קצה הלשון במקומו לאורך כל התרגיל",
                      default: "שמרו על קצה הלשון במקומו לאורך כל התרגיל"
                    },
                    {
                      male: "נשוף דרך הפה מסביב ללשון",
                      female: "נשפי דרך הפה מסביב ללשון",
                      default: "נשפו דרך הפה מסביב ללשון"
                    },
                    {
                      male: "השתדל לעשות את הנשיפה ארוכה ושמיעה",
                      female: "השתדלי לעשות את הנשיפה ארוכה ושמיעה",
                      default: "השתדלו לעשות את הנשיפה ארוכה ושמיעה"
                    },
                    {
                      male: "התחל עם 4 מחזורים והגדל בהדרגה",
                      female: "התחילי עם 4 מחזורים והגדילי בהדרגה",
                      default: "התחילו עם 4 מחזורים והגדילו בהדרגה"
                    }
                  ]
                }
              }
            }
              
          }
      },
    },
    
  };
  


export const availableLanguages = [
    { code: 'en', label: 'English', nativeLabel: 'English' },
    { code: 'he', label: 'Hebrew', nativeLabel: 'עברית' },
  ];
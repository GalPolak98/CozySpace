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
          inputOptions: "Input Options"
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
            loadError: "Failed to load data"
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
          recording: {
            startRecording: 'Start recording for documentation',
            stopRecording: 'Stop recording for documentation',
            alreadyInProgress: 'A recording is already in progress.',
            startError: 'Failed to start recording.',
            saveError: 'Failed to save recording. Please try again.',
            saveSuccess: 'Recording saved successfully!',
          },
          tabsPatient: {
            home: 'Home',
            profile: 'Profile'
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
          }
      },
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
            loadError: "טעינת הנתונים נכשלה"
          },

          success: {
            default: "הצלחה",
            updated: "עודכן בהצלחה",
            saved: "נשמר בהצלחה",
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
          },
          tabsPatient: {
            home: 'בית',
            profile: 'פרופיל'
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
          }
      },
    },
  };

export const availableLanguages = [
    { code: 'en', label: 'English', nativeLabel: 'English' },
    { code: 'he', label: 'Hebrew', nativeLabel: 'עברית' },
  ];
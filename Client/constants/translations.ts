// src/constants/translations.ts
export const translations = {
    en: {
      translation: {
        languageName: 'English',
        languageNameInNative: 'English',
        common: {
          welcome: 'Welcome to Anxiety Management',
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
            title: 'Welcome to AnxiEase',
            description: 'Your personal companion for managing anxiety and finding peace in daily life.',
          },
          support: {
            title: 'Real-Time Support',
            description: 'Get immediate assistance during anxiety moments with guided breathing exercises and calming techniques.',
          },
          track: {
            title: 'Track Your Journey',
            description: 'Monitor your progress and identify patterns to better understand and manage your anxiety triggers.',
          },
          connect: {
            title: 'Connect with Care',
            description: 'Safely share your progress with your therapist and build a stronger support system.',
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
            talkToAI: 'Talk to AI Assistant',
            guidedDocumenting: 'Guided Documenting',
            documentNow: 'Document Now'
          },
          recording: {
            startRecording: 'Start Recording',
            stopRecording: 'Stop Recording',
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
            title: 'How would you like to use AnxiEase?',
            patientTitle: "I'm Seeking Help",
            patientDescription: 'Get personalized support, track your anxiety levels, and connect with professional therapists',
            therapistTitle: "I'm a Therapist",
            therapistDescription: 'Help patients manage anxiety, monitor their progress, and provide professional support',
          },
          personalInfo: {
            firstName: 'First Name',
            lastName: 'Last Name',
          },
          therapistSelection: {
            dropdownLabel: '',
            dropdownPlaceholder: 'Choose a therapist to work with',
            noTherapistOption: "I don't want to work with a therapist now",
            noTherapistDesc: 'You can select a therapist later',
            dataSharingTitle: 'Data Sharing Settings',
            noTherapistsError: 'No therapists data in response',
            loadError: 'Failed to load therapists',
            anxietyTrackingLabel: 'Anxiety Tracking Reports',
            anxietyTrackingDesc: 'Share your anxiety levels, triggers, and monitoring data',
            personalDocLabel: 'Personal Documentation',
            personalDocDesc: 'Share your personal notes, progress, and therapy-related documents',
            privacyNotice: 'Your therapist will only see the data you choose to share. You can change these settings at any time.',
          },
          customization: {
            smartJewelryTitle: 'Smart Jewelry Integration',
            enableJewelry: 'Enable Smart Jewelry',
            jewelryDescription: 'Connect your AnxiEase smart jewelry',
            vibrationAlerts: 'Anxiety Alert Vibrations',
            vibrationDescription: 'Activate gentle vibration when sensors detect anxiety',
            musicTherapyTitle: 'Music Therapy',
            enableMusic: 'Enable Music Therapy',
            musicDescription: 'Use calming music to help manage anxiety',
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
            therapistTitle: "Welcome to AnxiEase Professional",
            therapistMessage: "Your professional profile has been set up successfully. You can now start helping patients manage their anxiety effectively.",
            patientTitle: "Welcome to AnxiEase",
            patientMessage: "Your profile has been set up successfully. You're ready to start managing your anxiety with professional support.",
            availableFeatures: "Available Features"
          },
          therapistFeatures: {
            patientTracking: "Access to patient anxiety tracking",
            secureCommunication: "Secure communication platform",
            dashboard: "Professional dashboard",
            patientTools: "Patient management tools"
          },
          patientFeatures: {
            anxietyTracking: "Real-time anxiety tracking",
            smartJewelry: "Smart jewelry integration",
            musicTherapy: "Music therapy tools",
            professionalSupport: "Professional support"
          },

          registration: {
            selectRole: "Please select your role to continue",
            fillNames: "Please fill in both first and last name",
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
            setupTools: "Set up your anxiety management tools",
            allSet: "You're All Set!",
            welcomeProfessional: "Welcome to the AnxiEase professional network",
            startManaging: "Let's start managing your anxiety together"
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
            fullName: 'Full name'
          },
      },
    },
    he: {
      translation: {
        languageName: 'Hebrew',
        languageNameInNative: 'עברית',
        common: {
          welcome: 'ברוכים הבאים לניהול חרדה',
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
          logoutConfirm: 'האם אתה בטוח שברצונך להתנתק?',
          logoutError: 'ההתנתקות נכשלה. אנא נסה שוב.',
          enabled: 'מופעל',
          enable: 'הפעל',
          back: 'חזור',
          continue: 'המשך',
          complete: 'סיים',
          typing: 'מקליד',
          typeMessage: "הקלד את ההודעה שלך...",
          paste: "הדבק",
          copy: 'העתק',
          inputOptions: "אפשרויות קלט",
        },
        onboarding: {
          welcome: {
            title: 'ברוכים הבאים ל AnxiEase',
            description: 'המלווה האישי שלך לניהול חרדה ומציאת שלווה בחיי היומיום.',
          },
          support: {
            title: 'תמיכה בזמן אמת',
            description: 'קבל סיוע מיידי ברגעי חרדה עם תרגילי נשימה מודרכים וטכניקות הרגעה.',
          },
          track: {
            title: 'עקוב אחר המסע שלך',
            description: 'עקוב אחר ההתקדמות שלך וזהה דפוסים להבנה וניהול טוב יותר של גורמי החרדה שלך.',
          },
          connect: {
            title: 'התחבר לטיפול',
            description: 'שתף את ההתקדמות שלך עם המטפל שלך בבטחה ובנה מערכת תמיכה חזקה יותר.',
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
            talkToAI: 'שוחח עם עוזר AI',
            guidedDocumenting: 'תיעוד מונחה',
            documentNow: 'תעד עכשיו'
          },
          recording: {
            startRecording: 'התחל הקלטה',
            stopRecording: 'עצור הקלטה',
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
            placeholder: 'כתוב את המחשבות שלך כאן...',
            editNote: 'ערוך פתק',
            documenting: 'תיעוד',
            latestNote: 'הפתק האחרון',
            addNote: 'הוסף פתק',
            fetchError: 'נכשל בטעינת הפתקים. אנא נסה שוב.',
            saveSuccess: 'הפתק נשמר בהצלחה!',
            saveError: 'נכשל בשמירת הפתק. אנא נסה שוב.',
            deleteSuccess: 'הפתק נמחק בהצלחה!',
            deleteError: 'נכשל במחיקת הפתק. אנא נסה שוב.',
            updateSuccess: 'הפתק עודכנה בהצלחה!',
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
            title: 'כיצד תרצה להשתמש ב-AnxiEase?',
            patientTitle: 'אני מחפש עזרה',
            patientDescription: 'קבל תמיכה מותאמת אישית, עקוב אחר רמות החרדה שלך, והתחבר למטפל המקצועי שלך',
            therapistTitle: 'אני מטפל',
            therapistDescription: 'עזור למטופלים לנהל חרדה, עקוב אחר התקדמותם וספק להם תמיכה מקצועית',
          },
          personalInfo: {
            firstName: 'שם פרטי',
            lastName: 'שם משפחה',
          },
          therapistSelection: {
            dropdownLabel: '',
            dropdownPlaceholder: 'בחר מטפל לעבוד איתו',
            noTherapistOption: 'איני מעוניין לעבוד עם מטפל כרגע',
            noTherapistDesc: 'תוכל לבחור מטפל מאוחר יותר',
            dataSharingTitle: 'הגדרות שיתוף מידע',
            noTherapistsError: 'אין נתוני מטפלים בתשובה',
            loadError: 'טעינת המטפלים נכשלה',
            anxietyTrackingLabel: 'דוחות מעקב חרדה',
            anxietyTrackingDesc: 'שתף את רמות החרדה, הטריגרים ונתוני המעקב שלך',
            personalDocLabel: 'תיעוד אישי',
            personalDocDesc: 'שתף את הפתקים האישיים, ההתקדמות והמסמכים הקשורים לטיפול שלך',
            privacyNotice: 'המטפל שלך יראה רק את המידע שתבחר לשתף. תוכל לשנות הגדרות אלה בכל עת.',
          },
          customization: {
            smartJewelryTitle: 'שילוב תכשיטים חכמים',
            enableJewelry: 'הפעל תכשיט חכם',
            jewelryDescription: 'התחבר לתכשיטים החכמים של AnxiEase',
            vibrationAlerts: 'התראות רטט לחרדה',
            vibrationDescription: 'הפעל רטט עדין בעת זיהוי חרדה ע"י החיישנים',
            musicTherapyTitle: 'תרפיה במוזיקה',
            enableMusic: 'הפעל תרפיה במוזיקה',
            musicDescription: 'השתמש במוזיקה מרגיעה לניהול חרדה',
          },
          music: {
            selectType: 'בחר סוג מוזיקה',
            tracksCount: '{count} רצועות',
            categories: {
              natureSounds: 'צלילי טבע',
              meditation: 'מדיטציה',
              classical: 'קלאסי',
            }
          },
          therapistQualifications: {
            education: 'רקע השכלתי',
            selectEducation: 'בחר את רמת ההשכלה שלך',
            experience: 'שנות ניסיון',
            selectExperience: 'בחר את רמת הניסיון שלך',
            workplace: 'מקום עבודה נוכחי',
            workplacePlaceholder: 'לדוגמה: קליניקה פרטית, שם בית חולים',
            specialization: 'התמחות ראשית',
            selectSpecialization: 'בחר את ההתמחות שלך',
            licenseNumber: 'מספר רישיון מקצועי',
            licenseNumberPlaceholder: 'הכנס את מספר הרישיון שלך'
          },

          completion: {
            therapistTitle: "ברוכים הבאים ל-AnxiEase Professional",
            therapistMessage: "הפרופיל המקצועי שלך הוגדר בהצלחה. כעת תוכל להתחיל לעזור למטופלים לנהל את החרדה שלהם ביעילות.",
            patientTitle: "ברוכים הבאים ל-AnxiEase",
            patientMessage: "הפרופיל שלך הוגדר בהצלחה. אתה מוכן להתחיל לנהל את החרדה שלך עם תמיכה מקצועית.",
            availableFeatures: "תכונות זמינות"
          },
          therapistFeatures: {
            patientTracking: "גישה לדוחות חרדה של מטופלים",
            secureCommunication: "פלטפורמת תקשורת מאובטחת",
            dashboard: "לוח בקרה מקצועי",
            patientTools: "כלים לניהול מטופלים"
          },
          patientFeatures: {
            anxietyTracking: "מעקב חרדה בזמן אמת",
            smartJewelry: "שילוב תכשיטים חכמים",
            musicTherapy: "כלי תרפיה במוזיקה",
            professionalSupport: "תמיכה מקצועית"
          },
          registration: {
            selectRole: "אנא בחר את תפקידך להמשך",
            fillNames: "אנא מלא שם פרטי ושם משפחה",
            completeAllFields: "אנא מלא את כל שדות המידע המקצועי",
            selectTherapist: "אנא בחר מטפל להמשך",
            selectMusicCategory: "אנא בחר קטגוריית מוזיקה",
            selectTrack: "אנא בחר שיר ספציפי",
            registrationFailed: "ההרשמה נכשלה. אנא נסה שוב.",
            selectRoleSubtitle: "בוא נתחיל בבחירת תפקידך",
            personalInfo: "מידע אישי",
            tellAboutYourself: "ספר לנו על עצמך",
            connectTherapist: "התחבר למטפל",
            chooseTherapist: "בחר את המטפל שלך והגדר העדפות שיתוף",
            professionalBackground: "רקע מקצועי",
            qualifications: "ספר לנו על הכישורים שלך",
            customizeExperience: "התאם אישית את החוויה שלך",
            setupTools: "הגדר את כלי ניהול החרדה שלך",
            allSet: "הכל מוכן!",
            welcomeProfessional: "ברוכים הבאים לרשת המקצועית של AnxiEase",
            startManaging: "בוא נתחיל לנהל את החרדה שלך יחד"
          },
          chat: {
            titleHistory: "היסטוריית הצ'אט",
            deleteChat: "מחק צ'אט",
            confirmDelete: "האם אתה בטוח שברצונך למחוק צ'אט זה?",
            noMessages: "אין הודעות",
            noChatHistory: "אין עדיין היסטוריית צ'אט"
          },

          profile: {
            saveSuccess: "הפרופיל שלך עודכן בהצלחה",
            saveError: "נכשל בעדכון הפרופיל. אנא נסה שוב.",
            myProfile: "הפרופיל שלי",
            personalInfo: "מידע אישי",
            preferences: "העדפות",
            save: "שמור שינויים",
            fullName: 'שם מלא'
          },
      },
    },
  };

export const availableLanguages = [
    { code: 'en', label: 'English', nativeLabel: 'English' },
    { code: 'he', label: 'Hebrew', nativeLabel: 'עברית' },
  ];
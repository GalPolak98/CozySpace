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
          logoutError: 'Failed to logout. Please try again.'
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
            termsNotice: 'By continuing, you agree to our Terms of Service and Privacy Policy'
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
            authFailed: 'Failed to complete authentication'
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
          logoutError: 'ההתנתקות נכשלה. אנא נסה שוב.'
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
            termsNotice: 'בהמשך, אתה מסכים לתנאי השירות ומדיניות הפרטיות שלנו'
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
            authFailed: 'ההתחברות נכשלה'
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
      },
    },
  };

export const availableLanguages = [
    { code: 'en', label: 'English', nativeLabel: 'English' },
    { code: 'he', label: 'Hebrew', nativeLabel: 'עברית' },
  ];
class AuthManager {
  private static instance: AuthManager;
  private isHandlingAuth: boolean = false;
  private authListenerCount: number = 0;
  private authUnsubscribe: (() => void) | null = null;
  private isAuthInProgress: boolean = false;

  private constructor() {}

  static getInstance(): AuthManager {
      if (!AuthManager.instance) {
          AuthManager.instance = new AuthManager();
      }
      return AuthManager.instance;
  }

  isProcessing(): boolean {
      return this.isHandlingAuth || this.isAuthInProgress;
  }

  setProcessing(value: boolean) {
      console.log('Setting processing state to:', value);
      this.isHandlingAuth = value;
  }

  setAuthInProgress(value: boolean) {
      console.log('Setting auth in progress to:', value);
      this.isAuthInProgress = value;
  }

  setAuthUnsubscribe(unsubscribe: () => void) {
      if (this.authUnsubscribe) {
          // Clean up existing listener before setting new one
          this.authUnsubscribe();
      }
      this.authUnsubscribe = unsubscribe;
  }

  incrementListenerCount() {
      this.authListenerCount++;
      console.log(`Auth listener count: ${this.authListenerCount}`);
  }

  decrementListenerCount() {
      if (this.authListenerCount > 0) {
          this.authListenerCount--;
          console.log(`Auth listener count: ${this.authListenerCount}`);
      }
  }

  shouldSetupListener(): boolean {
      // Only set up listener if no active listeners and not in progress
      return this.authListenerCount === 0 && !this.isAuthInProgress;
  }

  cleanup() {
      console.log('Cleaning up auth manager');
      if (this.authUnsubscribe) {
          this.authUnsubscribe();
          this.authUnsubscribe = null;
      }
      this.reset();
  }

  reset() {
      console.log('Resetting auth manager state');
      this.isHandlingAuth = false;
      this.isAuthInProgress = false;
      this.authListenerCount = 0;
  }
}

export const authManager = AuthManager.getInstance();
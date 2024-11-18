class AuthManager {
    private static instance: AuthManager;
    private isHandlingAuth: boolean = false;
    private authListenerCount: number = 0;
    private authUnsubscribe: (() => void) | null = null;
  
    private constructor() {}
  
    static getInstance(): AuthManager {
      if (!AuthManager.instance) {
        AuthManager.instance = new AuthManager();
      }
      return AuthManager.instance;
    }
  
    isProcessing(): boolean {
      return this.isHandlingAuth;
    }
  
    setProcessing(value: boolean) {
      console.log('Setting processing state to:', value);
      this.isHandlingAuth = value;
    }
  
    setAuthUnsubscribe(unsubscribe: () => void) {
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
      return this.authListenerCount === 0;
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
      this.authListenerCount = 0;
    }
}
  
export const authManager = AuthManager.getInstance();
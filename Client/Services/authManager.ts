class AuthManager {
    private static instance: AuthManager;
    private isHandlingAuth: boolean = false;
    private authListenerCount: number = 0;
  
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
  
    incrementListenerCount() {
      this.authListenerCount++;
      console.log(`Auth listener count: ${this.authListenerCount}`);
    }
  
    decrementListenerCount() {
      this.authListenerCount--;
      console.log(`Auth listener count: ${this.authListenerCount}`);
    }
  
    shouldSetupListener(): boolean {
      return this.authListenerCount === 0;
    }
  
    reset() {
      console.log('Resetting auth manager state');
      this.isHandlingAuth = false;
      this.authListenerCount = 0;
    }
  }
  
  export const authManager = AuthManager.getInstance();
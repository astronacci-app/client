declare global {
  interface Window {
    google: any;
    googleOneTapCallback: (response: any) => void;
  }
}

export interface GoogleAuthConfig {
  clientId: string;
}

export class GoogleAuth {
  private clientId: string;
  private isLoaded = false;

  constructor(config: GoogleAuthConfig) {
    this.clientId = config.clientId;
  }

  // Load Google Identity Services script
  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isLoaded || window.google) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.isLoaded = true;
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Identity Services'));
      };

      document.head.appendChild(script);
    });
  }
  // Initialize Google Sign-In
  async initialize(): Promise<void> {
    await this.loadGoogleScript();
    
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: false, // Disable FedCM
        allowed_parent_origin: window.location.origin, // Set allowed origin
        ux_mode: 'popup', // Use popup mode
      });
    }
  }

  // Handle credential response from Google
  private handleCredentialResponse(response: any) {
    if (window.googleOneTapCallback) {
      window.googleOneTapCallback(response);
    }
  }

  // Render Google Sign-In button
  renderButton(elementId: string, options?: any) {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        {
          theme: 'outline',
          size: 'large',
          width: 300,
          ...options
        }
      );
    }
  }

  // Show One Tap prompt
  showOneTap() {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt();
    }
  }
}

// Default Google Auth instance
export const googleAuth = new GoogleAuth({
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id'
});

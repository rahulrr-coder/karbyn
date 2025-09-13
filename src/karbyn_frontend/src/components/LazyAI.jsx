import { lazy, Suspense } from 'react';

// Lazy load AI verification components to reduce initial bundle size
const EnhancedAIVerification = lazy(() => import('./verification/EnhancedAIVerification'));
const AIVerificationInterface = lazy(() => import('./verification/AIVerificationInterface'));
const BiometricRegistration = lazy(() => import('./verification/BiometricRegistration'));

// Loading fallback component for AI verification
const AILoader = () => (
  <div className="flex items-center justify-center h-96 bg-card rounded-lg border border-border">
    <div className="flex flex-col items-center gap-4 text-center p-6">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <div>
        <h3 className="font-semibold text-lg mb-2">Loading AI Verification</h3>
        <p className="text-sm text-muted-foreground">
          Please wait while we load the verification system...
        </p>
      </div>
    </div>
  </div>
);

// Wrapped components with Suspense
export const LazyEnhancedAIVerification = (props) => (
  <Suspense fallback={<AILoader />}>
    <EnhancedAIVerification {...props} />
  </Suspense>
);

export const LazyAIVerificationInterface = (props) => (
  <Suspense fallback={<AILoader />}>
    <AIVerificationInterface {...props} />
  </Suspense>
);

export const LazyBiometricRegistration = (props) => (
  <Suspense fallback={<AILoader />}>
    <BiometricRegistration {...props} />
  </Suspense>
);

export default {
  EnhancedAIVerification: LazyEnhancedAIVerification,
  AIVerificationInterface: LazyAIVerificationInterface,
  BiometricRegistration: LazyBiometricRegistration
};

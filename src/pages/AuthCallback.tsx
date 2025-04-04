
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data?.session) {
          console.log("Auth callback successful, session found", data.session);
          toast.success('Successfully signed in!');
          navigate('/', { replace: true });
        } else {
          console.log("No session found in auth callback");
          // If no session, redirect to sign in page
          navigate('/auth', { replace: true });
        }
      } catch (error: any) {
        console.error("Auth callback error:", error);
        toast.error(error.message || 'Authentication error');
        navigate('/auth', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-t-kids-blue border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="text-xl font-medium">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

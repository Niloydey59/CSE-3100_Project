import React from 'react';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorPageProps {
  message?: string;
  onGoBack?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  message = 'An unexpected error occurred',
  onGoBack
}) => {
  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-[86vh] flex items-center justify-center bg-gradient-to-br from-background to-background/50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardContent className="p-8 space-y-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 rounded-full p-6 animate-pulse">
              <AlertTriangle 
                className="w-16 h-16 text-red-600" 
                strokeWidth={1.5} 
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-muted-foreground text-lg">
              {message}
            </p>
            
            <Button 
              variant="default" 
              className="w-full bg-red-600 hover:bg-red-700 mt-4"
              onClick={handleGoBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorPage;

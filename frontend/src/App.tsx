import './App.css';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthPage } from '@/components/auth/AuthPage';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Toaster } from '@/components/ui/sonner';
import { HomeForms } from '@/components/forms/HomeForms';
import { CreateForm } from '@/components/forms/CreateForm';
import { FormPublic } from '@/components/forms/FormPublic';
import { FormResponses } from '@/components/forms/FormResponses';

function AppContent(): ReactElement {
  const { user, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [route, setRoute] = useState<string>(window.location.hash || '#/home');

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-lg'>Loading...</div>
      </div>
    );
  }

  if (user === null) {
    return <AuthPage isLogin={isLogin} setIsLogin={setIsLogin} />;
  }

  const navigate = (hash: string): void => {
    window.location.hash = hash;
    setRoute(hash);
  };

  const formRouteRegex = /#\/form\/(\d+)/u;
  const responsesRouteRegex = /#\/responses\/(\d+)/u;

  const formMatch = formRouteRegex.exec(route);
  if (formMatch) {
    return <FormPublic />;
  }

  if (route === '#/create') {
    return <CreateForm onCreated={(id: number) => { navigate(`#/responses/${String(id)}`); }} />;
  }

  const responsesMatch = responsesRouteRegex.exec(route);
  if (responsesMatch) {
    const id = Number(responsesMatch[1]);
    return <FormResponses formId={id} />;
  }

  return (
    <div>
      <Dashboard />
      <HomeForms onCreate={(): void => { navigate('#/create'); }} onOpen={(id: number): void => { navigate(`#/responses/${String(id)}`); }} />
    </div>
  );
}

function App(): ReactElement {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <AuthProvider>
        <div className='min-h-screen bg-background'>
          <AppContent />
          <Toaster />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

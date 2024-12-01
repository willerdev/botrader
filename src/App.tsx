import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from './components/layouts/AuthLayout';
import { MainLayout } from './components/layouts/MainLayout';
import { LoginPage } from './pages/LoginPage.tsx';
import { SignupPage } from './pages/SignupPage.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { TradePage } from './pages/TradePage.tsx';
import { OrdersPage } from './pages/OrdersPage.tsx';
import { HistoryPage } from './pages/HistoryPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { AccountLimitsPage } from './pages/AccountLimitsPage.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import './index.css';

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Show landing page when not authenticated */}
        <Route
          path="/"
          element={session ? <Navigate to="/dashboard" /> : <LandingPage />}
        />

        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={session ? <Navigate to="/dashboard" /> : <LoginPage />}
          />
          <Route
            path="/signup"
            element={session ? <Navigate to="/dashboard" /> : <SignupPage />}
          />
        </Route>

        <Route element={<MainLayout />}>
          <Route
            path="/dashboard"
            element={session ? <HomePage /> : <Navigate to="/" />}
          />
          <Route
            path="/trade"
            element={session ? <TradePage /> : <Navigate to="/" />}
          />
          <Route
            path="/orders"
            element={session ? <OrdersPage /> : <Navigate to="/" />}
          />
          <Route
            path="/history"
            element={session ? <HistoryPage /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={session ? <ProfilePage /> : <Navigate to="/" />}
          />
          <Route
            path="/account-limits"
            element={session ? <AccountLimitsPage /> : <Navigate to="/" />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
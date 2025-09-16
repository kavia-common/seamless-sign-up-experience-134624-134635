import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import {
  loginUser,
  registerUser,
  socialSignIn,
  getMe,
  getOnboardingProgress,
  updateOnboardingStep,
} from './api';

/**
 * Left image carousel content.
 */
const slides = [
  {
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1470&auto=format&fit=crop',
    title: 'Onboard faster',
    subtitle: 'A seamless, guided signup experience designed for clarity and speed.',
  },
  {
    img: 'https://images.unsplash.com/photo-1556767576-cfbaec728bb3?q=80&w=1470&auto=format&fit=crop',
    title: 'Secure by design',
    subtitle: 'Your data is protected end-to-end with industry best practices.',
  },
  {
    img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1470&auto=format&fit=crop',
    title: 'Make it yours',
    subtitle: 'Personalize preferences as you go. Finish in just a few steps.',
  },
];

function useCarousel(intervalMs = 4500) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return index;
}

function emailValid(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function passwordStrong(pw) {
  return typeof pw === 'string' && pw.length >= 8;
}

function Stepper({ step }) {
  return (
    <div className="stepper" aria-label="Progress">
      <div className={`step ${step >= 0 ? 'active' : ''}`} />
      <div className={`step-line ${step >= 1 ? 'active' : ''}`} />
      <div className={`step ${step >= 1 ? 'active' : ''}`} />
      <div className={`step-line ${step >= 2 ? 'active' : ''}`} />
      <div className={`step ${step >= 2 ? 'active' : ''}`} />
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Root App with two-panel layout and multi-step signup.
 */
function App() {
  const [theme, setTheme] = useState('dark');
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Step 0: account
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  // Step 1: profile details
  const [role, setRole] = useState('user');
  const [newsletter, setNewsletter] = useState(false);
  // Step 2: preferences
  const [themePref, setThemePref] = useState('dark');

  const canContinueStep0 = useMemo(() => emailValid(email) && passwordStrong(password), [email, password]);
  const carouselIndex = useCarousel();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  }, [theme]);

  function clearBanners() {
    setError('');
    setSuccessMsg('');
  }

  async function handleRegister() {
    clearBanners();
    setBusy(true);
    try {
      const user = await registerUser({ email, password, full_name: fullName || null });
      setSuccessMsg(`Welcome, ${user.full_name || user.email}! Account created.`);
      // Auto-login after register
      await handleLogin({ silent: true });
      // Move to next step to capture onboarding
      setStep(1);
    } catch (e) {
      setError(e.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleLogin({ silent = false } = {}) {
    if (!silent) {
      clearBanners();
    }
    setBusy(true);
    try {
      await loginUser({ email, password });
      if (!silent) setSuccessMsg('Logged in successfully.');
      // Fetch user and progress (for demo we just ensure token works)
      await Promise.all([getMe().catch(() => null), getOnboardingProgress().catch(() => null)]);
    } catch (e) {
      if (!silent) setError(e.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleSocial(provider) {
    clearBanners();
    setBusy(true);
    try {
      // Placeholder tokens; backend is a placeholder too.
      await socialSignIn({ provider, id_token: 'placeholder-id-token' });
      setSuccessMsg(`${provider[0].toUpperCase() + provider.slice(1)} sign-in successful.`);
      setStep(1);
    } catch (e) {
      setError(e.message || 'Social sign-in failed');
    } finally {
      setBusy(false);
    }
  }

  async function nextFromProfile() {
    clearBanners();
    setBusy(true);
    try {
      await updateOnboardingStep({ step: 'profile', status: 'completed', data: { fullName, role, newsletter } });
      setStep(2);
      setSuccessMsg('Profile saved.');
    } catch (e) {
      setError(e.message || 'Could not save profile');
    } finally {
      setBusy(false);
    }
  }

  async function finishPreferences() {
    clearBanners();
    setBusy(true);
    try {
      await updateOnboardingStep({ step: 'preferences', status: 'completed', data: { themePref } });
      setSuccessMsg('All set! Onboarding completed.');
    } catch (e) {
      setError(e.message || 'Could not save preferences');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-shell">
      <section className="left-panel" aria-hidden="true">
        <div className="carousel">
          {slides.map((s, i) => (
            <div
              key={i}
              className={`carousel-slide ${i === carouselIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${s.img})` }}
            />
          ))}
          <div className="carousel-overlay" />
          <div className="tagline">
            <h1>{slides[carouselIndex].title}</h1>
            <p>{slides[carouselIndex].subtitle}</p>
          </div>
          <div className="carousel-dots">
            {slides.map((_, i) => (
              <div key={i} className={`dot ${i === carouselIndex ? 'active' : ''}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="right-panel">
        <div className="card" role="region" aria-label="Signup form">
          <div className="header">
            <div className="brand">
              <div className="brand-logo" aria-hidden="true" />
              <h2>Welcome</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Stepper step={step} />
              <button
                className="theme-toggle"
                onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </div>
          </div>

          <div className="form">
            {error && <div className="error" role="alert">{error}</div>}
            {successMsg && <div className="success" role="status">{successMsg}</div>}

            {step === 0 && (
              <>
                <div className="field">
                  <label htmlFor="email" className="label">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={email.length > 0 && !emailValid(email)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="fullName" className="label">Full name (optional)</label>
                  <input
                    id="fullName"
                    type="text"
                    className="input"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="password" className="label">Password</label>
                  <input
                    id="password"
                    type="password"
                    className="input"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={password.length > 0 && !passwordStrong(password)}
                  />
                </div>
                <div className="actions">
                  <button
                    className="btn btn-primary"
                    disabled={!canContinueStep0 || busy}
                    onClick={handleRegister}
                  >
                    Create account
                  </button>
                  <button
                    className="btn btn-outline"
                    disabled={!emailValid(email) || !password || busy}
                    onClick={() => handleLogin()}
                  >
                    I already have an account
                  </button>
                </div>

                <div className="divider">or continue with</div>
                <div className="alt-buttons">
                  <button className="btn" disabled={busy} onClick={() => handleSocial('google')}>
                    <span className="alt-icon">🟢</span> Google
                  </button>
                  <button className="btn" disabled={busy} onClick={() => handleSocial('apple')}>
                    <span className="alt-icon">🍎</span> Apple
                  </button>
                </div>

                <div className="helper">
                  By continuing you agree to our Terms and acknowledge our Privacy Policy.
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="field">
                  <label htmlFor="role" className="label">Your role</label>
                  <select
                    id="role"
                    className="input"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="creator">Creator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="newsletter" className="label">Stay in the loop</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input
                      id="newsletter"
                      type="checkbox"
                      checked={newsletter}
                      onChange={(e) => setNewsletter(e.target.checked)}
                    />
                    <span className="helper">Send me product updates and tips.</span>
                  </div>
                </div>
                <div className="actions">
                  <button
                    className="btn"
                    onClick={() => setStep(0)}
                    disabled={busy}
                  >
                    Back
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={nextFromProfile}
                    disabled={busy}
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="field">
                  <label htmlFor="themePref" className="label">Theme preference</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      className={`btn ${themePref === 'dark' ? 'btn-primary' : 'btn-outline'}`}
                      type="button"
                      onClick={() => setThemePref('dark')}
                    >
                      Dark
                    </button>
                    <button
                      className={`btn ${themePref === 'light' ? 'btn-primary' : 'btn-outline'}`}
                      type="button"
                      onClick={() => setThemePref('light')}
                    >
                      Light
                    </button>
                    <button
                      className={`btn ${themePref === 'system' ? 'btn-primary' : 'btn-outline'}`}
                      type="button"
                      onClick={() => setThemePref('system')}
                    >
                      System
                    </button>
                  </div>
                </div>
                <div className="footer-note">
                  You can always change this later in Settings.
                </div>
                <div className="actions">
                  <button
                    className="btn"
                    onClick={() => setStep(1)}
                    disabled={busy}
                  >
                    Back
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={finishPreferences}
                    disabled={busy}
                  >
                    Finish
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;

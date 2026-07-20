import { useState } from 'react';
import { COLORS } from '../../../shared/constants/tokens.js';
import styles from './AuthForm.styles.js';

function AuthForm({ type, onSubmit, isLoading, error }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: 'male',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {type === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p style={styles.subtitle}>
          {type === 'login'
            ? 'Sign in to continue'
            : 'Join the feedback community'}
        </p>

        {error && <p style={styles.error}>{error}</p>}

        <form style={styles.form} onSubmit={handleSubmit}>
          {type === 'register' && (
            <div style={styles.field}>
              <label style={styles.label} htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
                required
                minLength={2}
                maxLength={50}
              />
            </div>
          )}

          <div style={styles.field}>
            <label style={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
              minLength={type === 'register' ? 6 : 1}
            />
          </div>

          {type === 'register' && (
            <div style={styles.field}>
              <label style={styles.label} htmlFor="gender">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={styles.select}
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
            disabled={isLoading}
          >
            {isLoading
              ? 'Please wait...'
              : type === 'login'
                ? 'Sign in'
                : 'Create account'}
          </button>
        </form>

        <p style={styles.link}>
          {type === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <a href="/register" style={{ color: COLORS.accent }}>
                Sign up
              </a>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <a href="/login" style={{ color: COLORS.accent }}>
                Sign in
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default AuthForm;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import StudentDashboard from './components/dashboard/StudentDashboard';
import TeacherDashboard from './components/dashboard/TeacherDashboard';
import ExamList from './components/exams/ExamList';
import ExamDetail from './components/exams/ExamDetail';
import TakeExam from './components/exams/TakeExam';
import CreateExam from './components/exams/CreateExam';
import MyResults from './components/results/MyResults';
import ResultDetail from './components/results/ResultDetail';
import { useAuth } from './context/AuthContext';

const Home = () => {
  return (
    <div style={styles.hero}>
      <div style={styles.heroContent}>
        <h1 style={styles.heroTitle}>
          <span style={styles.gradient}>ExamPrep</span>
        </h1>
        <p style={styles.heroSubtitle}>
          Transform your learning experience with our modern examination platform
        </p>
        <p style={styles.heroDescription}>
          Create, manage, and take exams seamlessly. Built for teachers and students.
        </p>
        <div style={styles.heroButtons}>
          <Link to="/register" style={styles.primaryButton}>
            <span style={styles.buttonIcon}>🚀</span>
            Get Started Free
          </Link>
          <Link to="/login" style={styles.secondaryButton}>
            <span style={styles.buttonIcon}>👤</span>
            Sign In
          </Link>
        </div>

        <div style={styles.features}>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>📝</div>
            <div style={styles.featureText}>Create Exams</div>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>📊</div>
            <div style={styles.featureText}>Track Progress</div>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureIcon}>⚡</div>
            <div style={styles.featureText}>Instant Results</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <div style={styles.app}>
        {/* Modern Navbar */}
        <nav style={{
          ...styles.navbar,
          ...(scrolled ? styles.navbarScrolled : {})
        }}>
          <div style={styles.navContainer}>
            <Link to="/" style={styles.logo}>
              <span style={styles.logoIcon}>📚</span>
              <span style={styles.logoText}>ExamPrep</span>
            </Link>

            <div style={styles.navLinks}>
              {user ? (
                <>
                  {user.role === 'teacher' ? (
                    <Link to="/teacher-dashboard" style={styles.navLink}>
                      <span style={styles.navIcon}>📊</span>
                      Dashboard
                    </Link>
                  ) : (
                    <Link to="/dashboard" style={styles.navLink}>
                      <span style={styles.navIcon}>🏠</span>
                      Dashboard
                    </Link>
                  )}

                  <Link to="/exams" style={styles.navLink}>
                    <span style={styles.navIcon}>📝</span>
                    Exams
                  </Link>

                  {user.role === 'student' && (
                    <Link to="/my-results" style={styles.navLink}>
                      <span style={styles.navIcon}>📈</span>
                      My Results
                    </Link>
                  )}

                  {user.role === 'teacher' && (
                    <Link to="/create-exam" style={styles.navLink}>
                      <span style={styles.navIcon}>➕</span>
                      Create Exam
                    </Link>
                  )}

                  <div style={styles.userMenu}>
                    <div style={styles.userAvatar}>
                      {user.role === 'teacher' ? '👨‍🏫' : '👨‍🎓'}
                    </div>
                    <span style={styles.userName}>{user.name}</span>
                    <button onClick={logout} style={styles.logoutButton}>
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" style={styles.navLink}>
                    <span style={styles.navIcon}>🔐</span>
                    Login
                  </Link>
                  <Link to="/register" style={styles.navLinkButton}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Routes */}
        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/teacher-dashboard"
              element={
                <ProtectedRoute>
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/exams"
              element={
                <ProtectedRoute>
                  <ExamList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/exams/:id"
              element={
                <ProtectedRoute>
                  <ExamDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/exams/:id/take"
              element={
                <ProtectedRoute>
                  <TakeExam />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-exam"
              element={
                <ProtectedRoute>
                  <CreateExam />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-results"
              element={
                <ProtectedRoute>
                  <MyResults />
                </ProtectedRoute>
              }
            />

            <Route
              path="/results/:id"
              element={
                <ProtectedRoute>
                  <ResultDetail />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <p style={styles.footerText}>© 2025 ExamPrep. Made with ❤️ for education.</p>
        </footer>
      </div>
    </Router>
  );
};

const styles = {
  app: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative'
  },
  navbar: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    padding: '1rem 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    transition: 'all 0.3s ease'
  },
  navbarScrolled: {
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    background: 'rgba(255, 255, 255, 0.98)'
  },
  navContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none',
    fontSize: '24px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    transition: 'transform 0.3s ease'
  },
  logoIcon: {
    fontSize: '28px'
  },
  logoText: {
    letterSpacing: '-0.5px'
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#4a5568',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    padding: '0.5rem 1rem',
    borderRadius: '8px'
  },
  navIcon: {
    fontSize: '18px'
  },
  navLinkButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.5rem 1rem',
    background: '#f7fafc',
    borderRadius: '12px'
  },
  userAvatar: {
    fontSize: '24px'
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748'
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    background: '#fc8181',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  content: {
    minHeight: 'calc(100vh - 80px)',
    padding: '2rem'
  },
  hero: {
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden'
  },
  heroContent: {
    maxWidth: '800px',
    padding: '2rem',
    animation: 'fadeInUp 1s ease-out'
  },
  heroTitle: {
    fontSize: '72px',
    fontWeight: '900',
    marginBottom: '1.5rem',
    lineHeight: '1.1',
    letterSpacing: '-2px'
  },
  gradient: {
    background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  heroSubtitle: {
    fontSize: '28px',
    marginBottom: '1rem',
    fontWeight: '300',
    opacity: 0.95
  },
  heroDescription: {
    fontSize: '18px',
    marginBottom: '3rem',
    opacity: 0.85,
    lineHeight: '1.6'
  },
  heroButtons: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    marginBottom: '4rem'
  },
  primaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 2.5rem',
    background: '#fff',
    color: '#667eea',
    textDecoration: 'none',
    borderRadius: '16px',
    fontSize: '18px',
    fontWeight: '700',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease'
  },
  secondaryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 2.5rem',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '16px',
    fontSize: '18px',
    fontWeight: '700',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease'
  },
  buttonIcon: {
    fontSize: '24px'
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '2rem',
    marginTop: '3rem'
  },
  feature: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: '2rem',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease'
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '1rem'
  },
  featureText: {
    fontSize: '18px',
    fontWeight: '600'
  },
  footer: {
    background: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    padding: '2rem',
    textAlign: 'center',
    color: '#fff'
  },
  footerText: {
    margin: 0,
    opacity: 0.8
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid #fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    marginTop: '1rem',
    color: '#fff',
    fontSize: '18px',
    fontWeight: '600'
  }
};

export default App;
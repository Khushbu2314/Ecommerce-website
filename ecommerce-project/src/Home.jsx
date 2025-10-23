import { Link } from 'react-router-dom';
import backgroundImage from '/dist/assets/abstract-background-with-low-poly-design.jpg';

const styles = {
  container: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(1px)',
    zIndex: 1,
  },
  content: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    color: 'white',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    width: '100%',
    maxWidth: '1200px',
    padding: '2rem 4rem',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: '20px',
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  button: {
    padding: '10px 20px',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
  },
  registerButton: {
    backgroundColor: '#007bff',
  },
  loginButton: {
    backgroundColor: '#28a745',
  },
};

const Home = () => (
  <div style={styles.container}>
    <div style={styles.overlay} />
    <div style={styles.content}>
      <h1 className="display-4 fw-bold">Welcome to Your Pharmacy Store!</h1>
      <div style={styles.buttonContainer}>
        <Link 
          to="/register" 
          style={{ ...styles.button, ...styles.registerButton }}
        >
          Register
        </Link>
        <Link 
          to="/login" 
          style={{ ...styles.button, ...styles.loginButton }}
        >
          Login
        </Link>
      </div>
    </div>
  </div>
);

export default Home;

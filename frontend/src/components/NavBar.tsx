import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={navStyle}>
      {/* Sol Taraf: Logo / Başlık */}
      <div style={brandStyle}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}>
          🐾 VetClinic
        </Link>
      </div>

      {/* Orta: Menü Linkleri (İstersen artırabilirsin) */}
      <div style={menuStyle}>
        <Link to="/" style={linkStyle}>Ana Sayfa</Link>
        {/* İleride buraya 'Randevular', 'Aşılar' gibi linkler gelecek */}
      </div>

      {/* Sağ Taraf: Kullanıcı Bilgisi ve Çıkış */}
      <div style={userSectionStyle}>
        {(user?.userRole?.name === 'Admin') && (
          <>
            <Link to="/users" style={{ textDecoration: 'none', color: '#ffffffff', marginRight: '15px', fontWeight: 'bold' }}>
              👥 Kullanıcılar
            </Link>

            <Link to="/types" style={{ textDecoration: 'none', color: '#ffffffff', marginRight: '15px', fontWeight: 'bold' }}>
              🐾 Türler
            </Link>
          </>
        )}
        <div style={{ textAlign: 'right', marginRight: '15px' }}>
          <div style={{ fontWeight: 'bold' }}>{user?.name || user?.username}</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
            {user?.userRole?.name || user?.userRole?.name || 'Kullanıcı'}
          </div>
        </div>

        <button onClick={handleLogout} style={logoutButtonStyle}>
          Çıkış
        </button>
      </div>
    </nav>
  );
}

// --- Basit Stiller ---
const navStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 20px',
  height: '60px',
  backgroundColor: '#2c3e50', // Koyu Lacivert
  color: 'white',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const brandStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const menuStyle: React.CSSProperties = {
  display: 'flex',
  gap: '20px',
};

const linkStyle: React.CSSProperties = {
  color: '#ecf0f1',
  textDecoration: 'none',
  fontSize: '1rem',
};

const userSectionStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
};

const logoutButtonStyle: React.CSSProperties = {
  padding: '8px 12px',
  backgroundColor: '#e74c3c', // Kırmızı
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
};
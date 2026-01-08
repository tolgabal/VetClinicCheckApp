import { useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // Context'ten login fonksiyonunu çektik
  const navigate = useNavigate(); // Sayfa yönlendirmesi için

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Sayfanın yenilenmesini engelle
    
    try {
      // 1. Giriş yapmayı dene
      await login({ identifier, password });
      
      // 2. Başarılıysa anasayfaya yönlendir
      navigate('/'); 
    } catch (error) {
      // Hata olursa AuthContext içindeki toast.error zaten çalışacak,
      // burada ekstra bir şey yapmamıza gerek yok.
      console.error("Giriş hatası:", error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
        <h2>Giriş Yap</h2>
        
        <div>
          <label>Kullanıcı Adı veya Email:</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>Şifre:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
          Giriş Yap
        </button>
      </form>
    </div>
  );
}
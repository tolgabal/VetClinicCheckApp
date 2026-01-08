import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { animalService } from '../services/animalService';
import type { Animal } from '../types';
import { toast } from 'react-toastify';
import { useAuth } from '../context/authContext';

export default function Dashboard() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadAnimals();
  }, []);

  const loadAnimals = async () => {
    try {
      const data = await animalService.getAll();
      setAnimals(data);
    } catch (error) {
      toast.error('Hayvan listesi yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAnimals = () => {
    if (!user) return [];

    const roleName = user.userRole?.name;

    if (roleName === 'User') {
      return animals.filter(animal => 
        animal.users?.some(owner => owner.id === user.id)
      );
    }
    else if (roleName === 'Veteriner') {
      return animals.filter(animal => 
        animal.users?.some(owner => owner.id === user.id)
      );
    }

    return animals;
  };

  const filteredList = getFilteredAnimals();
  const userRoleName = user?.userRole?.name;

  const handleDelete = async (id: number) => {
    if (!window.confirm('Kaydı silmek istediğinize emin misiniz?')) return;
    try {
      await animalService.delete(id);
      toast.success('Silindi.');
      setAnimals(animals.filter(a => a.id !== id));
    } catch (error) {
      toast.error('Silinemedi.');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Yükleniyor...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        <h1>
          {userRoleName === 'User' ? 'Benim Dostlarım' : 'Hasta Listesi'}
        </h1>
        
        {userRoleName !== 'User' && (
          <button 
            onClick={() => navigate('/add-animal')}
            style={{ padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            + Yeni Hasta Ekle
          </button>
        )}
      </div>

      {filteredList.length === 0 ? (
        <p>Gösterilecek kayıt bulunamadı.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left', color: '#666' }}>
              <th style={thStyle}>İsim</th>
              <th style={thStyle}>Tür</th>
              <th style={thStyle}>Yaş</th>
              
              {userRoleName !== 'User' && <th style={thStyle}>Sahibi</th>}

              {userRoleName !== 'Veteriner' && <th style={thStyle}>İlgilenen Veteriner</th>}
              
              <th style={thStyle}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((animal) => (
              <tr key={animal.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}><strong>{animal.name}</strong></td>
                <td style={tdStyle}>{animal.animalType?.name || '-'}</td>
                <td style={tdStyle}>{animal.age}</td>

                {userRoleName !== 'User' && (
                  <td style={tdStyle}>
                    {animal.users && animal.users.length > 0 
                      ? animal.users.filter((u => u.userRole.name === 'User')).map(u => u.name || u.username).join(', ') 
                      : <span style={{color: '#999'}}>-Sahipsiz-</span>
                    }
                  </td>
                )}

                {userRoleName !== 'Veteriner' && (
                  <td style={tdStyle}>
                    {animal.users && animal.users.length > 0 
                      ? animal.users.filter((u => u.userRole.name === 'Veteriner')).map(u => u.name || u.username).join(', ') 
                      : <span style={{color: '#999'}}>-Veteriner ataması yapılmadı-</span>
                    }
                  </td>
                )}

                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    
                    {userRoleName === 'Veteriner' && (
                      <>
                        <button onClick={() => navigate(`/animal/${animal.id}`)}>
                          Detay
                        </button>
                      </>
                    )}

                    {userRoleName === 'User' && (
                        <button onClick={() => navigate(`/animal/${animal.id}`)}>
                          Görüntüle
                        </button>
                    )}

                    {userRoleName === 'Admin' && (
                      <>
                        <button onClick={() => navigate(`/edit-animal/${animal.id}`)} style={actionBtnStyle('#2196F3')}>
                          Düzenle
                        </button>
                        <button onClick={() => handleDelete(animal.id)} style={actionBtnStyle('#e53935')}>
                          Sil
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = { padding: '15px', borderBottom: '2px solid #eee', fontWeight: '600' };
const tdStyle = { padding: '12px' };
const actionBtnStyle = (color: string) => ({
  padding: '6px 12px',
  backgroundColor: color,
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.85rem'
});
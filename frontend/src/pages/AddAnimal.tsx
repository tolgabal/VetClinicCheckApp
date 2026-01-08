import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { animalService } from '../services/animalService';
import { resourceService } from '../services/resourceService';
import type { AnimalType, User, CreateAnimalDto } from '../types';
import { toast } from 'react-toastify';

export default function AddAnimal() {
  const navigate = useNavigate();
  
  const [types, setTypes] = useState<AnimalType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // --- AYRIŞTIRILMIŞ STATE'LER ---
  // İki kutuyu ayrı yönetmek için state'leri ayırdık
  const [selectedOwnerIds, setSelectedOwnerIds] = useState<number[]>([]);
  const [selectedVetIds, setSelectedVetIds] = useState<number[]>([]);

  const [formData, setFormData] = useState<CreateAnimalDto>({
    name: '',
    age: 0,
    animalTypeId: 0,
    userIds: [], // Bunu submit anında dolduracağız
    vaccineIds: []
  });

  useEffect(() => {
    const loadResources = async () => {
      try {
        const [typeData, userData] = await Promise.all([
            resourceService.getAnimalTypes(),
            resourceService.getUsers()
        ]);
        setTypes(typeData);
        setUsers(userData);
      } catch (error) {
        toast.error('Veriler yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };
    loadResources();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        // --- BİRLEŞTİRME ANI ---
        // Sahipleri ve Veterinerleri tek bir potada eritiyoruz
        const allUserIds = [...selectedOwnerIds, ...selectedVetIds];

        // Eğer hiç kimse seçilmediyse uyarı verebiliriz (Opsiyonel)
        if (allUserIds.length === 0) {
            toast.warning('En az bir sahip veya veteriner seçmelisiniz.');
            return; 
        }

        await animalService.create({
            ...formData,
            age: Number(formData.age),
            animalTypeId: Number(formData.animalTypeId),
            userIds: allUserIds // Birleşmiş liste buraya gidiyor
        });
        
        toast.success('Hayvan başarıyla eklendi!');
        navigate('/');
    } catch (error) {
        toast.error('Ekleme işlemi başarısız.');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
      <h2>Yeni Hayvan Ekle</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* İsim */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>İsim:</label>
          <input 
            type="text" required 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            style={inputStyle}
          />
        </div>

        {/* Yaş */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Yaş:</label>
          <input 
            type="number" required 
            value={formData.age}
            onChange={e => setFormData({...formData, age: Number(e.target.value)})}
            style={inputStyle}
          />
        </div>

        {/* Tür */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Tür:</label>
          <select 
            required
            value={formData.animalTypeId}
            onChange={e => setFormData({...formData, animalTypeId: Number(e.target.value)})}
            style={inputStyle}
          >
            <option value={0}>Seçiniz...</option>
            {types.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* --- SAHİP SEÇİMİ (User) --- */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#2c3e50' }}>
            Sahipler (CTRL ile çoklu seçim):
          </label>
          <select 
            multiple
            value={selectedOwnerIds.map(String)} // Kendi state'ini kullanıyor
            onChange={e => {
                const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
                setSelectedOwnerIds(selected); // Kendi state'ini güncelliyor
            }}
            style={{ ...inputStyle, height: '100px', border: '1px solid #3498db' }} // Mavi çerçeve
          >
            {users.filter(u => u.userRole?.name === 'User').map(u => (
                <option key={u.id} value={u.id}>
                   {u.name || 'İsimsiz'} ({u.username})
                </option>
            ))}
          </select>
        </div>

        {/* --- VETERİNER SEÇİMİ (Veteriner) --- */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#8e44ad' }}>
            Atanan Veterinerler (CTRL ile çoklu seçim):
          </label>
          <select 
            multiple
            value={selectedVetIds.map(String)} // Kendi state'ini kullanıyor
            onChange={e => {
                const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
                setSelectedVetIds(selected); // Kendi state'ini güncelliyor
            }}
            style={{ ...inputStyle, height: '100px', border: '1px solid #9b59b6' }} // Mor çerçeve
          >
            {users.filter(u => u.userRole?.name === 'Veteriner').map(u => (
                <option key={u.id} value={u.id}>
                   {u.name || 'İsimsiz'} ({u.username})
                </option>
            ))}
          </select>
        </div>

        <button type="submit" style={buttonStyle}>
          Kaydet
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '1rem'
};

const buttonStyle = {
  padding: '12px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: 'bold',
  marginTop: '10px'
};
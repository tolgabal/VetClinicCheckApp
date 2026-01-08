import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { animalService } from '../services/animalService';
import { resourceService } from '../services/resourceService';
import type { AnimalType, User, CreateAnimalDto } from '../types';
import { toast } from 'react-toastify';

export default function EditAnimal() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dropdown listeleri
  const [types, setTypes] = useState<AnimalType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Ayrıştırılmış Seçim State'leri
  const [selectedOwnerIds, setSelectedOwnerIds] = useState<number[]>([]);
  const [selectedVetIds, setSelectedVetIds] = useState<number[]>([]);

  // Form Verisi
  const [formData, setFormData] = useState<CreateAnimalDto>({
    name: '',
    age: 0,
    animalTypeId: 0,
    userIds: [],
    vaccineIds: []
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    try {
      // 1. Gerekli tüm verileri paralel çekelim
      const [typeData, userData, animalData] = await Promise.all([
        resourceService.getAnimalTypes(),
        resourceService.getUsers(),
        animalService.getById(Number(id)) // Mevcut hayvan verisi
      ]);

      setTypes(typeData);
      setUsers(userData);

      // 2. Formu mevcut verilerle dolduralım
      setFormData({
        name: animalData.name,
        age: animalData.age,
        animalTypeId: animalData.animalType?.id || 0,
        userIds: [], // Bunu aşağıda owner/vet birleştirerek yapacağız
        vaccineIds: []
      });

      // 3. Mevcut ilişkileri (User ve Vet) kutucuklara dağıtalım
      if (animalData.users) {
        const owners = animalData.users
            .filter(u => u.userRole?.name === 'User')
            .map(u => u.id);
        
        const vets = animalData.users
            .filter(u => u.userRole?.name === 'Veteriner')
            .map(u => u.id);

        setSelectedOwnerIds(owners);
        setSelectedVetIds(vets);
      }

    } catch (error) {
      toast.error('Veriler yüklenemedi.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      // Sahipleri ve Veterinerleri birleştir
      const allUserIds = [...selectedOwnerIds, ...selectedVetIds];

      await animalService.update(Number(id), {
        ...formData,
        age: Number(formData.age),
        animalTypeId: Number(formData.animalTypeId),
        userIds: allUserIds // Birleşmiş liste gönderiliyor
      });

      toast.success('Hayvan bilgileri güncellendi!');
      navigate('/'); 
    } catch (error) {
      toast.error('Güncelleme başarısız.');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Yükleniyor...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
          <h2 style={{ margin: 0, color: '#333' }}>Hayvan Düzenle</h2>
          <button onClick={() => navigate(-1)} style={cancelBtnStyle}>İptal</button>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* İsim */}
        <div>
          <label style={labelStyle}>İsim:</label>
          <input 
            type="text" required 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            style={inputStyle}
          />
        </div>

        {/* Yaş */}
        <div>
          <label style={labelStyle}>Yaş:</label>
          <input 
            type="number" required 
            value={formData.age}
            onChange={e => setFormData({...formData, age: Number(e.target.value)})}
            style={inputStyle}
          />
        </div>

        {/* Tür */}
        <div>
          <label style={labelStyle}>Tür:</label>
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

        {/* SAHİPLER */}
        <div>
          <label style={{ ...labelStyle, color: '#2980b9' }}>
            Sahipler (CTRL ile çoklu seçim):
          </label>
          <select 
            multiple
            value={selectedOwnerIds.map(String)} 
            onChange={e => {
                const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
                setSelectedOwnerIds(selected);
            }}
            style={{ ...inputStyle, height: '100px', border: '1px solid #3498db' }}
          >
            {users.filter(u => u.userRole?.name === 'User').map(u => (
                <option key={u.id} value={u.id}>
                   {u.name || 'İsimsiz'} ({u.username})
                </option>
            ))}
          </select>
        </div>

        {/* VETERİNERLER */}
        <div>
          <label style={{ ...labelStyle, color: '#8e44ad' }}>
            Veterinerler (CTRL ile çoklu seçim):
          </label>
          <select 
            multiple
            value={selectedVetIds.map(String)} 
            onChange={e => {
                const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
                setSelectedVetIds(selected);
            }}
            style={{ ...inputStyle, height: '100px', border: '1px solid #9b59b6' }}
          >
            {users.filter(u => u.userRole?.name === 'Veteriner').map(u => (
                <option key={u.id} value={u.id}>
                   {u.name || 'İsimsiz'} ({u.username})
                </option>
            ))}
          </select>
        </div>

        <button type="submit" style={saveBtnStyle}>
          Güncellemeyi Kaydet
        </button>
      </form>
    </div>
  );
}

// STİLLER
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' };
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '5px', fontWeight: '500' };
const saveBtnStyle: React.CSSProperties = { padding: '12px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', marginTop: '10px' };
const cancelBtnStyle: React.CSSProperties = { padding: '5px 10px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
import { useEffect, useState } from 'react';
import { resourceService } from '../services/resourceService';
import type { AnimalType } from '../types';
import { toast } from 'react-toastify';

export default function TypeManagement() {
  const [types, setTypes] = useState<AnimalType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal ve Form State'leri
  const [showModal, setShowModal] = useState(false);
  const [typeName, setTypeName] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    try {
      const data = await resourceService.getAnimalTypes();
      setTypes(data);
    } catch (error) {
      toast.error('Tür listesi yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  // --- MODAL İŞLEMLERİ ---
  const openAddModal = () => {
    setEditId(null);
    setTypeName('');
    setShowModal(true);
  };

  const openEditModal = (type: AnimalType) => {
    setEditId(type.id);
    setTypeName(type.name);
    setShowModal(true);
  };

  // --- KAYDET / GÜNCELLE ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeName.trim()) return;

    try {
      if (editId) {
        // Güncelleme
        await resourceService.updateAnimalType(editId, { name: typeName });
        toast.success('Tür güncellendi.');
        // Listeyi arayüzde güncelle (animals verisini koruyarak)
        setTypes(types.map(t => t.id === editId ? { ...t, name: typeName } : t));
      } else {
        // Ekleme
        await resourceService.createAnimalType({ name: typeName });
        toast.success('Yeni tür eklendi.');
        loadTypes(); // Ekleme sonrası backend'den taze veri çekmek iyidir
      }
      
      setShowModal(false);
      setTypeName('');
      setEditId(null);
    } catch (error) {
      toast.error('İşlem başarısız.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu türü silmek istediğinize emin misiniz?')) return;
    try {
      await resourceService.deleteAnimalType(id);
      toast.success('Tür silindi.');
      setTypes(types.filter(t => t.id !== id));
    } catch (error) {
      toast.error('Silinemedi. (Kayıtlı hayvanlar olabilir)');
    }
  };

  if (loading) return <div style={{padding: '20px'}}>Yükleniyor...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>🐾 Hayvan Türleri Yönetimi</h2>
        <button onClick={openAddModal} style={addBtnStyle}>+ Yeni Tür Ekle</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
            <th style={thStyle}>Tür Adı</th>
            <th style={thStyle}>Kayıtlı Hayvan Sayısı</th> 
            <th style={thStyle}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {types.map(t => (
            <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}><strong>{t.name}</strong></td>
              
              {/* VERİ GÖSTERİMİ */}
              <td style={tdStyle}>
                 {t.animals ? t.animals.length : 0}
              </td>

              <td style={tdStyle}>
                <button onClick={() => openEditModal(t)} style={editBtnStyle}>Düzenle</button>
                <button onClick={() => handleDelete(t.id)} style={deleteBtnStyle}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- MODAL --- */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>{editId ? 'Türü Düzenle' : 'Yeni Tür Tanımla'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Tür Adı:</label>
                <input 
                  type="text" 
                  required 
                  autoFocus
                  style={inputStyle}
                  value={typeName}
                  onChange={e => setTypeName(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} style={cancelBtnStyle}>İptal</button>
                <button type="submit" style={saveBtnStyle}>
                    {editId ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// STİLLER
const thStyle: React.CSSProperties = { padding: '12px', borderBottom: '2px solid #ddd', color: '#666' };
const tdStyle: React.CSSProperties = { padding: '10px' };
const addBtnStyle: React.CSSProperties = { padding: '10px 15px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const editBtnStyle: React.CSSProperties = { padding: '5px 10px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' };
const deleteBtnStyle: React.CSSProperties = { padding: '5px 10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };

const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '400px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' };
const saveBtnStyle: React.CSSProperties = { padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const cancelBtnStyle: React.CSSProperties = { padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { animalService } from '../services/animalService';
import { vaccineService } from '../services/vaccineService';
import type { Animal, CreateVaccineDto, Vaccine } from '../types'; // Vaccine tipini import et
import { toast } from 'react-toastify';
import { useAuth } from '../context/authContext';

export default function AnimalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal ve Form State'leri
  const [showModal, setShowModal] = useState(false);
  const [editingVaccineId, setEditingVaccineId] = useState<number | null>(null); // Düzenlenen ID

  const [vaccineForm, setVaccineForm] = useState<Partial<CreateVaccineDto>>({
    name: '',
    description: '',
    lastVaccinationDate: undefined,
    nextVaccinationDate: undefined
  });

  useEffect(() => {
    loadAnimal();
  }, [id]);

  const loadAnimal = async () => {
    if (!id) return;
    try {
      const data = await animalService.getById(Number(id));
      setAnimal(data);
    } catch (error) {
      toast.error('Hayvan bilgileri alınamadı.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  // --- MODAL İŞLEMLERİ ---

  // Tarihi Input formatına çevirir (YYYY-MM-DD)
  const formatDateForInput = (dateString?: Date | string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const openAddModal = () => {
    setEditingVaccineId(null);
    setVaccineForm({ name: '', description: '', lastVaccinationDate: undefined, nextVaccinationDate: undefined });
    setShowModal(true);
  };

  const openEditModal = (v: Vaccine) => {
    setEditingVaccineId(v.id);
    setVaccineForm({
        name: v.name,
        description: v.description,
        lastVaccinationDate: v.lastVaccinationDate,
        nextVaccinationDate: v.nextVaccinationDate
    });
    setShowModal(true);
  };

  // --- KAYDET / GÜNCELLE ---
  const handleSaveVaccine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !vaccineForm.name || !vaccineForm.lastVaccinationDate || !vaccineForm.nextVaccinationDate) {
        toast.warning("Lütfen zorunlu alanları doldurun.");
        return;
    }

    try {
      const payload = {
        name: vaccineForm.name,
        description: vaccineForm.description || '',
        lastVaccinationDate: new Date(vaccineForm.lastVaccinationDate),
        nextVaccinationDate: new Date(vaccineForm.nextVaccinationDate),
        animalId: Number(id)
      };

      if (editingVaccineId) {
        // GÜNCELLEME
        await vaccineService.update(editingVaccineId, payload);
        toast.success('Aşı güncellendi.');
      } else {
        // EKLEME
        await vaccineService.create(payload);
        toast.success('Aşı eklendi.');
      }
      
      setShowModal(false);
      loadAnimal(); // Listeyi yenile
    } catch (error) {
      toast.error('İşlem sırasında hata oluştu.');
    }
  };

  const handleDeleteVaccine = async (vaccineId: number) => {
    if (!window.confirm("Bu aşı kaydını silmek istediğinize emin misiniz?")) return;
    try {
        await vaccineService.delete(vaccineId);
        toast.success("Aşı kaydı silindi.");
        loadAnimal();
    } catch (error) {
        toast.error("Silme işlemi başarısız.");
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Yükleniyor...</div>;
  if (!animal) return <div style={{ padding: '20px' }}>Kayıt bulunamadı.</div>;

  const owners = animal.users?.filter(u => u.userRole?.name === 'User') || [];
  const vets = animal.users?.filter(u => u.userRole?.name === 'Veteriner') || [];
  const canEdit = user?.userRole?.name === 'Veteriner' || user?.userRole?.name === 'Admin';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '50px' }}>
      
      {/* ÜST KISIM (Aynı) */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '15px' }}>
        <button onClick={() => navigate(-1)} style={backBtnStyle}>← Geri</button>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>{animal.name}</h1>
        <span style={badgeStyle}>{animal.animalType?.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Kimlik Kartı */}
        <div style={cardStyle}>
          <h3 style={headerStyle}>📋 Kimlik Kartı</h3>
          <div style={rowStyle}><strong>Yaş:</strong> {animal.age}</div>
        </div>

        {/* İletişim */}
        <div style={cardStyle}>
          <h3 style={headerStyle}>👥 İletişim</h3>
          <div style={{ marginBottom: '10px' }}>
            <strong style={{color: '#2980b9'}}>Sahibi:</strong>
            <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
               {owners.map(o => <li key={o.id}>{o.name || o.username}</li>)}
            </ul>
          </div>
          <div>
            <strong style={{color: '#8e44ad'}}>Veteriner:</strong>
            <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
               {vets.map(v => <li key={v.id}>{v.name || v.username}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* --- AŞI TAKVİMİ --- */}
      <div style={{ ...cardStyle, marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ ...headerStyle, borderBottom: 'none', marginBottom: 0 }}>💉 Aşı Takvimi</h3>
            
            {canEdit && (
                <button onClick={openAddModal} style={addBtnStyle}>
                    + Aşı Ekle
                </button>
            )}
        </div>
        
        {animal.vaccines && animal.vaccines.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                        <th style={thStyle}>Aşı Adı</th>
                        <th style={thStyle}>Yapılan Tarih</th>
                        <th style={thStyle}>Sonraki Doz</th>
                        <th style={thStyle}>Notlar</th>
                        {canEdit && <th style={thStyle}>İşlem</th>}
                    </tr>
                </thead>
                <tbody>
                    {animal.vaccines.map(v => (
                        <tr key={v.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={tdStyle}><strong>{v.name}</strong></td>
                            <td style={tdStyle}>{new Date(v.lastVaccinationDate).toLocaleDateString('tr-TR')}</td>
                            <td style={tdStyle} >
                                <span style={{ color: new Date(v.nextVaccinationDate) < new Date() ? 'red' : 'green' }}>
                                    {new Date(v.nextVaccinationDate).toLocaleDateString('tr-TR')}
                                </span>
                            </td>
                            <td style={tdStyle}>{v.description}</td>
                            {canEdit && (
                                <td style={tdStyle}>
                                    {/* DÜZENLE BUTONU */}
                                    <button onClick={() => openEditModal(v)} style={editBtnStyle}>Düzenle</button>
                                    {/* SİL BUTONU */}
                                    <button onClick={() => handleDeleteVaccine(v.id)} style={deleteBtnStyle}>Sil</button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <div style={emptyStateStyle}>Henüz sisteme girilmiş bir aşı kaydı yok.</div>
        )}
      </div>

      {/* --- ORTAK MODAL (EKLE & DÜZENLE) --- */}
      {showModal && (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h3>{editingVaccineId ? 'Aşı Kaydını Düzenle' : 'Yeni Aşı Kaydı'}</h3>
                <form onSubmit={handleSaveVaccine}>
                    <div style={{marginBottom: '10px'}}>
                        <label>Aşı Adı:</label>
                        <input type="text" required style={inputStyle} 
                            value={vaccineForm.name} 
                            onChange={e => setVaccineForm({...vaccineForm, name: e.target.value})} 
                        />
                    </div>
                    <div style={{marginBottom: '10px'}}>
                        <label>Yapılış Tarihi:</label>
                        <input type="date" required style={inputStyle} 
                            value={formatDateForInput(vaccineForm.lastVaccinationDate)}
                            onChange={e => setVaccineForm({...vaccineForm, lastVaccinationDate: new Date(e.target.value)})} 
                        />
                    </div>
                    <div style={{marginBottom: '10px'}}>
                        <label>Bir Sonraki Doz Tarihi:</label>
                        <input type="date" required style={inputStyle} 
                            value={formatDateForInput(vaccineForm.nextVaccinationDate)}
                            onChange={e => setVaccineForm({...vaccineForm, nextVaccinationDate: new Date(e.target.value)})} 
                        />
                    </div>
                    <div style={{marginBottom: '15px'}}>
                        <label>Açıklama / Not:</label>
                        <textarea style={inputStyle} 
                            value={vaccineForm.description} 
                            onChange={e => setVaccineForm({...vaccineForm, description: e.target.value})} 
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => setShowModal(false)} style={cancelBtnStyle}>İptal</button>
                        <button type="submit" style={saveBtnStyle}>
                            {editingVaccineId ? 'Güncelle' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}

// --- CSS STİLLERİ ---
const cardStyle: React.CSSProperties = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eaeaea' };
const headerStyle: React.CSSProperties = { marginTop: 0, borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', marginBottom: '15px', color: '#34495e' };
const rowStyle: React.CSSProperties = { marginBottom: '12px', color: '#2c3e50' };
const badgeStyle: React.CSSProperties = { backgroundColor: '#e0f7fa', color: '#006064', padding: '5px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem' };
const backBtnStyle: React.CSSProperties = { padding: '8px 15px', backgroundColor: 'transparent', color: '#7f8c8d', border: '1px solid #bdc3c7', borderRadius: '6px', cursor: 'pointer' };
const addBtnStyle: React.CSSProperties = { padding: '8px 16px', backgroundColor: '#6c5ce7', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const emptyStateStyle: React.CSSProperties = { padding: '30px', textAlign: 'center', color: '#95a5a6', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px dashed #ced6e0' };
const thStyle = { padding: '12px', borderBottom: '2px solid #ddd', color: '#666' };
const tdStyle = { padding: '10px', verticalAlign: 'top' };
const deleteBtnStyle = { padding: '4px 8px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' };
const editBtnStyle = { padding: '4px 8px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', marginRight: '5px' };

const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' };
const saveBtnStyle: React.CSSProperties = { padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const cancelBtnStyle: React.CSSProperties = { padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
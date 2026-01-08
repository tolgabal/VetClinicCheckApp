import { useEffect, useState } from 'react';
import { userService } from '../services/userService';
import type { User, CreateUserDto } from '../types';
import { toast } from 'react-toastify';

// Rol ID'lerinin veritabanındaki karşılığı (Bunu kendi DB'ne göre kontrol et!)
const ROLE_IDS = {
  ADMIN: 1, // veya senin DB'de kaçsa
  VETERINER: 2,
  USER: 3
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState<CreateUserDto>({
    username: '',
    name: '',
    email: '',
    password: '',
    userRoleId: ROLE_IDS.USER, // Varsayılan User
    animalIds: []
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      toast.error('Kullanıcı listesi çekilemedi.');
    } finally {
      setLoading(false);
    }
  };

  // Silme İşlemi
  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;
    try {
      await userService.delete(id);
      toast.success('Kullanıcı silindi.');
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      toast.error('Silme işlemi başarısız.');
    }
  };

  // Modal Açma (Yeni Ekleme)
  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ username: '', name: '', email: '', password: '', userRoleId: ROLE_IDS.USER, animalIds: [] });
    setShowModal(true);
  };

  // Modal Açma (Düzenleme)
  const openEditModal = (user: User) => {
    setIsEditMode(true);
    setSelectedUserId(user.id);
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email,
      password: '', // Şifre boş gelir, değiştirilmek istenirse girilir
      userRoleId: user.userRole?.id || ROLE_IDS.USER,
      animalIds: [] // Hayvan ilişkilerini buradan yönetmiyoruz şimdilik
    });
    setShowModal(true);
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && selectedUserId) {
        // GÜNCELLEME
        const updateData = { ...formData };
        if (!updateData.password) delete (updateData as any).password;

        await userService.update(selectedUserId, updateData);
        toast.success('Kullanıcı güncellendi.');
      } else {
        // YENİ EKLEME
        await userService.create(formData);
        toast.success('Yeni kullanıcı oluşturuldu.');
      }
      setShowModal(false);
      loadUsers(); // Listeyi yenile
    } catch (error) {
      toast.error('İşlem başarısız. (Email veya Kullanıcı adı çakışıyor olabilir)');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>👥 Kullanıcı Yönetimi</h2>
        <button onClick={openAddModal} style={addBtnStyle}>+ Yeni Kullanıcı</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Ad Soyad</th>
            <th style={thStyle}>Kullanıcı Adı</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Rol</th>
            <th style={thStyle}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}>#{user.id}</td>
              <td style={tdStyle}><strong>{user.name}</strong></td>
              <td style={tdStyle}>{user.username}</td>
              <td style={tdStyle}>{user.email}</td>
              <td style={tdStyle}>
                <span style={roleBadgeStyle(user.userRole?.name)}>
                  {user.userRole?.name || 'Rol Yok'}
                </span>
              </td>
              <td style={tdStyle}>
                <button onClick={() => openEditModal(user)} style={editBtnStyle}>Düzenle</button>
                <button onClick={() => handleDelete(user.id)} style={deleteBtnStyle}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- MODAL --- */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>{isEditMode ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}</h3>
            <form onSubmit={handleSubmit}>
              
              <div style={formGroupStyle}>
                <label>Ad Soyad:</label>
                <input type="text" required style={inputStyle}
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div style={formGroupStyle}>
                <label>Kullanıcı Adı:</label>
                <input type="text" required style={inputStyle} 
                  value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              </div>

              <div style={formGroupStyle}>
                <label>Email:</label>
                <input type="email" required style={inputStyle} 
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>

              <div style={formGroupStyle}>
                <label>Şifre {isEditMode && <small>(Değiştirmek istemiyorsanız boş bırakın)</small>}:</label>
                <input type="password" required={!isEditMode} style={inputStyle} 
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>

              <div style={formGroupStyle}>
                <label>Rol:</label>
                <select style={inputStyle} 
                  value={formData.userRoleId} 
                  onChange={e => setFormData({...formData, userRoleId: Number(e.target.value)})}>
                    {/* ID'leri kendi DB'ne göre güncelle */}
                    <option value={ROLE_IDS.USER}>User (Müşteri)</option>
                    <option value={ROLE_IDS.VETERINER}>Veteriner</option>
                    <option value={ROLE_IDS.ADMIN}>Admin</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} style={cancelBtnStyle}>İptal</button>
                <button type="submit" style={saveBtnStyle}>Kaydet</button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/// STİLLER
const thStyle: React.CSSProperties = { padding: '12px', borderBottom: '2px solid #ddd', color: '#666' };
const tdStyle: React.CSSProperties = { padding: '10px' };
const addBtnStyle: React.CSSProperties = { padding: '10px 15px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const editBtnStyle: React.CSSProperties = { padding: '5px 10px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' };
const deleteBtnStyle: React.CSSProperties = { padding: '5px 10px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '25px', borderRadius: '8px', width: '400px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' };

// HATA VEREN KISIM BURASIYDI, ŞİMDİ DÜZELDİ:
const inputStyle: React.CSSProperties = { 
  width: '100%', 
  padding: '8px', 
  marginTop: '5px', 
  borderRadius: '4px', 
  border: '1px solid #ddd', 
  boxSizing: 'border-box' // Artık React.CSSProperties sayesinde bunun geçerli bir değer olduğunu biliyor
};

const formGroupStyle: React.CSSProperties = { marginBottom: '10px' };
const saveBtnStyle: React.CSSProperties = { padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const cancelBtnStyle: React.CSSProperties = { padding: '10px 20px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };

const roleBadgeStyle = (roleName?: string): React.CSSProperties => {
  let bg = '#95a5a6';
  if (roleName === 'Admin') bg = '#e74c3c';
  if (roleName === 'Veteriner') bg = '#8e44ad';
  if (roleName === 'User') bg = '#3498db';
  return { backgroundColor: bg, color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem' };
};
'use client';

import { useState, useEffect } from 'react';
import AuthGuard from '../components/AuthGuard';
import Header from '../components/Header';

interface User {
  id: string;
  username: string;
  role: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminUser {
  id: number;
  username: string;
  role: string;
}

export default function AdminPage() {
  return (
    <AuthGuard requiredRole="admin">
      <AdminPageContent />
    </AuthGuard>
  );
}

function AdminPageContent() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // New user form state
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'helper'
  });

  useEffect(() => {
    const saved = localStorage.getItem('minecraftAdmin');
    if (saved) {
      try {
        const userData = JSON.parse(saved);
        setAdminUser(userData);
      } catch (error) {
        console.error('User data parse error:', error);
      }
    }
    loadUsers();
  }, []);

  const handleLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('minecraftAdmin');
    localStorage.removeItem('authToken');
  };

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        console.error('Failed to load users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        setNewUser({ username: '', password: '', role: 'helper' });
        setShowCreateForm(false);
        loadUsers();
        alert('Kullanıcı başarıyla oluşturuldu!');
      } else {
        const data = await response.json();
        alert(data.error || 'Kullanıcı oluşturulamadı');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Bir hata oluştu');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadUsers();
        alert('Kullanıcı başarıyla silindi!');
      } else {
        const data = await response.json();
        alert(data.error || 'Kullanıcı silinemedi');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Bir hata oluştu');
    }
  };

  const updateUser = async (userId: string, updates: any) => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Remove empty password field
      const cleanUpdates = { ...updates };
      if (!cleanUpdates.password || cleanUpdates.password.trim() === '') {
        delete cleanUpdates.password;
      }
      
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cleanUpdates)
      });

      if (response.ok) {
        loadUsers();
        setEditingUser(null);
        alert('Kullanıcı başarıyla güncellendi!');
      } else {
        const data = await response.json();
        alert(data.error || 'Kullanıcı güncellenemedi');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-lg text-gray-300">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-gray-900 text-white">
      <Header 
        user={adminUser}
        onLogout={handleLogout}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-red-400">👑 Admin Panel</h1>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              ➕ Yeni Kullanıcı
            </button>
          </div>

          {/* Create User Modal */}
          {showCreateForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-green-400 mb-4">Yeni Kullanıcı Oluştur</h2>
                <form onSubmit={createUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Kullanıcı Adı
                    </label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Şifre
                    </label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Rol
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="helper">Helper</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      Oluştur
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit User Modal */}
          {editingUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-blue-400 mb-4">Kullanıcı Düzenle</h2>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const updates = {
                    role: formData.get('role') as string,
                    isActive: formData.get('isActive') === 'on',
                    password: formData.get('password') as string
                  };
                  updateUser(editingUser.id, updates);
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Kullanıcı Adı (Değiştirilemez)
                    </label>
                    <input
                      type="text"
                      value={editingUser.username}
                      disabled
                      className="w-full px-3 py-2 bg-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Yeni Şifre (Boş bırakılırsa değişmez)
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Yeni şifre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Rol
                    </label>
                    <select
                      name="role"
                      defaultValue={editingUser.role}
                      className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="helper">Helper</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      id="isActive"
                      defaultChecked={editingUser.isActive}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="text-sm text-gray-300">
                      Aktif kullanıcı
                    </label>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Güncelle
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="bg-gray-900 rounded-xl overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="text-gray-300 border-b border-gray-700">
                  <th className="px-6 py-3 font-medium">Kullanıcı Adı</th>
                  <th className="px-6 py-3 font-medium">Rol</th>
                  <th className="px-6 py-3 font-medium">Durum</th>
                  <th className="px-6 py-3 font-medium">Son Giriş</th>
                  <th className="px-6 py-3 font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="px-6 py-4 font-medium text-white">{user.username}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                        user.role === 'moderator' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {user.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString('tr-TR') : 'Hiç'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                        >
                          ✏️ Düzenle
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors"
                        >
                          🗑️ Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              Henüz kullanıcı bulunmamaktadır.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

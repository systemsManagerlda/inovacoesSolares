/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { 
  User, 
  Heart, 
  Package, 
  LogOut, 
  MapPin,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit2,
  Camera,
  Bell,
  Lock,
  Globe,
  X,
  Plus,
  Trash2
} from 'lucide-react'
import Image from 'next/image'

interface Order {
  id: string
  date: string
  total: number
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled'
  items: number
  trackingCode?: string
}

interface Address {
  id: string
  name: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  province: string
  isDefault: boolean
}

interface UserData {
  name: string
  email: string
  phone: string
  avatar?: string
  addresses: Address[]
  orders: Order[]
  wishlist: number[]
  preferences: {
    emailNotifications: boolean
    twoFactorAuth: boolean
    language: string
  }
}

// Dados iniciais vazios
const emptyUserData: UserData = {
  name: '',
  email: '',
  phone: '',
  avatar: undefined,
  addresses: [],
  orders: [],
  wishlist: [],
  preferences: {
    emailNotifications: true,
    twoFactorAuth: false,
    language: 'pt'
  }
}

const statusConfig = {
  delivered: { label: 'Entregue', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
  shipped: { label: 'Enviado', icon: Truck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  processing: { label: 'Processando', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  cancelled: { label: 'Cancelado', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' }
}

interface UserMenuProps {
  isOpen: boolean
  onClose: () => void
  onLogout?: () => void
}

export default function UserMenu({ isOpen, onClose, onLogout }: UserMenuProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'wishlist'>('profile')
  const [userData, setUserData] = useState<UserData>(emptyUserData)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' })
  const [newAddress, setNewAddress] = useState<Partial<Address>>({})
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Carregar dados do localStorage ao montar o componente
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedUser = localStorage.getItem('userData')
        const savedOrders = localStorage.getItem('userOrders')
        const savedAddresses = localStorage.getItem('userAddresses')
        const savedWishlist = localStorage.getItem('userWishlist')
        const savedPreferences = localStorage.getItem('userPreferences')
        
        if (savedUser) {
          const user = JSON.parse(savedUser)
          setUserData(prev => ({
            ...prev,
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            avatar: user.avatar
          }))
          setIsLoggedIn(!!user.email)
        }
        
        if (savedOrders) {
          setUserData(prev => ({ ...prev, orders: JSON.parse(savedOrders) }))
        }
        
        if (savedAddresses) {
          setUserData(prev => ({ ...prev, addresses: JSON.parse(savedAddresses) }))
        }
        
        if (savedWishlist) {
          setUserData(prev => ({ ...prev, wishlist: JSON.parse(savedWishlist) }))
        }
        
        if (savedPreferences) {
          setUserData(prev => ({ ...prev, preferences: JSON.parse(savedPreferences) }))
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error)
      }
    }
    
    loadUserData()
  }, [])

  // Salvar dados no localStorage quando houver alterações
  useEffect(() => {
    if (userData.name || userData.email) {
      localStorage.setItem('userData', JSON.stringify({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        avatar: userData.avatar
      }))
    }
  }, [userData.name, userData.email, userData.phone, userData.avatar])

  useEffect(() => {
    localStorage.setItem('userOrders', JSON.stringify(userData.orders))
  }, [userData.orders])

  useEffect(() => {
    localStorage.setItem('userAddresses', JSON.stringify(userData.addresses))
  }, [userData.addresses])

  useEffect(() => {
    localStorage.setItem('userWishlist', JSON.stringify(userData.wishlist))
  }, [userData.wishlist])

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(userData.preferences))
  }, [userData.preferences])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const handleEditProfile = () => {
    if (isEditing) {
      setUserData({ 
        ...userData, 
        name: editForm.name, 
        email: editForm.email, 
        phone: editForm.phone 
      })
    } else {
      setEditForm({ 
        name: userData.name, 
        email: userData.email, 
        phone: userData.phone 
      })
    }
    setIsEditing(!isEditing)
  }

  const handleAddAddress = () => {
    if (newAddress.street && newAddress.number && newAddress.neighborhood && newAddress.city && newAddress.province) {
      const address: Address = {
        id: Date.now().toString(),
        name: newAddress.name || 'Novo Endereço',
        street: newAddress.street!,
        number: newAddress.number!,
        complement: newAddress.complement,
        neighborhood: newAddress.neighborhood!,
        city: newAddress.city!,
        province: newAddress.province!,
        isDefault: userData.addresses.length === 0
      }
      setUserData({ ...userData, addresses: [...userData.addresses, address] })
      setNewAddress({})
      setShowAddAddress(false)
    }
  }

  const setDefaultAddress = (id: string) => {
    setUserData({
      ...userData,
      addresses: userData.addresses.map(addr => ({ ...addr, isDefault: addr.id === id }))
    })
  }

  const deleteAddress = (id: string) => {
    setUserData({
      ...userData,
      addresses: userData.addresses.filter(addr => addr.id !== id)
    })
  }

  const updatePreference = (key: keyof UserData['preferences'], value: any) => {
    setUserData({
      ...userData,
      preferences: { ...userData.preferences, [key]: value }
    })
  }

  const addToWishlist = (productId: number) => {
    if (!userData.wishlist.includes(productId)) {
      setUserData({
        ...userData,
        wishlist: [...userData.wishlist, productId]
      })
    }
  }

  const removeFromWishlist = (productId: number) => {
    setUserData({
      ...userData,
      wishlist: userData.wishlist.filter(id => id !== productId)
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(price)
  }

  const handleLogoutClick = () => {
    // Limpar dados da sessão (opcional)
    // localStorage.removeItem('userData')
    // localStorage.removeItem('userOrders')
    // localStorage.removeItem('userAddresses')
    // localStorage.removeItem('userWishlist')
    // localStorage.removeItem('userPreferences')
    setIsLoggedIn(false)
    setUserData(emptyUserData)
    if (onLogout) onLogout()
    onClose()
  }

  if (!isOpen) return null

  // Se não estiver logado, mostrar tela de login
  if (!isLoggedIn && !userData.email) {
    return (
      <>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
        <div 
          ref={menuRef}
          className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-b from-gray-900 to-black z-50 shadow-2xl border-l border-blue-500/20 animate-slide-in"
        >
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User size={40} className="text-black" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo!</h2>
            <p className="text-gray-400 text-center mb-6">
              Faça login ou cadastre-se para acessar sua conta
            </p>
            <div className="space-y-3 w-full">
              <button 
                onClick={() => {
                  // Simular login com dados de exemplo
                  const demoUser = {
                    name: 'Usuário Demo',
                    email: 'demo@email.com',
                    phone: '84 123 4567'
                  }
                  localStorage.setItem('userData', JSON.stringify(demoUser))
                  setUserData(prev => ({ 
                    ...prev, 
                    name: demoUser.name, 
                    email: demoUser.email, 
                    phone: demoUser.phone 
                  }))
                  setIsLoggedIn(true)
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-black font-bold rounded-lg hover:from-blue-400 hover:to-blue-500 transition-all"
              >
                Entrar como Demo
              </button>
              <button 
                onClick={onClose}
                className="w-full py-3 bg-gray-800/50 border border-blue-500/30 rounded-lg text-gray-400 hover:text-white transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      
      {/* Menu lateral */}
      <div 
        ref={menuRef}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-b from-gray-900 to-black z-50 shadow-2xl border-l border-blue-500/20 animate-slide-in"
      >
        {/* Header */}
        <div className="relative p-6 border-b border-blue-500/20 bg-blue-500/5">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white">
            <X size={20} />
          </button>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-md" />
              <div className="relative w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                {userData.avatar ? (
                  <Image src={userData.avatar} alt={userData.name} fill className="rounded-full object-cover" />
                ) : (
                  <User size={32} className="text-black" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 p-1 bg-gray-800 rounded-full border border-blue-500/30 hover:bg-blue-500/20 transition-colors">
                <Camera size={12} className="text-blue-400" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{userData.name || 'Usuário'}</h2>
              <p className="text-sm text-gray-400">{userData.email || 'Sem e-mail'}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-blue-500/20">
          {[
            { id: 'profile', label: 'Perfil', icon: User },
            { id: 'orders', label: 'Pedidos', icon: Package, badge: userData.orders.filter(o => o.status === 'processing').length },
            { id: 'addresses', label: 'Endereços', icon: MapPin, badge: userData.addresses.length },
            { id: 'wishlist', label: 'Favoritos', icon: Heart, badge: userData.wishlist.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-sm font-medium transition-all relative ${
                activeTab === tab.id ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <tab.icon size={16} />
                <span>{tab.label}</span>
                {(tab.badge ?? 0) > 0 && (
                  <span className="bg-blue-500 text-black text-xs px-1.5 py-0.5 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </div>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600" />
              )}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-180px)]">
          {/* Perfil */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Informações Pessoais</h3>
                <button onClick={handleEditProfile} className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                  {isEditing ? <CheckCircle size={14} /> : <Edit2 size={14} />}
                  {isEditing ? 'Salvar' : 'Editar'}
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-800/30 rounded-xl p-4 border border-blue-500/20">
                  <label className="text-xs text-gray-500">Nome completo</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-400"
                    />
                  ) : (
                    <p className="text-white mt-1">{userData.name || 'Não informado'}</p>
                  )}
                </div>
                
                <div className="bg-gray-800/30 rounded-xl p-4 border border-blue-500/20">
                  <label className="text-xs text-gray-500">E-mail</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-400"
                    />
                  ) : (
                    <p className="text-white mt-1">{userData.email || 'Não informado'}</p>
                  )}
                </div>
                
                <div className="bg-gray-800/30 rounded-xl p-4 border border-blue-500/20">
                  <label className="text-xs text-gray-500">Telefone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-400"
                    />
                  ) : (
                    <p className="text-white mt-1">{userData.phone || 'Não informado'}</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-blue-500/20">
                <h3 className="text-lg font-semibold text-white mb-3">Preferências</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl border border-blue-500/20">
                    <div className="flex items-center gap-2">
                      <Bell size={18} className="text-blue-400" />
                      <span className="text-gray-300">Notificações por e-mail</span>
                    </div>
                    <button 
                      onClick={() => updatePreference('emailNotifications', !userData.preferences.emailNotifications)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${userData.preferences.emailNotifications ? 'bg-blue-500' : 'bg-gray-600'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${userData.preferences.emailNotifications ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl border border-blue-500/20">
                    <div className="flex items-center gap-2">
                      <Lock size={18} className="text-blue-400" />
                      <span className="text-gray-300">Autenticação em duas etapas</span>
                    </div>
                    <button 
                      onClick={() => updatePreference('twoFactorAuth', !userData.preferences.twoFactorAuth)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${userData.preferences.twoFactorAuth ? 'bg-blue-500' : 'bg-gray-600'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${userData.preferences.twoFactorAuth ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl border border-blue-500/20">
                    <div className="flex items-center gap-2">
                      <Globe size={18} className="text-blue-400" />
                      <span className="text-gray-300">Idioma</span>
                    </div>
                    <select 
                      value={userData.preferences.language}
                      onChange={(e) => updatePreference('language', e.target.value)}
                      className="bg-transparent text-gray-300 text-sm focus:outline-none"
                    >
                      <option value="pt">Português</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogoutClick}
                className="w-full mt-6 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                <span>Sair da conta</span>
              </button>
            </div>
          )}

          {/* Pedidos */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {userData.orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={48} className="text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Nenhum pedido encontrado</p>
                  <Link href="/produtos" className="inline-block mt-3 text-blue-400 hover:text-blue-300">Começar a comprar →</Link>
                </div>
              ) : (
                userData.orders.map(order => {
                  const status = statusConfig[order.status as keyof typeof statusConfig]
                  const StatusIcon = status.icon
                  return (
                    <div key={order.id} className="bg-gray-800/30 rounded-xl border border-blue-500/20 p-4 hover:border-blue-400/40 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm text-gray-400">Pedido #{order.id}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar size={12} />
                            {order.date}
                          </p>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${status.bg}`}>
                          <StatusIcon size={12} className={status.color} />
                          <span className={`text-xs ${status.color}`}>{status.label}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-bold">{formatPrice(order.total)}</p>
                          <p className="text-xs text-gray-500">{order.items} item(s)</p>
                        </div>
                        <div className="flex gap-2">
                          {order.trackingCode && (
                            <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                              <Truck size={12} />
                              Rastrear
                            </button>
                          )}
                          <Link href={`/pedido/${order.id}`} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            <Eye size={12} />
                            Detalhes
                          </Link>
                        </div>
                      </div>
                      {order.status === 'shipped' && order.trackingCode && (
                        <div className="mt-3 pt-3 border-t border-blue-500/20">
                          <p className="text-xs text-gray-400">Código de rastreio: <span className="text-blue-400 font-mono">{order.trackingCode}</span></p>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* Endereços */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <button
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="w-full py-3 border border-dashed border-blue-500/30 rounded-xl text-blue-400 hover:text-blue-300 hover:border-blue-400/50 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                <span>Adicionar novo endereço</span>
              </button>

              {showAddAddress && (
                <div className="bg-gray-800/30 rounded-xl border border-blue-500/20 p-4">
                  <h4 className="text-white font-medium mb-3">Novo Endereço</h4>
                  <div className="space-y-2">
                    <input type="text" placeholder="Nome do endereço (ex: Casa, Trabalho)" value={newAddress.name || ''}
                      onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white text-sm" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="Rua/Avenida" value={newAddress.street || ''}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white text-sm" />
                      <input type="text" placeholder="Número" value={newAddress.number || ''}
                        onChange={(e) => setNewAddress({ ...newAddress, number: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white text-sm" />
                    </div>
                    <input type="text" placeholder="Complemento" value={newAddress.complement || ''}
                      onChange={(e) => setNewAddress({ ...newAddress, complement: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white text-sm" />
                    <input type="text" placeholder="Bairro" value={newAddress.neighborhood || ''}
                      onChange={(e) => setNewAddress({ ...newAddress, neighborhood: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white text-sm" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="Cidade" value={newAddress.city || ''}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white text-sm" />
                      <select value={newAddress.province || ''} onChange={(e) => setNewAddress({ ...newAddress, province: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-white text-sm">
                        <option value="">Província</option>
                        <option>Maputo Cidade</option><option>Maputo Província</option><option>Gaza</option>
                        <option>Inhambane</option><option>Sofala</option><option>Manica</option>
                        <option>Tete</option><option>Zambézia</option><option>Nampula</option>
                        <option>Niassa</option><option>Cabo Delgado</option>
                      </select>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={handleAddAddress} className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-black font-medium rounded-lg">Salvar</button>
                      <button onClick={() => setShowAddAddress(false)} className="flex-1 py-2 bg-gray-800/50 border border-blue-500/30 rounded-lg text-gray-400">Cancelar</button>
                    </div>
                  </div>
                </div>
              )}

              {userData.addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin size={48} className="text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Nenhum endereço cadastrado</p>
                  <p className="text-gray-500 text-sm mt-1">Adicione um endereço para agilizar suas compras</p>
                </div>
              ) : (
                userData.addresses.map(addr => (
                  <div key={addr.id} className="bg-gray-800/30 rounded-xl border border-blue-500/20 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-blue-400" />
                        <h4 className="font-medium text-white">{addr.name}</h4>
                        {addr.isDefault && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Padrão</span>}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setDefaultAddress(addr.id)} className="p-1 text-gray-500 hover:text-blue-400" title="Definir como padrão">
                          <CheckCircle size={14} />
                        </button>
                        <button onClick={() => deleteAddress(addr.id)} className="p-1 text-gray-500 hover:text-red-400" title="Remover">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">{addr.street}, {addr.number}{addr.complement && `, ${addr.complement}`}</p>
                    <p className="text-gray-400 text-sm">{addr.neighborhood}, {addr.city} - {addr.province}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Favoritos */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              {userData.wishlist.length === 0 ? (
                <div className="text-center py-12">
                  <Heart size={48} className="text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Sua lista de favoritos está vazia</p>
                  <Link href="/produtos" className="inline-block mt-3 text-blue-400 hover:text-blue-300">Explorar produtos →</Link>
                </div>
              ) : (
                userData.wishlist.map(id => (
                  <div key={id} className="bg-gray-800/30 rounded-xl border border-blue-500/20 p-4 flex gap-3">
                    <div className="w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center">
                      <Package size={32} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Produto #{id}</h4>
                      <p className="text-blue-400 font-bold">Aguardando preço</p>
                      <div className="flex gap-2 mt-2">
                        <button className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-black px-3 py-1 rounded-lg hover:from-blue-400 hover:to-blue-500 transition-all">
                          Ver produto
                        </button>
                        <button 
                          onClick={() => removeFromWishlist(id)}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  )
}
import { Edit, Mail, MapPin, Phone, Save, Shield, User } from "lucide-react";
import { useState } from "react"

export default function ProfilePage() {

   const [activeTab, setActiveTab]= useState('personal');
   const [isEditing, setIsEditing] = useState(false);
   const [showChangePassword, setShowChangePassword]= useState(false);
   const [editForm, setEditForm]= useState({
      name: '',
      email: '',
      phone: '',
      address: ''
   })
   // Giả lập dữ liệu
   const [userProfile, setUserProfile] = useState({
      id: 1,
      name: 'Nguyễn Văn Admin',
      email: 'admin@busmanager.com',
      phone: '0901234567',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      role: 'admin',
      avatar: null,
      createdAt: '2024-01-15',
      lastLogin: '2024-10-04 09:30',
      loginCount: 156,
      profileCompleted: 90,
      twoFactorEnabled: false,
      preferences: {
      language: 'vi',
      timezone: 'Asia/Ho_Chi_Minh',
      theme: 'light'
      },
      statistics: {
      totalLogins: 156,
      averageSessionTime: '2h 30m',
      lastActive: '2024-10-04 09:30',
      deviceCount: 3
      }
   })
   const handleSaveProfile = () => { // Hàm chỉnh sửa
      setIsEditing(false)
      alert('Thông tin cá nhân đã được cập nhật!')
   }
   
   const getRoleColor = (role) => { // Lấy màu role
      const colorMap = {
      admin: 'bg-red-100 text-red-800',
      dispatch: 'bg-blue-100 text-blue-800',
      driver: 'bg-green-100 text-green-800',
      parent: 'bg-yellow-100 text-yellow-800'
      }
      return colorMap[role] || 'bg-gray-100 text-gray-800'
   }
   const getRoleName = (role) => { // Lấy role dựa trên name
      const roleMap = {
      admin: 'Quản trị viên',
      dispatch: 'Điều phối',
      driver: 'Tài xế',
      parent: 'Phụ huynh'
      }
      return roleMap[role] || role
   }

   const tabs = [ // Các thanh điều hướng
      { id: 'personal', label: 'Thông tin cá nhân', icon: User },
      { id: 'security', label: 'Bảo mật', icon: Shield },
   ]
   
   return (
      <>
         <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-6">
               <div className="flex items-center space-x-6">
                  <div className="relative">
                     {/* Avatar mặc định */}
                     <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full 
                                             flex items-center justify-center text-white text-2xl font-bold">
                        {userProfile.name.charAt(0)}
                     </div>
                  </div>

                  {/* Information */}
                  <div className="flex-1">
                     <h1 className="text-2xl font-bold text-gray-900">
                        {userProfile.name}
                     </h1> 
                     <p className="text-gray-600">
                        {userProfile.email}
                     </p>

                     <div className="flex items-center space-x-4 mt-2">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold 
                                             rounded-full ${getRoleColor(userProfile.role)}`}>
                           {getRoleName(userProfile.role)}
                        </span>
                     </div>
                  </div>
               </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow">
               {/* 2 Nút thông tin và sercurity */}
               <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8 px-6">
                     {tabs.map((tab) =>(
                        <button 
                           key={tab.id}
                           onClick={() => setActiveTab(tab.id)}
                           className={`${
                                 activeTab===tab.id
                                 ? 'border-blue-500 text-blue-600'
                                 : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                           } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                        >
                           <tab.icon className="h-4 w-4 mr-2"></tab.icon>
                           {tab.label}
                        </button>
                     ))}
                  </nav>
               </div>

               <div className="p-6">
                  {/* Trang của tab Info */}
                  {activeTab === 'personal'  && (
                     <div className="space-y-6">
                        <div className="flex justify-between items-center"> 
                           <h2 className="text-lg font-medium text-gray-900">Thông tin cá nhân</h2>
                           <button
                                 onClick={() => setIsEditing(!isEditing)}
                                 className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                           >
                                 <Edit className="h-4 w-4 mr-2"></Edit>
                                 {isEditing ? 'Hủy' : 'Chỉnh Sửa'}
                           </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
                           {/* Họ Tên */}
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                 <User className="h-4 w-4 inline mr-2"></User>
                                 Họ Tên
                              </label>

                              {isEditing ? (
                                 <input type="text" 
                                          value={editForm.name}
                                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                 />
                              ) :(
                                 <p className="text-gray-900">{userProfile.name}</p>
                              )}
                           </div>
                           
                           {/* Email */}
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                 <Mail className="h-4 w-4 inline mr-2" ></Mail>
                                 Email
                              </label>

                              {isEditing ?(
                                 <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                 />
                              ) : (
                                 <p className="text-gray-900">{userProfile.email}</p>
                              )}
                           </div>
                           
                           {/* Phone */}
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                 <Phone className="h-4 w-4 inline mr-2" />
                                 Số Điện Thoại
                              </label>
                              {isEditing ? (
                                 <input
                                    type="tel"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                 />
                                 ) : (
                                 <p className="text-gray-900">{userProfile.phone}</p>
                                 )}
                           </div>

                           {/* Vai trò */}
                           <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                              <Shield className="h-4 w-4 inline mr-2" />
                              Vai trò
                              </label>
                              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getRoleColor(userProfile.role)}`}>
                              {getRoleName(userProfile.role)}
                              </span>
                           </div>

                           {/* Địa chỉ */}
                           <div className="md:col-span-2"> 
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                 <MapPin className="h-4 w-4 inline mr-2" />
                                 Địa Chỉ
                              </label>
                              {isEditing ? (
                                 <textarea
                                 value={editForm.address}
                                 onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                 rows={3}
                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                 />
                              ) : (
                                 <p className="text-gray-900">{userProfile.address}</p>
                              )}
                           </div>
                        </div>

                        {/* Nút sửa */}
                        {isEditing && (
                           <div className="flex justify-end space-x-3">
                              <button
                                 onClick={() => setIsEditing(false)}
                                 className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                              >
                                 Hủy
                              </button>
                              <button
                                 onClick={() => handleSaveProfile()}
                                 className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                              >
                                 <Save className="h-4 w-4 mr-2"></Save>
                                 Lưu thay đổi
                              </button>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            </div>
         </div>
      </>
   )
};
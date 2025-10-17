import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function UsersPage() {
   const navigate = useNavigate() // Dùng để chuyển hướng trang (hook)
   const [users, setUsers] = useState([]) // Danh sách user
   const [filteredUsers, setFilteredUsers] = useState([]) // Danh sách user sau lọc
   const [searchTerm, setSearchTerm] = useState('') // Ký tự tìm kiếm
   const [selectedRole, setSelectedRole] = useState('all') // Bộ lọc role
   const [selectedStatus, setSelectedStatus] = useState('all') // Bộ lọc trạng thái
   const [showCreateModal, setShowCreateModal] = useState(false) // Trạng thái tạo user
   const [showEditModal, setShowEditModal] = useState(false) // Trạng thái sửa
   const [editingUser, setEditingUser] = useState(null) // Đối tượng user sửa
   const [newUser, setNewUser] = useState({ // Giả lập dữ liệu sửa 
      name: '',
      email: '',
      phone: '',
      role: 'parent',
      status: 'active',
      address: ''
   })

   // Demo data
   const demoUsers = [
      {
         id: 1,
         name: 'Nguyễn Văn Admin',
         email: 'admin@busmanager.com',
         phone: '0901234567',
         role: 'admin',
         status: 'active',
         address: '123 Đường ABC, Quận 1, TP.HCM',
         createdAt: '2024-01-15',
         lastLogin: '2024-10-04'
      },
      {
         id: 2,
         name: 'Trần Thị Dispatch',
         email: 'dispatch@busmanager.com',
         phone: '0902345678',
         role: 'dispatch',
         status: 'active',
         address: '456 Đường DEF, Quận 2, TP.HCM',
         createdAt: '2024-02-01',
         lastLogin: '2024-10-03'
      },
      {
         id: 3,
         name: 'Lê Văn Tài Xế',
         email: 'driver1@busmanager.com',
         phone: '0903456789',
         role: 'driver',
         status: 'active',
         address: '789 Đường GHI, Quận 3, TP.HCM',
         createdAt: '2024-02-15',
         lastLogin: '2024-10-04'
      },
      {
         id: 4,
         name: 'Phạm Thị Phụ Huynh',
         email: 'parent1@gmail.com',
         phone: '0904567890',
         role: 'parent',
         status: 'active',
         address: '321 Đường JKL, Quận 4, TP.HCM',
         createdAt: '2024-03-01',
         lastLogin: '2024-10-02'
      },
      {
         id: 5,
         name: 'Hoàng Văn Driver 2',
         email: 'driver2@busmanager.com',
         phone: '0905678901',
         role: 'driver',
         status: 'inactive',
         address: '654 Đường MNO, Quận 5, TP.HCM',
         createdAt: '2024-03-15',
         lastLogin: '2024-09-30'
      }
   ]

   useEffect(() => {
      setUsers(demoUsers)
      setFilteredUsers(demoUsers)
   }, [])
   return (
      <>
         <div className="flex justify-center items-center">
            <h1 className="text-3xl font-bold">Users</h1>
         </div>
      </>
   )
};
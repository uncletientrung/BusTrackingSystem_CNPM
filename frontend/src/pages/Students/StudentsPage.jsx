import { Check, Users2, XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function StudentsPage() {
   const navigate = useNavigate() // Dùng để chuyển hướng trang (hook)
   const [students, setStudents] = useState([]) // Danh sách học sinh
   const [filteredStudents, setFilteredStudents] = useState([]) // Danh sách học sinh sau lọc
   const [searchTerm, setSearchTerm] = useState('') // Ký tự tìm
   const [selectedGrade, setSelectedGrade] = useState('all')
   const [selectedRoute, setSelectedRoute] = useState('all')
   const [selectedStatus, setSelectedStatus] = useState('all')
   const [showCreateModal, setShowCreateModal] = useState(false) // Trạng thái thêm student
   const [showEditModal, setShowEditModal] = useState(false) // Trạng thái sửa student
   const [editingStudent, setEditingStudent] = useState(null) // Đối tượng sửa
   const [newStudent, setNewStudent] = useState({
      name: '',
      studentId: '',
      grade: '1',
      parentName: '',
      parentPhone: '',
      address: '',
      route: '',
      pickupPoint: '',
      status: 'active'
   })

   // Giả lập dữ liệu
   const demoStudents = [
      {
         id: 1,
         name: 'Nguyễn Văn An',
         studentId: 'HS001',
         grade: '1',
         parentName: 'Nguyễn Thị Bình',
         parentPhone: '0901234567',
         parentEmail: 'parent1@gmail.com',
         address: '123 Đường ABC, Quận 1, TP.HCM',
         route: 'Tuyến A',
         routeId: 'route-1',
         pickupPoint: 'Điểm đón A1 - Chợ Bến Thành',
         pickupTime: '07:00',
         dropoffTime: '16:30',
         status: 'active',
         avatar: null,
         emergencyContact: '0987654321',
         medicalNotes: 'Không có',
         createdAt: '2024-01-15',
         attendance: {
            present: 45,
            absent: 3,
            late: 2
         }
      },
      {
         id: 2,
         name: 'Trần Thị Bảo',
         studentId: 'HS002',
         grade: '2',
         parentName: 'Trần Văn Cường',
         parentPhone: '0902345678',
         parentEmail: 'parent2@gmail.com',
         address: '456 Đường DEF, Quận 2, TP.HCM',
         route: 'Tuyến B',
         routeId: 'route-2',
         pickupPoint: 'Điểm đón B2 - Trường THCS Nam Sài Gòn',
         pickupTime: '07:15',
         dropoffTime: '16:45',
         status: 'active',
         avatar: null,
         emergencyContact: '0987654322',
         medicalNotes: 'Dị ứng với đậu phộng',
         createdAt: '2024-02-01',
         attendance: {
            present: 42,
            absent: 5,
            late: 3
         }
      },
      {
         id: 3,
         name: 'Lê Văn Cao',
         studentId: 'HS003',
         grade: '3',
         parentName: 'Lê Thị Dung',
         parentPhone: '0903456789',
         parentEmail: 'parent3@gmail.com',
         address: '789 Đường GHI, Quận 3, TP.HCM',
         route: 'Tuyến A',
         routeId: 'route-1',
         pickupPoint: 'Điểm đón A3 - Công viên Tao Đàn',
         pickupTime: '07:30',
         dropoffTime: '17:00',
         status: 'inactive',
         avatar: null,
         emergencyContact: '0987654323',
         medicalNotes: 'Không có',
         createdAt: '2024-02-15',
         attendance: {
            present: 38,
            absent: 8,
            late: 4
         }
      },
      {
         id: 4,
         name: 'Phạm Thị Diễm',
         studentId: 'HS004',
         grade: '1',
         parentName: 'Phạm Văn Em',
         parentPhone: '0904567890',
         parentEmail: 'parent4@gmail.com',
         address: '321 Đường JKL, Quận 4, TP.HCM',
         route: 'Tuyến C',
         routeId: 'route-3',
         pickupPoint: 'Điểm đón C1 - Chợ Tân Định',
         pickupTime: '06:45',
         dropoffTime: '16:15',
         status: 'active',
         avatar: null,
         emergencyContact: '0987654324',
         medicalNotes: 'Cần thuốc hen suyễn',
         createdAt: '2024-03-01',
         attendance: {
            present: 40,
            absent: 6,
            late: 4
         }
      },
      {
         id: 5,
         name: 'Hoàng Văn Phong',
         studentId: 'HS005',
         grade: '4',
         parentName: 'Hoàng Thị Giang',
         parentPhone: '0905678901',
         parentEmail: 'parent5@gmail.com',
         address: '654 Đường MNO, Quận 5, TP.HCM',
         route: 'Tuyến B',
         routeId: 'route-2',
         pickupPoint: 'Điểm đón B4 - Bệnh viện Nhi Đồng 1',
         pickupTime: '07:00',
         dropoffTime: '16:30',
         status: 'active',
         avatar: null,
         emergencyContact: '0987654325',
         medicalNotes: 'Không có',
         createdAt: '2024-03-15',
         attendance: {
            present: 44,
            absent: 4,
            late: 2
         }
      }
   ]

   const routes = [
      { id: 'route-1', name: 'Tuyến A' },
      { id: 'route-2', name: 'Tuyến B' },
      { id: 'route-3', name: 'Tuyến C' }
   ]

   // useEffect(() => {
   //    // Filter students based on user role
   //    let filteredByRole = demoStudents
   //    if (user?.role === 'parent') {
   //       // In real app, this would filter by parent's children
   //       filteredByRole = demoStudents.filter(student =>
   //          student.parentEmail === user.email
   //       )
   //    }
   //    setStudents(filteredByRole)
   //    setFilteredStudents(filteredByRole)
   // }, [user])

   useEffect(() => { // Lọc dữ liệu dựa trên tìm kiếm
      let filtered = students
      if (searchTerm) { // Tìm dựa trên search
         filtered = filtered.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.parentPhone.includes(searchTerm)
         )
      }
      // Tìm dựa trên lớp
      if (selectedGrade !== 'all') {
         filtered = filtered.filter(student => student.grade === selectedGrade)
      }
      // Tìm dựa trên tuyến
      if (selectedRoute !== 'all') {
         filtered = filtered.filter(student => student.routeId === selectedRoute)
      }
      // Tìm dựa trên trạng thái
      if (selectedStatus !== 'all') {
         filtered = filtered.filter(student => student.status === selectedStatus)
      }

      setFilteredStudents(filtered)
   }, [students, searchTerm, selectedGrade, selectedRoute, selectedStatus])

   const handleCreateStudent = () => { // Hàm xử lý thêm student
      const student = {
         id: students.length + 1,
         ...newStudent,
         createdAt: new Date().toISOString().split('T')[0],
         attendance: {
            present: 0,
            absent: 0,
            late: 0
         },
         emergencyContact: '',
         medicalNotes: 'Không có'
      }
      setStudents([...students, student])
      setShowCreateModal(false)
      setNewStudent({
         name: '',
         studentId: '',
         grade: '1',
         parentName: '',
         parentPhone: '',
         address: '',
         route: '',
         pickupPoint: '',
         status: 'active'
      })
   }

   const handleEditStudent = () => { // Hàm xử lý sửa
      setStudents(students.map(student =>
         student.id === editingStudent.id ? editingStudent : student
      ))
      setShowEditModal(false)
      setEditingStudent(null)
   }

   const handleDeleteStudent = (id) => { // Hàm xử lý xóa
      if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này?')) {
         setStudents(students.filter(student => student.id !== id))
      }
   }


   const getStatusColor = (status) => { // Màu trạng thái 
      return status === 'active'
         ? 'bg-green-100 text-green-800'
         : 'bg-red-100 text-red-800'
   }

   // Thống kê nhanh
   const stats = [
      {
         name: 'Tổng học sinh',
         value: students.length,
         icon: Users2,
         color: 'bg-blue-500'
      },
      {
         name: 'Đang học',
         value: students.filter(s => s.status === 'active').length,
         icon: Check,
         color: 'bg-green-500'
      },
      {
         name: 'Tạm nghỉ',
         value: students.filter(s => s.status === 'inactive').length,
         icon: XCircle,
         color: 'bg-red-500'
      }
   ]


   return (
      <>
         <div className="flex justify-center items-center">
            <h1 className="text-3xl font-bold">Students</h1>
         </div>
      </>
   )
};
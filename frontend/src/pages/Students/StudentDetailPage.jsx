import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  GraduationCap,
  MapPin,
  Phone,
  Route,
  Trash2,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function StudentDetailPage() {
  const { id } = useParams(); // Dùng để lấy id trên thanh URL
  const navigate = useNavigate();
  const [student, setStudent] = useState(null); // Học sinh được chọn
  const [loading, setLoading] = useState(true); // trạng thái loading
  const [activeTab, setActiveTab] = useState("info");
  const [showEditModal, setShowEditModal] = useState(false); // Trạng thái dialog sửa
  const [editingStudent, setEditingStudent] = useState(null); // đối tượng sửa

  // Giả lập dữ liệu
  const demoStudents = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      studentId: "HS001",
      grade: "1",
      parentName: "Nguyễn Thị Bình",
      parentPhone: "0901234567",
      parentEmail: "parent1@gmail.com",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      route: "Tuyến A",
      routeId: "route-1",
      pickupPoint: "Điểm đón A1 - Chợ Bến Thành",
      pickupTime: "07:00",
      dropoffTime: "16:30",
      status: "active",
      avatar: null,
      emergencyContact: "0987654321",
      emergencyContactName: "Nguyễn Văn Cường (Ông nội)",
      medicalNotes: "Không có",
      allergies: [],
      bloodType: "O+",
      createdAt: "2024-01-15",
      enrollmentDate: "2024-01-15",
      attendance: {
        present: 45,
        absent: 3,
        late: 2,
        excused: 1,
      },
      monthlyAttendance: [
        { month: "Tháng 9", present: 18, absent: 1, late: 1, total: 20 },
        { month: "Tháng 8", present: 22, absent: 0, late: 1, total: 23 },
        { month: "Tháng 7", present: 5, absent: 2, late: 0, total: 7 },
      ],
      recentActivities: [
        {
          date: "2024-10-04",
          action: "Đi học đúng giờ",
          type: "attendance",
          status: "success",
        },
        {
          date: "2024-10-03",
          action: "Đi học muộn 15 phút",
          type: "attendance",
          status: "warning",
        },
        {
          date: "2024-10-02",
          action: "Đi học đúng giờ",
          type: "attendance",
          status: "success",
        },
        {
          date: "2024-10-01",
          action: "Vắng mặt có phép",
          type: "attendance",
          status: "info",
        },
        {
          date: "2024-09-30",
          action: "Cập nhật thông tin y tế",
          type: "medical",
          status: "info",
        },
      ],
      grades: {
        math: 8.5,
        literature: 9.0,
        science: 8.0,
        english: 7.5,
        average: 8.25,
      },
      behavior: {
        discipline: "Tốt",
        participation: "Tích cực",
        homework: "Đầy đủ",
        notes: "Học sinh ngoan, tích cực tham gia các hoạt động",
      },
    },
    {
      id: 2,
      name: "Trần Thị Bảo",
      studentId: "HS002",
      grade: "2",
      parentName: "Trần Văn Cường",
      parentPhone: "0902345678",
      parentEmail: "parent2@gmail.com",
      address: "456 Đường DEF, Quận 2, TP.HCM",
      route: "Tuyến B",
      routeId: "route-2",
      pickupPoint: "Điểm đón B2 - Trường THCS Nam Sài Gòn",
      pickupTime: "07:15",
      dropoffTime: "16:45",
      status: "active",
      avatar: null,
      emergencyContact: "0987654322",
      emergencyContactName: "Trần Thị Dung (Bà nội)",
      medicalNotes: "Dị ứng với đậu phộng",
      allergies: ["Đậu phộng", "Tôm"],
      bloodType: "A+",
      createdAt: "2024-02-01",
      enrollmentDate: "2024-02-01",
      attendance: {
        present: 42,
        absent: 5,
        late: 3,
        excused: 2,
      },
      monthlyAttendance: [
        { month: "Tháng 9", present: 16, absent: 2, late: 2, total: 20 },
        { month: "Tháng 8", present: 20, absent: 2, late: 1, total: 23 },
        { month: "Tháng 7", present: 6, absent: 1, late: 0, total: 7 },
      ],
      recentActivities: [
        {
          date: "2024-10-04",
          action: "Đi học đúng giờ",
          type: "attendance",
          status: "success",
        },
        {
          date: "2024-10-03",
          action: "Vắng mặt không phép",
          type: "attendance",
          status: "error",
        },
        {
          date: "2024-10-02",
          action: "Đi học đúng giờ",
          type: "attendance",
          status: "success",
        },
        {
          date: "2024-10-01",
          action: "Đi học muộn 20 phút",
          type: "attendance",
          status: "warning",
        },
        {
          date: "2024-09-30",
          action: "Cập nhật thông tin dị ứng",
          type: "medical",
          status: "info",
        },
      ],
      grades: {
        math: 7.5,
        literature: 8.5,
        science: 7.0,
        english: 8.0,
        average: 7.75,
      },
      behavior: {
        discipline: "Khá",
        participation: "Bình thường",
        homework: "Thỉnh thoảng thiếu",
        notes: "Cần cải thiện tính tự giác",
      },
    },
  ];

  useEffect(() => {
    // Tìm học sinh dựa trên mã
    const foundStudent = demoStudents.find((s) => s.id === parseInt(id));
    setStudent(foundStudent);
    setLoading(false);
  }, [id]);

  const handleEditStudent = () => {
    setStudent(editingStudent);
    setShowEditModal(false);
    setEditingStudent(null);
  };

  const routes = [
    { id: "route-1", name: "Tuyến A" },
    { id: "route-2", name: "Tuyến B" },
    { id: "route-3", name: "Tuyến C" },
  ];

  const handleDeleteStudent = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa học sinh này?")) {
      navigate("/students");
    }
  };

  const toggleStudentStatus = () => {
    const newStatus = student.status === "active" ? "inactive" : "active";
    setStudent({ ...student, status: newStatus });
  };

  const tabs = [
    { id: "info", label: "Thông tin cơ bản", icon: User },
    { id: "attendance", label: "Điểm danh", icon: Calendar },
  ];

  if (loading) {
    // Animation Loading
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Nếu không tìm thấy student với mã
  if (!student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">
          Không tìm thấy học sinh
        </h2>
        <p className="mt-2 text-gray-600">
          Học sinh với ID {id} không tồn tại.
        </p>
        <button
          onClick={() => navigate("/students")}
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Nút quay lại */}
            <button
              onClick={() => navigate("/students")}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Thông tin học sinh
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Chi tiết và theo dõi học sinh
              </p>
            </div>
          </div>

          {/* Kiểm tra Role */}
          <div className="flex space-x-3">
            {/* Nút sửa */}
            <button
              onClick={() => {
                setEditingStudent(student);
                setShowEditModal(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </button>

            <button
              onClick={toggleStudentStatus}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-white ${
                student.status === "active"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {student.status === "active" ? (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Tạm nghỉ
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Kích hoạt
                </>
              )}
            </button>

            <button
              onClick={handleDeleteStudent}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa
            </button>
          </div>
        </div>

        {/* Thông tin học sinh được chọn*/}
        <div className="bg-white rounded-lg shadow p-6">
          {/* Tab */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Nội dung thông tin chi tiết sinh viên*/}
            <div className="p-6">
              {activeTab === "info" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Thông tin học sinh
                    </h3>
                    <div className="space-y-4">
                      {/* Mã học sinh */}
                      <div className="flex items-center">
                        <GraduationCap className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">
                            Mã số học sinh
                          </p>
                          <p className="font-medium">{student.studentId}</p>
                        </div>
                      </div>

                      {/* Họ tên */}
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Họ tên</p>
                          <p className="font-medium">{student.name}</p>
                        </div>
                      </div>

                      {/* Địa chỉ */}
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Địa chỉ</p>
                          <p className="font-medium">{student.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin phụ huynh */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Thông tin phụ huynh
                    </h3>
                    <div className="space-y-4">
                      {/* Tên phụ huynh */}
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Tên phụ huynh</p>
                          <p className="font-medium">{student.parentName}</p>
                        </div>
                      </div>

                      {/* Số điện thoại */}
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Số điện thoại</p>
                          <p className="font-medium">{student.parentPhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thông tin đưa đón */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Thông tin đưa đón
                    </h3>
                    <div className="space-y-4">
                      {/* Tuyến đường */}
                      <div className="flex items-center">
                        <Route className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Tuyến đường</p>
                          <p className="font-medium">{student.route}</p>
                        </div>
                      </div>

                      {/* Điểm đón */}
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Điểm đón</p>
                          <p className="font-medium">{student.pickupPoint}</p>
                        </div>
                      </div>

                      {/* Thời gian của tuyến*/}
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Thời gian</p>
                          <p className="font-medium">
                            {student.pickupTime} - {student.dropoffTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dialog sửa học sinh */}
        {showEditModal && editingStudent && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Chỉnh sửa thông tin học sinh
                  </h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="absolute top-2 right-2 mt-2 mr-2 text-gray-400 hover:text-gray-600"
                  >
                    <X></X>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Ô mã học sinh */}
                  <input
                    type="text"
                    placeholder="Mã số học sinh"
                    disabled
                    value={editingStudent.studentId}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        studentId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Ô tên học sinh */}
                  <input
                    type="text"
                    placeholder="Họ tên học sinh"
                    value={editingStudent.name}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Ô chọn lớp */}
                  <select
                    value={editingStudent.grade}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        grade: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1">Lớp 1</option>
                    <option value="2">Lớp 2</option>
                    <option value="3">Lớp 3</option>
                    <option value="4">Lớp 4</option>
                    <option value="5">Lớp 5</option>
                    <option value="6">Lớp 6</option>
                    <option value="7">Lớp 7</option>
                    <option value="8">Lớp 8</option>
                    <option value="9">Lớp 9</option>
                    <option value="10">Lớp 10</option>
                    <option value="11">Lớp 11</option>
                    <option value="12">Lớp 12</option>
                  </select>

                  {/* Ô ẩn */}
                  <input type="hide" />

                  {/* Ô tên phụ huynh */}
                  <input
                    type="text"
                    placeholder="Tên phụ huynh"
                    value={editingStudent.parentName}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        parentName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Ô số điện thoại phụ huynh */}
                  <input
                    type="tel"
                    placeholder="Số điện thoại phụ huynh"
                    value={editingStudent.parentPhone}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        parentPhone: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Ô chọn tuyến */}
                  <select
                    value={editingStudent.route}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        route: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chọn tuyến đường</option>
                    {routes.map((route) => (
                      <option key={route.id} value={route.name}>
                        {route.name}
                      </option>
                    ))}
                  </select>

                  {/* Ô địa chỉ */}
                  <textarea
                    placeholder="Địa chỉ"
                    value={editingStudent.address}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        address: e.target.value,
                      })
                    }
                    className="col-span-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />

                  {/* Ô điểm đón */}
                  <input
                    type="text"
                    placeholder="Điểm đón"
                    value={editingStudent.pickupPoint}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        pickupPoint: e.target.value,
                      })
                    }
                    className="col-span-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Nút đóng và cập nhật */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleEditStudent}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Cập nhật
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

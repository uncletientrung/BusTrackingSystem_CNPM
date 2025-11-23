import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Bus,
  Route,
  CheckCircle,
  XCircle,
  GraduationCap,
  X,
} from "lucide-react";
import { StudentAPI, UserAPI, StopAPI } from "../../api/apiServices";

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [parentInfo, setParentInfo] = useState(null);
  const [pickupStop, setPickupStop] = useState(null);
  const [dropoffStop, setDropoffStop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const routes = [
    { id: 1, name: "Tuyến 1" },
    { id: 2, name: "Tuyến 2" },
    { id: 3, name: "Tuyến 3" },
  ];

  useEffect(() => {
    setLoading(true);

    // Lấy thông tin học sinh
    StudentAPI.getStudentById(id)
      .then((studentData) => {
        setStudent(studentData);

        // Lấy thông tin phụ huynh
        if (studentData.maph) {
          UserAPI.getAllUsers()
            .then((users) => {
              const parent = users.find((u) => u.mand === studentData.maph);
              setParentInfo(parent);
            })
            .catch((err) => console.error("Error loading parent:", err));
        }

        // Lấy thông tin điểm đón
        if (studentData.madiemdon) {
          StopAPI.getStopById(studentData.madiemdon)
            .then((stop) => setPickupStop(stop))
            .catch((err) => console.error("Error loading pickup stop:", err));
        }

        // Lấy thông tin điểm trả
        if (studentData.madiemtra) {
          StopAPI.getStopById(studentData.madiemtra)
            .then((stop) => setDropoffStop(stop))
            .catch((err) => console.error("Error loading dropoff stop:", err));
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading student:", err);
        setLoading(false);
      });
  }, [id]);

  const handleEditStudent = () => {
    setStudent(editingStudent);
    setShowEditModal(false);
  };

  const handleDeleteStudent = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa học sinh này?")) {
      StudentAPI.deleteStudent(id)
        .then(() => {
          navigate("/students");
        })
        .catch((err) => console.error("Error deleting student:", err));
    }
  };

  const toggleStudentStatus = () => {
    const newStatus = student.trangthai === 1 ? 0 : 1;
    setStudent({ ...student, trangthai: newStatus });
    // TODO: Gọi API để cập nhật trạng thái
  };

  const tabs = [
    { id: "info", label: "Thông tin cơ bản", icon: User },
    { id: "attendance", label: "Điểm danh", icon: Calendar },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">
          Không tìm thấy học sinh
        </h2>
        <p className="mt-2 text-gray-600">Học sinh với ID {id} không tồn tại.</p>
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

          <div className="flex space-x-3">
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
                student.trangthai === 1
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {student.trangthai === 1 ? (
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

        {/* Student Info */}
        <div className="bg-white rounded-lg shadow p-6">
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

            <div className="p-6">
              {activeTab === "info" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Thông tin học sinh
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <GraduationCap className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Mã số học sinh</p>
                          <p className="font-medium">{student.mahs}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Họ tên</p>
                          <p className="font-medium">{student.hoten}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <GraduationCap className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Lớp</p>
                          <p className="font-medium">{student.lop}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Địa chỉ</p>
                          <p className="font-medium">{student.diachi || "Chưa cập nhật"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Thông tin phụ huynh
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Tên phụ huynh</p>
                          <p className="font-medium">
                            {parentInfo ? parentInfo.hoten : "Chưa cập nhật"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Số điện thoại</p>
                          <p className="font-medium">
                            {parentInfo ? parentInfo.sdt : "Chưa cập nhật"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Thông tin đưa đón
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Điểm đón</p>
                          <p className="font-medium">
                            {pickupStop ? pickupStop.tendiem : "Chưa cập nhật"}
                          </p>
                          {pickupStop && (
                            <p className="text-sm text-gray-500">
                              {pickupStop.diachi}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Điểm trả</p>
                          <p className="font-medium">
                            {dropoffStop ? dropoffStop.tendiem : "Chưa cập nhật"}
                          </p>
                          {dropoffStop && (
                            <p className="text-sm text-gray-500">
                              {dropoffStop.diachi}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
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
                    <X />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Mã số học sinh"
                    disabled
                    value={editingStudent.mahs}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                  />

                  <input
                    type="text"
                    placeholder="Họ tên học sinh"
                    value={editingStudent.hoten}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        hoten: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <input
                    type="text"
                    placeholder="Lớp"
                    value={editingStudent.lop}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        lop: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <textarea
                    placeholder="Địa chỉ"
                    value={editingStudent.diachi || ""}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        diachi: e.target.value,
                      })
                    }
                    className="col-span-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                </div>

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

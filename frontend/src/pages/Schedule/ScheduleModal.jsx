import { useState, useEffect } from "react";
import { X, UserPlus, CheckCircle } from "lucide-react";

export default function ScheduleModal({
  isOpen,
  onClose,
  schedule = null,
  routes = [],
  buses = [],
  drivers = [],
  setIsStudentSelectorOpen,
}) {
  const isEdit = !!schedule;

  const [formData, setFormData] = useState({
    malt: null,
    maxe: "",
    matd: "",
    matx: "",
    thoigianbatdau: "",
    thoigianketthuc: "",
    trangthai: 1,
    students: [],
  });

  useEffect(() => {
    if (isEdit && schedule) {
      setFormData({
        malt: schedule.malt,
        maxe: schedule.maxe || "",
        matd: schedule.matd || "",
        matx: schedule.matx || "",
        thoigianbatdau: schedule.thoigianbatdau || "",
        thoigianketthuc: schedule.thoigianketthuc || "",
        trangthai: schedule.trangthai ?? 1,
        students: schedule.students || [],
      });
    } else {
      setFormData({
        malt: null,
        maxe: "",
        matd: "",
        matx: "",
        thoigianbatdau: "",
        thoigianketthuc: "",
        trangthai: 1,
        students: [],
      });
    }
  }, [isEdit, schedule]);

  // Helper: chuyển đổi ngày + giờ → ISO string
  const combineDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return "";
    return `${dateStr}T${timeStr}:00`;
  };

  // Tách giờ từ ISO
  const extractTime = (iso) => (iso ? iso.split("T")[1]?.slice(0, 5) : "");
  const extractDate = (iso) => (iso ? iso.split("T")[0] : new Date().toISOString().split("T")[0]);

  const handleSubmit = () => {
    if (!formData.maxe || !formData.matd || !formData.matx || !formData.thoigianbatdau) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    const finalData = {
      ...formData,
      tonghocsinh: formData.students.length,
    };

    console.log("Dữ liệu gửi đi:", finalData);
    alert(isEdit ? "Cập nhật thành công!" : "Tạo lịch trình thành công!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">
            {isEdit ? "Sửa lịch trình" : "Tạo lịch trình mới"}
          </h3>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Xe buýt */}
          <div>
            <label className="block text-sm font-medium mb-1">Xe buýt</label>
            <select
              value={formData.maxe}
              onChange={(e) => setFormData({ ...formData, maxe: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Chọn xe</option>
              {buses.map((bus) => (
                <option key={bus.maxe} value={bus.maxe}>
                  {bus.bienso} ({bus.soghe} chỗ)
                </option>
              ))}
            </select>
          </div>

          {/* Tuyến đường */}
          <div>
            <label className="block text-sm font-medium mb-1">Tuyến đường</label>
            <select
              value={formData.matd}
              onChange={(e) => setFormData({ ...formData, matd: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Chọn tuyến</option>
              {routes.map((r) => (
                <option key={r.matd} value={r.matd}>
                  {r.tentuyen}
                </option>
              ))}
            </select>
          </div>

          {/* Tài xế */}
          <div>
            <label className="block text-sm font-medium mb-1">Tài xế</label>
            <select
              value={formData.matx}
              onChange={(e) => setFormData({ ...formData, matx: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Chọn tài xế</option>
              {drivers.map((d) => (
                <option key={d.mand} value={d.mand}>
                  {d.hoten}
                </option>
              ))}
            </select>
          </div>

          {/* Ngày chạy */}
          <div >
            <label className="block text-sm font-medium mb-1">Ngày chạy chuyến</label>
            <input
              type="date"
              value={extractDate(formData.thoigianbatdau)}
              onChange={(e) => {
                const date = e.target.value;
                const timeStart = extractTime(formData.thoigianbatdau);
                const timeEnd = extractTime(formData.thoigianketthuc);
                setFormData({
                  ...formData,
                  thoigianbatdau: combineDateTime(date, timeStart || "07:00"),
                  thoigianketthuc: combineDateTime(date, timeEnd || "08:30"),
                });
              }}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>


          {/* Giờ khởi hành */}
          <div>
            <label className="block text-sm font-medium mb-1">Giờ khởi hành</label>
            <input
              type="time"
              value={extractTime(formData.thoigianbatdau)}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  thoigianbatdau: combineDateTime(extractDate(formData.thoigianbatdau), e.target.value),
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Giờ đến */}
          <div>
            <label className="block text-sm font-medium mb-1">Giờ đến</label>
            <input
              type="time"
              value={extractTime(formData.thoigianketthuc)}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  thoigianketthuc: combineDateTime(extractDate(formData.thoigianbatdau), e.target.value),
                })
              }
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Trạng thái (chỉ khi sửa) */}
          {isEdit && (
            <div>
              <label className="block text-sm font-medium mb-1">Trạng thái</label>
              <select
                value={formData.trangthai}
                onChange={(e) => setFormData({ ...formData, trangthai: Number(e.target.value) })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value={1}>Đã lên lịch</option>
                <option value={2}>Đang chạy</option>
                <option value={3}>Hoàn thành</option>
                <option value={0}>Hủy bỏ</option>
                <option value={-1}>Trễ giờ</option>
              </select>
            </div>
          )}
        </div>

        {/* Danh sách học sinh */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium">Học sinh ({formData.students.length})</span>
            <button
              onClick={() => setIsStudentSelectorOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              <UserPlus className="h-4 w-4" /> Thêm học sinh
            </button>
          </div>

          {formData.students.length > 0 ? (
            <div className="border rounded-lg p-3 space-y-2 max-h-64 overflow-y-auto">
              {formData.students.map((s) => (
                <div
                  key={s.id}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded"
                >
                  <span>
                    {s.name} - {s.studentCode}
                  </span>
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        students: formData.students.filter((st) => st.id !== s.id),
                      })
                    }
                  >
                    <X className="h-5 w-5 text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
              Chưa có học sinh nào
            </div>
          )}
        </div>

        {/* Nút bấm */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 py-2 rounded-lg"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <CheckCircle className="h-5 w-5" />
            {isEdit ? "Lưu thay đổi" : "Tạo lịch trình"}
          </button>
        </div>
      </div>
    </div>
  );
}
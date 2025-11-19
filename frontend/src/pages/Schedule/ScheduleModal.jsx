import { useState, useEffect } from "react";
import { X, UserPlus, CheckCircle, Users } from "lucide-react";
import { AccountAPI, BusAPI, RouteAPI, UserAPI } from "../../api/apiServices";
import ScheduleStudentSelector from "../../components/Schedule/ScheduleStudentSelector";

export default function ScheduleModal({ onClose, onSave, schedule }) {
  const isEdit = !!schedule;

  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isStudentSelectionBox, setIsStudentSelectionOpen] = useState(false);

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
    (async () => {
      try {
        const [listUsers, listRoutes, listBuses, listAccounts] = await Promise.all([
          UserAPI.getAllUsers(),
          RouteAPI.getAllRoute(),
          BusAPI.getAllBus(),
          AccountAPI.getAllAccount(),
        ]);
        const tkDriver = listAccounts.filter(acc => acc.manq === 2);
        const listIdDriver = tkDriver.map(acc => acc.matk);
        setDrivers(listUsers.filter(user => listIdDriver.includes(user.mand)));
        setRoutes(listRoutes);
        setBuses(listBuses);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu ở Modal lịch trình:", error);
      }
    })();
  }, []);

  useEffect(() => {
    if (isEdit && schedule) {
      setFormData({
        malt: schedule.malt,
        maxe: schedule.maxe || "",
        matd: schedule.matd || "",
        matx: schedule.matx || "",
        thoigianbatdau: schedule.thoigianbatdau?.slice(0, 16) || "", // "2025-04-05T07:30"
        thoigianketthuc: schedule.thoigianketthuc?.slice(0, 16) || "",
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
    setErrors({});
  }, [isEdit, schedule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleChangeStudentList = (listStudent) => {
    setFormData(prev => ({
      ...prev, students: listStudent
    }))
  }

  const validate = () => {
    const newErrors = {};

    if (!formData.maxe) newErrors.maxe = "Vui lòng chọn xe buýt";
    if (!formData.matd) newErrors.matd = "Vui lòng chọn tuyến đường";
    if (!formData.matx) newErrors.matx = "Vui lòng chọn tài xế";
    if (!formData.thoigianbatdau) newErrors.thoigianbatdau = "Vui lòng chọn giờ khởi hành";
    if (!formData.thoigianketthuc) newErrors.thoigianketthuc = "Vui lòng chọn giờ kết thúc";

    if (formData.thoigianbatdau && formData.thoigianketthuc) {
      if (new Date(formData.thoigianbatdau) >= new Date(formData.thoigianketthuc)) {
        newErrors.thoigianketthuc = "Giờ đến phải sau giờ khởi hành";
        console.log(new Date(formData.thoigianbatdau));
        console.log(new Date(formData.thoigianketthuc));
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!validate()) return;

    const finalData = {
      ...formData,
      tonghocsinh: formData.students.length,
      thoigianbatdau: formData.thoigianbatdau,
      thoigianketthuc: formData.thoigianketthuc
    };

    onSave(finalData);
    onClose();
  };

  return (
    <>
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

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              {/* Xe buýt */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Xe buýt <span className="text-red-500">*</span>
                </label>
                <select
                  name="maxe"
                  value={formData.maxe}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 ${errors.maxe ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Chọn xe</option>
                  {buses.map((bus) => (
                    <option key={bus.maxe} value={bus.maxe}>
                      {bus.bienso} ({bus.soghe} chỗ)
                    </option>
                  ))}
                </select>
                {errors.maxe && <p className="mt-1 text-sm text-red-500">{errors.maxe}</p>}
              </div>

              {/* Tuyến đường */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tuyến đường <span className="text-red-500">*</span>
                </label>
                <select
                  name="matd"
                  value={formData.matd}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 ${errors.matd ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Chọn tuyến</option>
                  {routes.map((r) => (
                    <option key={r.matd} value={r.matd}>
                      {r.tentuyen}
                    </option>
                  ))}
                </select>
                {errors.matd && <p className="mt-1 text-sm text-red-500">{errors.matd}</p>}
              </div>

              {/* Tài xế */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tài xế <span className="text-red-500">*</span>
                </label>
                <select
                  name="matx"
                  value={formData.matx}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 ${errors.matx ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Chọn tài xế</option>
                  {drivers.map((d) => (
                    <option key={d.mand} value={d.mand}>
                      {d.hoten}
                    </option>
                  ))}
                </select>
                {errors.matx && <p className="mt-1 text-sm text-red-500">{errors.matx}</p>}
              </div>

              <div>
                <input type="hide" />
              </div>

              {/* Giờ khởi hành */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Giờ khởi hành <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="thoigianbatdau"
                  value={formData.thoigianbatdau}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 ${errors.thoigianbatdau ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500`}
                />
                {errors.thoigianbatdau && <p className="mt-1 text-sm text-red-500">{errors.thoigianbatdau}</p>}
              </div>

              {/* Giờ đến */}
              <div>
                <label className="block text-sm font-medium mb-1">Giờ đến nơi</label>
                <input
                  type="datetime-local"
                  name="thoigianketthuc"
                  value={formData.thoigianketthuc}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 ${errors.thoigianketthuc ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500`}
                />
                {errors.thoigianketthuc && <p className="mt-1 text-sm text-red-500">{errors.thoigianketthuc}</p>}
              </div>

              {/* Trạng thái (chỉ khi sửa) */}
              {isEdit && (
                <div>
                  <label className="block text-sm font-medium mb-1">Trạng thái</label>
                  <select
                    name="trangthai"
                    value={formData.trangthai}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Đã lên lịch</option>
                    <option value={2}>Hoàn thành</option>
                    <option value={0}>Hủy bỏ</option>
                  </select>
                </div>
              )}
            </div>

            {/* Danh sách học sinh */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Học sinh ({formData.students.length})</span>
                <button
                  type="button"
                  onClick={() => setIsStudentSelectionOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                >
                  <UserPlus className="h-4 w-4" /> Thêm học sinh
                </button>
              </div>

              {formData.students.length > 0 ? (
                <div className="border rounded-lg p-3 space-y-2 max-h-64 overflow-y-auto">
                  {formData.students.map((s) => (
                    <div key={s.mahs} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{s.hoten}</div>
                          <div className="text-sm text-gray-500">
                            MSHS: {s.mahs} - Lớp {s.lop}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData(prev => ({
                            ...prev,
                            students: prev.students.filter(st => st.mahs !== s.mahs),
                          }))
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

            {/* Nút hành động */}
            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 hover:bg-gray-400 py-2 rounded-lg font-medium"
              >
                Hủy
              </button>
              <button
                type="submit"
                onClick={() => handleChangeStudentList}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-5 w-5" />
                {isEdit ? "Lưu thay đổi" : "Tạo lịch trình"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {isStudentSelectionBox && (
        <ScheduleStudentSelector
          selectedStudents={formData.students}
          setListSelectedStudent={handleChangeStudentList}
          onClose={() => setIsStudentSelectionOpen(false)}
        />
      )}

    </>
  );
}
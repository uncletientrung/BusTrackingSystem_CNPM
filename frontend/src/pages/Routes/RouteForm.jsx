import { useEffect, useState } from "react";
import { RouteIcon, X, MapPin } from "lucide-react";
import StopSelector from "../../components/Routes/StopSelector";
import { calculateRouteDistance } from "../../utils/distanceCalculator";
import { CTRouteAPI, StopAPI } from "../../api/apiServices";

export default function RouteForm({ route, listStop, onSave, onCancel }) {
  const isReadOnly = route?.__readOnly === true; // Kiểm tra chế độ xem
  const [stops, setStops] = useState([]);
  const [formData, setFormData] = useState({
    // Form xem/ sửa/ thêm
    tentuyen: route ? route.tentuyen : "",
    mota: route?.mota || "",
    tongquangduong: route?.tongquangduong || 0,
    trangthai: route?.trangthai || 0,
    stops: [],
    matd: route?.matd || "",
  });

  useEffect(() => {
    (async () => {
      try {
        let dsCTTD = [];
        if (route?.matd) {
          dsCTTD = await CTRouteAPI.getCTTTById(Number(route.matd));
        }
        if (isReadOnly || route?.matd) {
          setFormData((prev) => ({
            ...prev,
            stops: dsCTTD, // Chỉ gán khi có dữ liệu
          }));
        }
        setStops(listStop);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    })();
  }, [route, listStop, isReadOnly]);

  const [errors, setErrors] = useState({});

  // Chỉ validate khi KHÔNG phải chế độ xem
  const validate = () => {
    if (isReadOnly) return true;
    const newErrors = {};
    if (!formData.tentuyen.trim())
      newErrors.tentuyen = "Tên tuyến không được để trống";
    if (!formData.mota.trim()) newErrors.mota = "Mô tả không được để trống";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0)
      alert("Vui lòng nhập đầy đủ thông tin");
    return Object.keys(newErrors).length === 0;
  };

  const handleStopsChange = (stops) => {
    if (isReadOnly) return;
    const distance = calculateRouteDistance(stops);
    setFormData((prev) => ({
      ...prev,
      stops, // Lưu danh sách điểm dừng
      tongquangduong: distance,
    }));
  };

  const handleSubmit = () => {
    if (validate()) {
      const submitData = {
        tentuyen: formData.tentuyen,
        mota: formData.mota,
        tongquangduong: formData.tongquangduong,
        trangthai: formData.trangthai,
        dsCTRoute: formData.stops.map((s) => ({
          madd: s.madd,
          thutu: s.thutu,
        })),
      };

      onSave(submitData);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      {/* Header Modal - Cố định */}
      <div className="flex items-center justify-between mb-4 border-b pb-4 sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          <RouteIcon className="h-7 w-7 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            {isReadOnly ? (
              <>
                Xem chi tiết tuyến đường – Mã:
                <span className="text-blue-600">TD-{formData.matd}</span>
              </>
            ) : route ? (
              <>
                Chỉnh sửa tuyến đường – Mã:
                <span className="text-blue-600">TD-{formData.matd}</span>
              </>
            ) : (
              "Thêm tuyến đường mới"
            )}
          </h2>
        </div>

        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Nội dung cuộn được */}
      <div className="flex-1 overflow-y-auto px-1 space-y-6">
        {/* Form Grid */}
        <div
          className={`grid gap-5 ${
            isReadOnly ? "grid-cols-2" : "grid-cols-1 md:grid-cols-1"
          }`}
        >
          {/* Mã tuyến */}
          {isReadOnly && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã tuyến {isReadOnly ? "" : "*"}
              </label>

              <input
                type="text"
                value={"TD-" + formData.matd}
                onChange={(e) =>
                  !isReadOnly &&
                  setFormData((prev) => ({ ...prev, matd: e.target.value }))
                }
                disabled
                placeholder="VD: BT-SB-01"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.matd ? "border-red-300" : "border-gray-300"
                } ${
                  isReadOnly || route ? "bg-gray-50 cursor-not-allowed" : ""
                }`}
                readOnly
              />
            </div>
          )}

          {/* Tên tuyến */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên tuyến {isReadOnly ? "" : "*"}
            </label>
            <input
              type="text"
              value={formData.tentuyen}
              onChange={(e) =>
                !isReadOnly &&
                setFormData((prev) => ({ ...prev, tentuyen: e.target.value }))
              }
              disabled={isReadOnly}
              placeholder="VD: Bến Thành - Sân Bay"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors ${
                errors.tentuyen ? "border-red-300" : "border-gray-300"
              } ${isReadOnly ? "bg-gray-50 cursor-not-allowed" : ""}`}
              readOnly={isReadOnly}
            />
            {errors.tentuyen && !isReadOnly && (
              <p className="mt-1 text-xs text-red-600">{errors.tentuyen}</p>
            )}
          </div>
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả
          </label>
          <textarea
            value={formData.mota}
            onChange={(e) =>
              !isReadOnly &&
              setFormData((prev) => ({ ...prev, mota: e.target.value }))
            }
            rows={3}
            disabled={isReadOnly}
            placeholder="Mô tả chi tiết về tuyến đường..."
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 transition-colors ${
              errors.mota ? "border-red-300" : "border-gray-300"
            } ${isReadOnly ? "bg-gray-50 cursor-not-allowed" : ""}`}
            readOnly={isReadOnly}
          />
          {errors.mota && !isReadOnly && (
            <p className="mt-1 text-xs text-red-600">{errors.mota}</p>
          )}
        </div>

        {/* Khoảng cách + Trạng thái */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khoảng cách{" "}
              <span className="text-xs text-blue-600">(Tự động)</span>
            </label>
            <input
              type="text"
              value={formData.tongquangduong || "Chưa có điểm dừng"}
              readOnly
              disabled
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            {isReadOnly ? (
              <div className="px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                {formData.trangthai === 1 ? "Hoạt động" : "Ngưng hoạt động"}
              </div>
            ) : (
              <select
                value={formData.trangthai}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    trangthai: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value={1}>Hoạt động</option>
                <option value={0}>Ngưng hoạt động</option>
              </select>
            )}
          </div>
        </div>

        {/* Danh sách điểm dừng */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Điểm dừng ({formData.stops.length})
          </label>
          {isReadOnly ? (
            <div className="space-y-2 max-h-48 overflow-y-auto p-3 bg-gray-50 border border-gray-300 rounded-lg">
              {formData.stops.length > 0 ? (
                formData.stops.map((stop, idx) => (
                  <div
                    key={stop.madd}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <span className="font-medium text-primary-600">
                      {idx + 1}.
                    </span>
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>
                      {stops.find((s) => s.madd == stop.madd).tendiemdung}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">Chưa có điểm dừng</p>
              )}
            </div>
          ) : (
            <StopSelector
              selectedStops={formData.stops}
              onStopsChange={handleStopsChange}
              availableStops={listStop}
            />
          )}
        </div>
      </div>

      {/* Footer - Cố định */}
      <div className="flex gap-3 pt-4 mt-4 border-t sticky bottom-0 bg-white z-10">
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 px-4 rounded-lg font-medium transition-colors"
        >
          {isReadOnly ? "Đóng" : "Hủy"}
        </button>

        {!isReadOnly && (
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
          >
            {route ? "Cập nhật" : "Tạo tuyến"}
          </button>
        )}
      </div>
    </div>
  );
}

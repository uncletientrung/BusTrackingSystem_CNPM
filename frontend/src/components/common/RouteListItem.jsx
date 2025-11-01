import { RouteIcon, SquarePen, Trash2, MapPin, Clock } from 'lucide-react';
import React from 'react';

export default function RouteListItem({ route, onEdit, onDelete, index = 0 }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return '🟢';
      case 'maintenance': return '🟡';
      case 'inactive': return '🔴';
      default: return '⚪';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'maintenance': return 'Bảo trì';
      case 'inactive': return 'Ngưng hoạt động';
      default: return status;
    }
  };

  return (
    <div
      className="relative bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200"
      style={{
        animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`
      }}
    >
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className="flex flex-col sm:flex-row items-start sm:items-center p-5 gap-4">
        {/* Left icon */}
        <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center shadow-sm hover:scale-110 hover:rotate-6 transition-transform duration-200">
          <RouteIcon className="text-purple-600 w-8 h-8" />
        </div>

        {/* Main details */}
        <div className="flex-1 min-w-0 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h4 className="text-xl font-bold text-gray-900">{route.name}</h4>
                <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(route.status)}`}>
                  <span>{getStatusIcon(route.status)}</span>
                  <span>{getStatusText(route.status)}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-mono font-semibold text-blue-600">{route.code}</span>
                <span className="text-gray-400">•</span>
                <span className="line-clamp-1">{route.description}</span>
              </div>
            </div>
            {/* Action icons on the right (small) */}
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                title="Sửa"
                className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:scale-110 active:scale-95 p-2 rounded-lg transition-all duration-150"
              >
                <SquarePen className="w-5 h-5" />
              </button>
              <button
                onClick={onDelete}
                title="Xóa"
                className="text-gray-400 hover:text-red-600 hover:bg-red-50 hover:scale-110 active:scale-95 p-2 rounded-lg transition-all duration-150"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-3 gap-x-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-gray-500 text-xs mb-0.5">Khoảng cách</div>
                <div className="font-semibold text-gray-900">{route.distance}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-gray-500 text-xs mb-0.5">Thời gian</div>
                <div className="font-semibold text-gray-900">{route.estimatedTime}</div>
              </div>
            </div>

            <div>
              <div className="text-gray-500 text-xs mb-0.5">Điểm dừng</div>
              <div className="font-semibold text-gray-900">{route.stops.length} điểm</div>
            </div>

            <div>
              <div className="text-gray-500 text-xs mb-0.5">Số xe</div>
              <div className="font-semibold text-gray-900">{route.busCount} xe</div>
            </div>

            <div>
              <div className="text-gray-500 text-xs mb-0.5">Chuyến/ngày</div>
              <div className="font-semibold text-gray-900">{route.dailyTrips}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

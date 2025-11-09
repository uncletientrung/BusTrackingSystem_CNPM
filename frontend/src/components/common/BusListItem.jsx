import { BusFront, SquarePen, Trash2 } from 'lucide-react';
import React from 'react';

export default function BusListItem({ bus, onEdit, onDelete, index = 0 }) {

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
        <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shadow-sm hover:scale-110 hover:rotate-6 transition-transform duration-200">
          <BusFront className="text-blue-600 w-8 h-8" />
        </div>

        {/* Main details */}
        <div className="flex-1 min-w-0 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h4 className="text-xl font-bold text-gray-900">{bus.number}</h4>
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-3 gap-x-4 text-sm">
            <div>
              <div className="text-gray-500 text-xs mb-0.5">Biển số</div>
              <div className="font-semibold text-gray-900">{bus.licensePlate}</div>
            </div>

            <div>
              <div className="text-gray-500 text-xs mb-0.5">Tuyến</div>
              <div className="font-semibold text-gray-900 truncate" title={bus.route || 'Chưa phân công'}>
                {bus.route || 'Chưa phân công'}
              </div>
            </div>

            <div>
              <div className="text-gray-500 text-xs mb-0.5">Sức chứa</div>
              <div className="font-semibold text-gray-900">{bus.capacity} chỗ</div>
            </div>

            <div>
              <div className="text-gray-500 text-xs mb-0.5">Năm SX</div>
              <div className="font-semibold text-gray-900">{bus.year}</div>
            </div>

            <div>
              <div className="text-gray-500 text-xs mb-0.5">Quãng đường</div>
              <div className="font-semibold text-gray-900">{bus.mileage}</div>
            </div>

            <div>
              <div className="text-gray-500 text-xs mb-0.5">Tài xế</div>
              <div className="font-semibold text-gray-900 truncate" title={bus.driver || 'Chưa có'}>
                {bus.driver || 'Chưa có'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

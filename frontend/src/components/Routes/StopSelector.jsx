import { GripVertical, MapPin, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function StopSelector({ selectedStops, onStopsChange, availableStops }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Filter available stops that aren't already selected
  const filteredStops = availableStops.filter(stop => 
    !selectedStops.find(s => s.id === stop.id) &&
    (stop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     stop.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddStop = (stop) => {
    const newStop = {
      ...stop,
      order: selectedStops.length + 1
    };
    onStopsChange([...selectedStops, newStop]);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleRemoveStop = (stopId) => {
    const filtered = selectedStops.filter(s => s.id !== stopId);
    // Reorder remaining stops
    const reordered = filtered.map((stop, index) => ({
      ...stop,
      order: index + 1
    }));
    onStopsChange(reordered);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const items = [...selectedStops];
    const draggedItem = items[draggedIndex];
    items.splice(draggedIndex, 1);
    items.splice(index, 0, draggedItem);

    // Update order
    const reordered = items.map((item, idx) => ({
      ...item,
      order: idx + 1
    }));

    onStopsChange(reordered);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Điểm dừng trên tuyến
        </label>

        {/* Add Stop Search */}
        <div className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tìm và thêm điểm dừng..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {/* Dropdown */}
          {showDropdown && filteredStops.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredStops.map((stop) => (
                <button
                  key={stop.id}
                  type="button"
                  onClick={() => handleAddStop(stop)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-primary-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{stop.name}</div>
                      <div className="text-sm text-gray-500 truncate">{stop.code} • {stop.address}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Stops List */}
      {selectedStops.length > 0 ? (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Danh sách điểm dừng ({selectedStops.length})
          </div>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2 max-h-96 overflow-y-auto">
            {selectedStops
              .sort((a, b) => a.order - b.order)
              .map((stop, index) => (
                <div
                  key={stop.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white border border-gray-200 rounded-lg p-3 cursor-move hover:shadow-md transition-shadow ${
                    draggedIndex === index ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Drag Handle */}
                    <div className="flex-shrink-0">
                      <GripVertical className="h-5 w-5 text-gray-400" />
                    </div>

                    {/* Order Number */}
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {stop.order}
                      </div>
                    </div>

                    {/* Stop Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{stop.name}</div>
                      <div className="text-sm text-gray-500 truncate">
                        {stop.code}
                        {stop.address && ` • ${stop.address}`}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Tọa độ: {stop.lat?.toFixed(4) || stop.latitude?.toFixed(4)}, {stop.lng?.toFixed(4) || stop.longitude?.toFixed(4)}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveStop(stop.id)}
                      className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <p className="text-xs text-gray-500 italic">
            💡 Kéo thả để sắp xếp thứ tự các điểm dừng
          </p>
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">Chưa có điểm dừng nào được chọn</p>
          <p className="text-sm text-gray-400 mt-1">Tìm kiếm và thêm điểm dừng từ danh sách</p>
        </div>
      )}
    </div>
  );
}

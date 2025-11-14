import React from "react";

export default function CustomAlert({
    title = "Thông báo",
    message = "",
    type = "warning",
    onClose
}) {
    const colors = {
        success: "bg-green-100 border-green-500 text-green-700",
        error: "bg-red-100 border-red-500 text-red-700",
        warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
        info: "bg-blue-100 border-blue-500 text-blue-700"
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className={`border-l-4 p-5 rounded-md shadow-md w-96 bg-white ${colors[type]}`}>
                <div className="font-bold text-lg mb-2">{title}</div>
                <div className="mb-4">{message}</div>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
}

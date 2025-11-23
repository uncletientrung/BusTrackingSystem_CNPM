const BASE_URL = 'http://localhost:5000/api';

// Sắp xếp danh sách theo trường thời gian tạo (thoigiantao) giảm dần
// Chỉ áp dụng nếu là mảng và phần tử có thuộc tính thoigiantao.
const sortByCreationTimeDesc = (data) => {
  if (!Array.isArray(data)) return data;
  return data.slice().sort((a, b) => {
    const timeA = a && a.thoigiantao ? new Date(a.thoigiantao).getTime() : 0;
    const timeB = b && b.thoigiantao ? new Date(b.thoigiantao).getTime() : 0;
    return timeB - timeA; // mới nhất trước
  });
};

const fetchAll = async (endpoint) => {
  const res = await fetch(`${BASE_URL}/${endpoint}`);
  if (!res.ok) throw new Error(`Lỗi lấy dữ liệu từ API của ${endpoint}`);
  const data = await res.json();
  return sortByCreationTimeDesc(data);
};

const fetchById = async (endpoint, id) => {
  const res = await fetch(`${BASE_URL}/${endpoint}/${id}`);
  if (!res.ok) throw new Error(`Lỗi lấy dữ liệu từ API của ${endpoint} by id`);
  const data = await res.json();
  // Trường hợp trả về mảng (một số API có thể trả list liên quan) vẫn sắp xếp.
  return sortByCreationTimeDesc(data);
};

const create = async (endpoint, data) => {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Lỗi tạo mới tại ${endpoint}`);
  }

  return await res.json();
};

const deleteForm = async (endpoint, id) => {
  const res = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Lỗi xóa tại ${endpoint}/${id}`);
  }
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  }
  return { message: 'Xóa thành công' };
};

const update = async (endpoint, id, dataForm) => {
  const res = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataForm),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Lỗi cập nhật tại ${endpoint}/${id}`);
  }

  return await res.json();
};

const createBulk = async (endpoint, data) => {
  const res = await fetch(`${BASE_URL}/${endpoint}/bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Lỗi gửi hàng loạt tại ${endpoint}/bulk`);
  }

  return await res.json();
};
const apiClient = { fetchAll, fetchById, create, deleteForm, update, createBulk };
export default apiClient;
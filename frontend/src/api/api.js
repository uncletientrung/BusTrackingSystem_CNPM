const BASE_URL = 'http://localhost:5000/api';

const fetchAll = async (endpoint) => {
  const res = await fetch(`${BASE_URL}/${endpoint}`);
  if (!res.ok) throw new Error(`Lỗi lấy dữ liệu từ API của ${endpoint}`);
  return await res.json();
};

const fetchById = async (endpoint, id) => {
  const res = await fetch(`${BASE_URL}/${endpoint}/${id}`);
  if (!res.ok) throw new Error(`Lỗi lấy dữ liệu từ API của ${endpoint} by id`);
  return await res.json();
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
const apiClient = { fetchAll, fetchById, create, deleteForm, update };
export default apiClient;
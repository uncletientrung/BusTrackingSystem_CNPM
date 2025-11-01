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

const apiClient = { fetchAll, fetchById };
export default apiClient;
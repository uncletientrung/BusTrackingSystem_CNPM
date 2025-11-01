const API_URL = 'http://localhost:5000/api/Stop';

export const getAll = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch diemdung');
  return await res.json();
};

export const getStopById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch diemdung by id');
  return await res.json();
};

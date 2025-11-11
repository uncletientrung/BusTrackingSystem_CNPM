const toLocalString = (dateString) => {
    const date = new Date(dateString);
    const ngaychuan = date.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    return ngaychuan;
};

export default toLocalString;

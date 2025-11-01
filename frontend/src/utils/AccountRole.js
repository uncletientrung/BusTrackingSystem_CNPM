export const getRoleFromMaNq = (manq) => {
    const roleMap = {
        1: 'admin',
        2: 'driver',
        3: 'parent'
    };
    return roleMap[manq] || null;
};
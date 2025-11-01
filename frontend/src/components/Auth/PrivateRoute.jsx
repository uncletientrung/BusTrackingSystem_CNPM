import { Navigate } from 'react-router-dom';
import { getRoleFromMaNq } from '../../utils/AccountRole';

export default function PrivateRoute({ children, allowedRoles }) {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!isLoggedIn || !currentUser) return <Navigate to="/login" />; // Chưa login thì out

    if (allowedRoles && !allowedRoles.includes(getRoleFromMaNq(currentUser.manq))) return <Navigate to="/unauthorized" />;

    return children; // return cái chứa
}

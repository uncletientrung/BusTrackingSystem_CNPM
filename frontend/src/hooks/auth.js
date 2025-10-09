import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
// create → dùng để tạo store.
// persist → middleware để lưu state vào storage (localStorage, sessionStorage, IndexedDB, …).
// createJSONStorage → giúp lưu state ở dạng JSON.

const auth = create( // hỗ trợ login, logout, refresh token, update user, và kiểm tra quyền (role).
    persist(
        (set, get) =>({
            user: null, // State mặc định
            accessToken: null, // Token để call API
            refreshToken: null, // Token để call API
            isAuthenticated: false, // true/false người dùng có đăng nhập chưa.
            loading: false, // trạng thái loading khi xử lý auth.

            setAuth: (data) => { // Khi login thành công, gọi setAuth để lưu user và token.
                set({
                    user: data.user,
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    isAuthenticated: true,
                })
            },

            updateUser: (userData) => { // Cập nhật thông tin user (merge với user cũ).
                set((state) => ({
                    user: {...state.user, ...userData}
                }))
            },

            updateTokens: (tokens) => { // Dùng khi refresh token để update lại access/refresh token.
                set({
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                })
            },

            logout: () => { // Xóa toàn bộ thông tin đăng nhập
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                })
            },

            setLoading: (loading) => { // thay đổi state loading.
                set({ loading })
            },

            // Get
            hasRole: (role) => { // hasRole(role) → true nếu user.role === role.
                const { user } = get() // tương đương const user = get().user
                return user?.role === role // dấu ? là nếu user tồn tại thì đọc user.role; còn nếu user là null
                                // hoặc undefined thì không gây lỗi và user?.role trả về undefined
            },

            hasAnyRole: (roles) => { // hasAnyRole(roles) → true nếu role của user nằm trong danh sách roles.
                const { user } = get()
                return user && roles.includes(user.role) // Kiểm tra user có tồn tại hay không và có trong
                                // danh sách roles truyền vào
            },
        }),

        {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
            user: state.user,
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
            isAuthenticated: state.isAuthenticated,
        }),
        }
    )   
)
export { auth }
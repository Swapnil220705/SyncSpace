import { useAuthStore } from '@/stores/authStore';
import type { UserRole } from '@/types/api';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const error = useAuthStore((s) => s.error);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const logout = useAuthStore((s) => s.logout);
  const logoutAll = useAuthStore((s) => s.logoutAll);
  const forgotPassword = useAuthStore((s) => s.forgotPassword);
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const changePassword = useAuthStore((s) => s.changePassword);
  const uploadAvatar = useAuthStore((s) => s.uploadAvatar);
  const clearError = useAuthStore((s) => s.clearError);

  const isAuthenticated = Boolean(accessToken && user);

  const hasRole = (...roles: UserRole[]) => (user ? roles.includes(user.role) : false);

  return {
    user,
    accessToken,
    isLoading,
    isInitialized,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    logoutAll,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword,
    uploadAvatar,
    clearError,
    hasRole,
  };
}

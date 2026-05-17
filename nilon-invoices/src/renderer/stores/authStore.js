import { create } from 'zustand';
export const useAuthStore = create((set) => {
    // Load initial state from LocalStorage if active
    const storedApiUrl = localStorage.getItem('nilon_api_url') || 'https://api.nilonxaydung.vn/v1';
    const storedApiKey = localStorage.getItem('nilon_api_key') || '';
    const storedClientId = localStorage.getItem('nilon_client_id') || 'BRANCH-HCM-01';
    const storedRemember = localStorage.getItem('nilon_remember') === 'true';
    const storedAuth = localStorage.getItem('nilon_is_auth') === 'true';
    return {
        isAuthenticated: storedAuth,
        apiUrl: storedApiUrl,
        apiKey: storedApiKey,
        clientId: storedClientId,
        rememberMe: storedRemember,
        isLoading: false,
        error: null,
        login: async (apiUrl, apiKey, clientId, rememberMe) => {
            set({ isLoading: true, error: null });
            // Simulate real-time API check
            await new Promise((resolve) => setTimeout(resolve, 1500));
            if (!apiUrl.trim() || !apiKey.trim() || !clientId.trim()) {
                set({ isLoading: false, error: 'Please enter all active connection configuration fields.' });
                return false;
            }
            if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
                set({ isLoading: false, error: 'Invalid API base URL. Must start with http:// or https://' });
                return false;
            }
            set({
                isAuthenticated: true,
                apiUrl,
                apiKey,
                clientId,
                rememberMe,
                isLoading: false,
                error: null
            });
            if (rememberMe) {
                localStorage.setItem('nilon_api_url', apiUrl);
                localStorage.setItem('nilon_api_key', apiKey);
                localStorage.setItem('nilon_client_id', clientId);
                localStorage.setItem('nilon_remember', 'true');
                localStorage.setItem('nilon_is_auth', 'true');
            }
            else {
                localStorage.setItem('nilon_is_auth', 'true');
            }
            return true;
        },
        logout: () => {
            set({ isAuthenticated: false });
            localStorage.removeItem('nilon_is_auth');
        },
        clearError: () => set({ error: null })
    };
});

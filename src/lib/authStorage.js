const TOKEN_KEY = 'app_token';
const USER_KEY = 'app_user';
const LEGACY_TOKEN_KEY = 'workoutme_token';
const LEGACY_USER_KEY = 'workoutme_user';
function getStoredValue(key, legacyKey) {
    const value = localStorage.getItem(key);
    if (value !== null)
        return value;
    const legacyValue = localStorage.getItem(legacyKey);
    if (legacyValue !== null) {
        localStorage.setItem(key, legacyValue);
        localStorage.removeItem(legacyKey);
    }
    return legacyValue;
}
export function getToken() {
    return getStoredValue(TOKEN_KEY, LEGACY_TOKEN_KEY);
}
export function getStoredUser() {
    const raw = getStoredValue(USER_KEY, LEGACY_USER_KEY);
    return raw ? JSON.parse(raw) : null;
}
export function setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(LEGACY_USER_KEY);
}
export function setStoredUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.removeItem(LEGACY_USER_KEY);
}
export function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(LEGACY_USER_KEY);
}

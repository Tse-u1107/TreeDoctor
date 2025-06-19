const SESSION_KEY = 'treeDoctor_session';
const SESSION_DURATION = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds

export const setSession = (userData) => {
    const session = {
        user: userData,
        expiry: Date.now() + SESSION_DURATION
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getSession = () => {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;

    const session = JSON.parse(sessionStr);
    if (Date.now() > session.expiry) {
        localStorage.removeItem(SESSION_KEY);
        return null;
    }

    return session.user;
};

export const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
};
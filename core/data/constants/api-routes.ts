const API_KEYS = {
    AUTH: '/auth',
    LOCATIONS: '/locations',
};

export const API_ROUTES = {
    AUTH: {
        LOGIN: `${API_KEYS.AUTH}/login`,
        //LOGOUT: `${API_KEYS.AUTH}/logout`,
        //REGISTER: `${API_KEYS.AUTH}/register`,
    },
    LOCATIONS: {
        BASE: API_KEYS.LOCATIONS,
        BY_ID: (id: number) => `${API_KEYS.LOCATIONS}/${id}`,
    },
};

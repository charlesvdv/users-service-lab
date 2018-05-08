// This service should be included in every service.
// It makes sure that the token is up-to-date before
// loading the page.

const USER_SERVICE_URL = 'http://localhost:8000'
const STORAGE_JWT_TOKEN_KEY = 'jwt-token'

// Check wheter a jwt is still valid or not.
function isJwtValid(jwt) {
    let payload = JSON.parse(atob(jwt.split('.')[1]));
    if (payload.exp === null) {
        return false;
    }
    if (payload.exp < (Date.now() - 5)) {
        return false;
    }
    return true;
}

function refreshToken() {
    const currentLocation = window.location.href;
    window.location = '/login.html?url=' + encodeURIComponent(currentLocation);
}

// Function called at the start of a page.
function getUserToken() {
    needRefreshing = false;

    const jwt = window.localStorage.getItem(STORAGE_JWT_TOKEN_KEY);
    if (jwt === null) {
        needRefreshing = true;
    }
    needRefreshing = needRefreshing || isJwtValid(jwt);

    if (needRefreshing) {
        refreshToken();
    }
    return window.localStorage.getItem(STORAGE_JWT_TOKEN_KEY);
}

// Returns null or the token.
async function userServiceGetToken(username, password) {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    const body = {
        username: username,
        password: password,
    };

    const response = await fetch(USER_SERVICE_URL + '/api/v1/token', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        return null;
    }

    const responseBody = await response.json();

    const token = responseBody.token;
    window.localStorage.setItem(STORAGE_JWT_TOKEN_KEY, token);

    return token;
}

import axios from 'axios';

let accessToken = "";
let expiresIn = 0; // token expiry time in seconds
let lastTokenRefreshTime = 0;

async function refreshToken() {
  try {
    const response = await axios.post(
      'https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token',
      new URLSearchParams({
        client_id: process.env.FLW_CLIENT_ID || "",
        client_secret: process.env.FLW_CLIENT_SECRET || "",
        grant_type: 'client_credentials'
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    accessToken = response.data.access_token;
    expiresIn = response.data.expires_in;
    lastTokenRefreshTime = Date.now();

    console.log('New Token:', accessToken);
    console.log('Expires in:', expiresIn, 'seconds');
  } catch (error: any) {
    console.error('Error refreshing token:', error.response ? error.response.data : error.message);
  }
}

async function ensureTokenIsValid() {
  const currentTime = Date.now();
  const timeSinceLastRefresh = (currentTime - lastTokenRefreshTime) / 1000; // convert to seconds
  const timeLeft = expiresIn - timeSinceLastRefresh;

  if (!accessToken || timeLeft < 60) { // refresh if less than 1 minute remains
    console.log('Refreshing token...');
    await refreshToken();
  } else {
    console.log(`Token is still valid for ${Math.floor(timeLeft)} seconds.`);
  }
}

// Example usage: Call `ensureTokenIsValid` before making API requests
setInterval(ensureTokenIsValid, 5000); // check every 5 seconds

export async function getFlutterwaveToken() {
  await ensureTokenIsValid();
  return accessToken;
}


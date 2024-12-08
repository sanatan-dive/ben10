import { NextApiRequest, NextApiResponse } from 'next';

const KINDE_CLIENT_ID = process.env.KINDE_CLIENT_ID as string;  // Your Kinde client ID
const KINDE_CLIENT_SECRET = process.env.KINDE_CLIENT_SECRET as string;  // Your Kinde client secret
const KINDE_REDIRECT_URI = process.env.KINDE_REDIRECT_URI as string;  // Your redirect URI

// Type definition for the expected token response
interface KindeTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

// Function to fetch the token from Kinde
async function getKindeAccessToken(code: string): Promise<KindeTokenResponse> {
  const response = await fetch('https://api.kinde.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: KINDE_REDIRECT_URI,
      client_id: KINDE_CLIENT_ID,
      client_secret: KINDE_CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for access token');
  }

  const data = await response.json();
  return data;
}

// API handler for Kinde callback
export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { code, error } = req.query;

  if (error) {
    return res.status(400).json({ message: `Error during authentication: ${error}` });
  }

  if (!code || Array.isArray(code)) {
    return res.status(400).json({ message: 'Missing or invalid authorization code' });
  }

  try {
    // Get the access token using the authorization code
    const tokenData = await getKindeAccessToken(code);

    // Here you can store the token in a session or a cookie
    // Example: Store it in a cookie
    res.setHeader('Set-Cookie', `access_token=${tokenData.access_token}; Path=/; HttpOnly`);

    // Redirect to the user's profile or a success page
    res.redirect('/');
  } catch (error) {
    res.status(500).json({ message: `Error: ${(error as Error).message}` });
  }
}

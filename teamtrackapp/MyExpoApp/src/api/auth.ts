// src/api/auth.ts

export const loginApi = async (email: string, password: string): Promise<string> => {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({email, password })
  });

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  const data = await response.json();
  return data.token; // Adjust key if your backend returns { "token": "..." }
};

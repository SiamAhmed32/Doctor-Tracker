export const BASE = process.env.API_BASE_URL;
export const adminEmail = process.env.TEST_ADMIN_EMAIL;
export const adminPassword = process.env.TEST_ADMIN_PASSWORD;

function required(name, value) {
  if (!value) {
    throw new Error(`${name} is required for API integration tests.`);
  }
  return value;
}

required("API_BASE_URL", BASE);
required("TEST_ADMIN_EMAIL", adminEmail);
required("TEST_ADMIN_PASSWORD", adminPassword);

export function cookieHeader(response) {
  const cookies =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : [];
  return cookies.map((value) => value.split(";")[0]).join("; ");
}

export async function readJson(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

export async function api(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const body = await readJson(response);
  return { response, body, status: response.status };
}

export async function loginAsAdmin() {
  const { response, body, status } = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: adminEmail,
      password: adminPassword,
    }),
  });
  const cookie = cookieHeader(response);
  return { status, body, cookie };
}

export function uniqueEmail(prefix = "doc") {
  return `${prefix}.${Date.now()}.${Math.floor(Math.random() * 1000)}@test.local`;
}

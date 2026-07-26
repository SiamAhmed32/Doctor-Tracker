const base = "http://localhost:5000/api";

async function read(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function main() {
  const health = await fetch(`${base}/health`);
  console.log("health", health.status, await read(health));

  const blocked = await fetch(`${base}/doctors`);
  console.log("secure no cookie", blocked.status, await read(blocked));

  const loginRes = await fetch(`${base}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@doctortracker.com",
      password: "Admin@123",
    }),
  });
  const loginBody = await read(loginRes);
  const cookie = loginRes.headers.getSetCookie?.() ?? [];
  const cookieHeader = cookie.map((c) => c.split(";")[0]).join("; ");
  console.log("login", loginRes.status, loginBody);
  console.log("cookie set", Boolean(cookieHeader));

  const me = await fetch(`${base}/auth/me`, {
    headers: { Cookie: cookieHeader },
  });
  console.log("me", me.status, await read(me));

  const secure = await fetch(`${base}/doctors?page=1&limit=1`, {
    headers: { Cookie: cookieHeader },
  });
  console.log("protected route with cookie", secure.status);

  const logout = await fetch(`${base}/auth/logout`, {
    method: "POST",
    headers: { Cookie: cookieHeader },
  });
  console.log("logout", logout.status, await read(logout));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

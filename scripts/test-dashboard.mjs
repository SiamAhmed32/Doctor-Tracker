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
  const blocked = await fetch(`${base}/dashboard`);
  console.log("unauth", blocked.status, await read(blocked));

  const loginRes = await fetch(`${base}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@doctortracker.com",
      password: "Admin@123",
    }),
  });
  const cookie = (loginRes.headers.getSetCookie?.() ?? [])
    .map((c) => c.split(";")[0])
    .join("; ");
  const headers = { Cookie: cookie };

  const overviewRes = await fetch(`${base}/dashboard?doctorLimit=5`, {
    headers,
  });
  const overview = await read(overviewRes);
  console.log("overview status", overviewRes.status);
  console.log("totals", overview.totals);
  console.log("range", overview.range);
  console.log("patientsPerDoctor sample", overview.patientsPerDoctor?.slice(0, 2));
  console.log("specialization sample", overview.doctorsBySpecialization?.slice(0, 2));
  console.log("trend days", overview.trends?.patients?.length);
  console.log(
    "zero-filled days",
    overview.trends?.patients?.filter((p) => p.count === 0).length,
  );

  const badRange = await fetch(
    `${base}/dashboard?from=2026-07-20&to=2026-07-10`,
    { headers },
  );
  console.log("bad range", badRange.status, await read(badRange));

  const custom = await fetch(
    `${base}/dashboard?from=2026-07-01&to=2026-07-27&doctorLimit=3`,
    { headers },
  );
  const customBody = await read(custom);
  console.log("custom range status", custom.status);
  console.log("custom trend days", customBody.trends?.doctors?.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

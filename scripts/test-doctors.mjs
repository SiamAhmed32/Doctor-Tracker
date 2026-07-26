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
  const headers = {
    "Content-Type": "application/json",
    Cookie: cookie,
  };

  const suffix = Date.now();
  const createRes = await fetch(`${base}/doctors`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "Dr. Nina Rahman",
      specialization: "Cardiology",
      hospital: "City Care Hospital",
      phone: "01700000001",
      email: `nina.${suffix}@hospital.com`,
    }),
  });
  const created = await read(createRes);
  console.log("create", createRes.status, created.doctor?.id);

  const doctorId = created.doctor.id;

  const listRes = await fetch(
    `${base}/doctors?search=Nina&specialization=Cardiology&page=1&limit=5`,
    { headers },
  );
  console.log("list", listRes.status, await read(listRes));

  const patientRes = await fetch(`${base}/doctors/${doctorId}/patients`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "Karim Hasan",
      age: 42,
      phone: "01800000001",
      condition: "Hypertension",
    }),
  });
  const patientBody = await read(patientRes);
  console.log("add patient", patientRes.status, patientBody.patient?.id);

  const patientsRes = await fetch(
    `${base}/doctors/${doctorId}/patients?page=1&limit=10`,
    { headers },
  );
  console.log("list patients", patientsRes.status, await read(patientsRes));

  const delRes = await fetch(
    `${base}/doctors/${doctorId}/patients/${patientBody.patient.id}`,
    { method: "DELETE", headers },
  );
  console.log("delete patient", delRes.status, await read(delRes));

  const blocked = await fetch(`${base}/doctors`);
  console.log("unauth list", blocked.status, await read(blocked));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

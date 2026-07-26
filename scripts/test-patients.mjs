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
  const headers = { "Content-Type": "application/json", Cookie: cookie };

  const suffix = Date.now();

  const doctorA = await read(
    await fetch(`${base}/doctors`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: "Dr. Alia Ferdous",
        specialization: "Neurology",
        hospital: "Sunrise Hospital",
        phone: "01700000010",
        email: `alia.${suffix}@hospital.com`,
      }),
    }),
  );
  const doctorB = await read(
    await fetch(`${base}/doctors`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: "Dr. Rafiq Islam",
        specialization: "Cardiology",
        hospital: "City Care Hospital",
        phone: "01700000011",
        email: `rafiq.${suffix}@hospital.com`,
      }),
    }),
  );
  const doctorAId = doctorA.doctor.id;
  const doctorBId = doctorB.doctor.id;
  console.log("doctors created", doctorAId, doctorBId);

  const patient1 = await read(
    await fetch(`${base}/doctors/${doctorAId}/patients`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: "Sabbir Rahman",
        age: 35,
        phone: "01800000010",
        condition: "Migraine",
      }),
    }),
  );
  const patient2 = await read(
    await fetch(`${base}/doctors/${doctorAId}/patients`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: "Lubna Akter",
        age: 50,
        phone: "01800000011",
        condition: "Diabetes",
      }),
    }),
  );
  const patientAId = patient1.patient.id;
  const patientBId = patient2.patient.id;
  console.log("patients created", patientAId, patientBId);

  const listAll = await fetch(`${base}/patients?page=1&limit=10`, {
    headers,
  });
  const listAllBody = await read(listAll);
  console.log("list all", listAll.status, listAllBody.pagination);
  console.log("first item has doctor object?", Boolean(listAllBody.data?.[0]?.doctor?.name));

  const filterCondition = await fetch(
    `${base}/patients?condition=Migraine`,
    { headers },
  );
  console.log(
    "filter by condition",
    filterCondition.status,
    (await read(filterCondition)).pagination,
  );

  const filterDoctor = await fetch(`${base}/patients?doctorId=${doctorAId}`, {
    headers,
  });
  console.log(
    "filter by doctorId",
    filterDoctor.status,
    (await read(filterDoctor)).pagination,
  );

  const search = await fetch(`${base}/patients?search=Lubna`, { headers });
  const searchBody = await read(search);
  console.log("search", search.status, searchBody.pagination, searchBody.data?.[0]?.name);

  const emptyUpdate = await fetch(`${base}/patients/${patientAId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({}),
  });
  console.log("empty update (expect 400)", emptyUpdate.status, await read(emptyUpdate));

  const badDoctorUpdate = await fetch(`${base}/patients/${patientAId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ doctorId: "000000000000000000000000" }),
  });
  console.log(
    "update with nonexistent doctor (expect 404)",
    badDoctorUpdate.status,
    await read(badDoctorUpdate),
  );

  const validUpdate = await fetch(`${base}/patients/${patientAId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ condition: "Chronic Migraine", doctorId: doctorBId }),
  });
  const validUpdateBody = await read(validUpdate);
  console.log(
    "valid update + reassign doctor",
    validUpdate.status,
    validUpdateBody.patient?.condition,
    validUpdateBody.patient?.doctor?.id === doctorBId,
  );

  const invalidIdUpdate = await fetch(`${base}/patients/not-a-valid-id`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ condition: "X" }),
  });
  console.log(
    "update invalid id format (expect 400)",
    invalidIdUpdate.status,
    await read(invalidIdUpdate),
  );

  const deleteMissing = await fetch(
    `${base}/patients/000000000000000000000000`,
    { method: "DELETE", headers },
  );
  console.log(
    "delete nonexistent (expect 404)",
    deleteMissing.status,
    await read(deleteMissing),
  );

  const deleteReal = await fetch(`${base}/patients/${patientBId}`, {
    method: "DELETE",
    headers,
  });
  console.log("delete real", deleteReal.status, await read(deleteReal));

  const unauth = await fetch(`${base}/patients`);
  console.log("unauth list (expect 401)", unauth.status, await read(unauth));

  const badRangeList = await fetch(
    `${base}/patients?from=2026-08-01&to=2026-01-01`,
    { headers },
  );
  console.log(
    "bad date range (expect 400)",
    badRangeList.status,
    await read(badRangeList),
  );

  const emptyFilters = await fetch(
    `${base}/patients?search=&condition=&doctorId=`,
    { headers },
  );
  console.log(
    "empty string filters treated as unset",
    emptyFilters.status,
    (await read(emptyFilters)).pagination,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

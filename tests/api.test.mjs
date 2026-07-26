import assert from "node:assert/strict";
import { before, describe, test } from "node:test";
import {
  BASE,
  api,
  loginAsAdmin,
  uniqueEmail,
} from "./api-helpers.mjs";

let cookie = "";
let doctorId = "";
let patientId = "";
let createdDoctor;

before(async () => {
  try {
    const health = await api("/health");
    if (health.status !== 200) {
      throw new Error(`Health check returned ${health.status}`);
    }
  } catch (error) {
    throw new Error(
      `API not reachable at ${BASE}. Start the app with: npm run dev\n${error}`,
    );
  }
});

describe("auth", () => {
  test("rejects invalid login", async () => {
    const { status } = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "nobody@example.com",
        password: "wrong-password",
      }),
    });
    assert.equal(status, 401);
  });

  test("logs in successfully", async () => {
    const result = await loginAsAdmin();
    assert.equal(result.status, 200);
    assert.ok(result.cookie.includes("access_token="));
    assert.equal(result.body?.user?.role, "admin");
    cookie = result.cookie;
  });

  test("rejects unauthenticated API access", async () => {
    const { status } = await api("/doctors");
    assert.equal(status, 401);
  });

  test("returns current user for /auth/me", async () => {
    const { status, body } = await api("/auth/me", {
      headers: { Cookie: cookie },
    });
    assert.equal(status, 200);
    assert.ok(body?.user?.email);
  });
});

describe("doctors", () => {
  test("creates a doctor", async () => {
    const email = uniqueEmail("create");
    const { status, body } = await api("/doctors", {
      method: "POST",
      headers: { Cookie: cookie },
      body: JSON.stringify({
        name: "Dr. Test Create",
        specialization: "Cardiology",
        hospital: "Test Hospital",
        phone: "01700000001",
        email,
      }),
    });
    assert.equal(status, 201);
    assert.ok(body?.doctor?.id);
    doctorId = body.doctor.id;
    createdDoctor = body.doctor;
  });

  test("rejects duplicate doctor email", async () => {
    const email = uniqueEmail("dup");
    const first = await api("/doctors", {
      method: "POST",
      headers: { Cookie: cookie },
      body: JSON.stringify({
        name: "Dr. Dup One",
        specialization: "Dermatology",
        hospital: "Dup Hospital",
        phone: "01700000002",
        email,
      }),
    });
    assert.equal(first.status, 201);

    const second = await api("/doctors", {
      method: "POST",
      headers: { Cookie: cookie },
      body: JSON.stringify({
        name: "Dr. Dup Two",
        specialization: "Dermatology",
        hospital: "Dup Hospital",
        phone: "01700000003",
        email,
      }),
    });
    assert.equal(second.status, 409);
  });

  test("supports search, filters, and pagination", async () => {
    const { status, body } = await api(
      "/doctors?page=1&limit=5&search=Test&specialization=Cardiology&from=2020-01-01&to=2099-12-31",
      { headers: { Cookie: cookie } },
    );
    assert.equal(status, 200);
    assert.ok(Array.isArray(body?.data));
    assert.equal(typeof body?.pagination?.total, "number");
    assert.equal(body.pagination.page, 1);
    assert.ok(body.data.length <= 5);
    assert.ok(body.data.some((doctor) => doctor.id === doctorId));
    assert.ok(
      body.data.every(
        (doctor) =>
          doctor.specialization === "Cardiology" &&
          doctor.name.includes("Test") &&
          doctor.createdAt >= "2020-01-01" &&
          doctor.createdAt <= "2099-12-31T23:59:59.999Z",
      ),
    );
    assert.equal(createdDoctor.specialization, "Cardiology");
  });

  test("rejects invalid doctor payload", async () => {
    const { status } = await api("/doctors", {
      method: "POST",
      headers: { Cookie: cookie },
      body: JSON.stringify({
        name: "X",
        specialization: "",
        hospital: "",
        phone: "1",
        email: "not-an-email",
      }),
    });
    assert.equal(status, 400);
  });
});

describe("patients", () => {
  test("creates a patient under a doctor", async () => {
    assert.ok(doctorId, "doctorId from create test required");
    const { status, body } = await api(`/doctors/${doctorId}/patients`, {
      method: "POST",
      headers: { Cookie: cookie },
      body: JSON.stringify({
        name: "Test Patient",
        age: 40,
        phone: "01800000001",
        email: uniqueEmail("patient"),
        condition: "Hypertension",
      }),
    });
    assert.equal(status, 201);
    assert.ok(body?.patient?.id);
    patientId = body.patient.id;
  });

  test("lists patients with filters", async () => {
    const { status, body } = await api(
      `/patients?page=1&limit=5&condition=Hypertension&doctorId=${doctorId}`,
      { headers: { Cookie: cookie } },
    );
    assert.equal(status, 200);
    assert.ok(Array.isArray(body?.data));
    assert.ok(body.data.some((patient) => patient.id === patientId));
  });

  test("updates a patient", async () => {
    const { status, body } = await api(`/patients/${patientId}`, {
      method: "PATCH",
      headers: { Cookie: cookie },
      body: JSON.stringify({ condition: "Controlled Hypertension" }),
    });
    assert.equal(status, 200);
    assert.equal(body?.patient?.condition, "Controlled Hypertension");
  });

  test("deletes a patient", async () => {
    const { status } = await api(`/patients/${patientId}`, {
      method: "DELETE",
      headers: { Cookie: cookie },
    });
    assert.equal(status, 200);

    const listed = await api(`/patients?search=Test%20Patient`, {
      headers: { Cookie: cookie },
    });
    assert.equal(listed.status, 200);
    assert.ok(!listed.body.data.some((patient) => patient.id === patientId));
  });
});

describe("dashboard", () => {
  test("returns analytics structure", async () => {
    const { status, body } = await api("/dashboard", {
      headers: { Cookie: cookie },
    });
    assert.equal(status, 200);
    assert.equal(typeof body?.totals?.doctors, "number");
    assert.equal(typeof body?.totals?.patients, "number");
    assert.ok(Array.isArray(body?.patientsPerDoctor));
    assert.ok(Array.isArray(body?.patientsByCondition));
    assert.ok(body?.trends?.patients);
    assert.ok(body?.range);
  });
});

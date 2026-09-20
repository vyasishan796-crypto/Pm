import { defineRailway, project, service } from "railway/iac";

export default defineRailway(() => {
  const web = service("web", {
    builder: "NIXPACKS",
    start: "python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    healthcheck: "/health",
    env: {
      DATABASE_URL: "sqlite:///./nexora.db",
      SECRET_KEY: "",
    },
  });

  return project("giving-nourishment", {
    resources: [web],
  });
});

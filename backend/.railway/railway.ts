import { defineRailway, project, service } from "railway/iac";

export default defineRailway(() => {
  const web = service("web", {
    builder: "DOCKERFILE",
    healthcheck: "/health",
    env: {
      DATABASE_URL: "sqlite:///./nexora.db",
      SECRET_KEY: "",
    },
  });

  return project("nexora-backend", {
    resources: [web],
  });
});

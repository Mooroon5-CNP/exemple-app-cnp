# exemple-app-CNP

Example Node.js/Express application for the CNP internal platform.
Use this as a reference when onboarding a new application to the GitOps pipeline.

---

## Getting started

```bash
git clone https://github.com/Mooroon5-CNP/exemple-app-cnp.git
cd exemple-app-cnp
npm install
npm test
```

---

## CI/CD pipeline

This app uses the shared reusable pipeline from
[ci-templates](https://github.com/Mooroon5-CNP/ci-templates).
The workflow is defined in `.github/workflows/ci.yml`.

Every push to `main` runs lint → test → security scan → Docker build → image scan → GitOps update.
Every push to `prod` additionally requires a manual approval before the production tag is updated.

### Configure the required secret

Before the pipeline can push image tags to the config repo, add one secret to this repository:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret | Value |
|---|---|
| `CONFIG_REPO_TOKEN` | Fine-grained GitHub PAT with **Contents: Read and write** on the config repo |

See the [ci-templates README](https://github.com/Mooroon5-CNP/ci-templates) for the full setup procedure.

---

## Local development

```bash
npm install          # install dependencies
npm run lint         # ESLint check
npm test             # Jest test suite
node src/index.js    # start the server (default port 8080)
```

Healthcheck endpoints used by Kubernetes:

| Endpoint | Purpose |
|---|---|
| `GET /healthz` | Liveness probe |
| `GET /ready`   | Readiness probe |

---

## Docker

```bash
docker build -t exemple-app-cnp:local .
docker run -p 8080:8080 exemple-app-cnp:local
```

The production image is published to `ghcr.io/mooroon5-cnp/exemple-app-cnp` and tagged with the commit SHA by the CI pipeline.

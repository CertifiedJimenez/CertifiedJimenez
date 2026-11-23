# [![Cristofer Jimenez](docs/profile-header.png)](https://cristoferjimenez.com/)

**Senior Software Engineer · Independent Contractor · London, UK**

I specialise in Python backends, distributed systems and applied AI. At GSK, I build services that help scientists run and inspect AI workflows for drug discovery. At InsightAI, I led the engineering team that took a prototype into production as a multi-tenant platform built with Django and Next.js.

[Portfolio](https://cristoferjimenez.com/) · [LinkedIn](https://www.linkedin.com/in/cristofer-jimenez) · [Get in touch](mailto:contact@cristoferjimenez.com)

## Technology stack

| Area                     | Technologies                                                                                              |
| ------------------------ | --------------------------------------------------------------------------------------------------------- |
| Languages                | Python, TypeScript, JavaScript, SQL, Bash, HTML, CSS                                                      |
| Backend & data           | Django, Django REST Framework, Flask, PostgreSQL, Redis                                                   |
| Web interfaces           | React, Next.js, Vite, GSAP, Lenis                                                                         |
| Messaging & integrations | Celery, Amazon SQS, Azure Service Bus, Stripe Billing, webhooks, REST APIs, JWT                           |
| Applied AI               | LLM integration, agent orchestration, execution tracing, sandbox testing, responses with source citations |
| Cloud & infrastructure   | AWS (ECS, RDS, S3), Azure, Terraform, Docker, Docker Compose, Kubernetes, Linux                           |
| Delivery & tooling       | Git, GitHub Actions, Sentry, Bun, ESLint, Prettier, Vitest, React Testing Library                         |
| Trading tools            | MetaTrader                                                                                                |

<details>
<summary><strong>Code sample · Django and Celery</strong></summary>

A worker can pick up a task before its database record is visible. Scheduling the task after the transaction commits keeps the two in order.

```python
from functools import partial

from django.db import transaction

with transaction.atomic():
    run = WorkflowRun.objects.create(status="queued")
    transaction.on_commit(partial(execute_workflow.delay, run.pk))
```

</details>

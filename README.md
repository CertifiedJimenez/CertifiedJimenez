# Cristofer Jimenez

I’m a senior software engineer and contractor based in London. I build Python APIs, distributed systems, and the backend services that AI agents rely on in production.

**Technologies I work with**

- **Backend** — Python, Django REST Framework, PostgreSQL
- **Background jobs** — Celery, Redis, AWS SQS
- **Infrastructure** — Docker, Terraform, AWS, Azure

**How I think about reliability**

Two workers can receive the same job. In Django, I’d let PostgreSQL decide which worker claims it by checking and changing its state in one update.

```python
def claim_job(job_id: int) -> bool:
    updated = Job.objects.filter(pk=job_id, status="queued").update(status="running")
    return updated == 1
```

[Portfolio](https://cristoferjimenez.com/) · [LinkedIn](https://www.linkedin.com/in/cristofer-jimenez) · [Email](mailto:contact@cristoferjimenez.com)

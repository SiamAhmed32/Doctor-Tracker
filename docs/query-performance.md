# Query Performance Evidence

This report was generated locally with:

```bash
npm run seed:demo
npm run report:queries
```

`report:queries` explains the **same filter shapes** used in production list services (`DoctorService.list` / `PatientService.list`):

- Filterable string fields (`specialization`, `hospital`, `condition`) are stored lowercase and queried with equality after `normalizeFilterValue()` — not case-insensitive `$regex`.
- Text uses `$text` against the doctor text index.
- Nested patients use the `doctor` + `createdAt` compound index.

The sample dataset contained 6 doctors and 20 patients. These figures establish index usage, not production-scale throughput; rerun the command after loading a larger representative dataset for deployment capacity planning.

| Query | Winning index | Documents examined | Keys examined | Returned | Execution time |
| --- | --- | ---: | ---: | ---: | ---: |
| Doctors ordered by newest | `createdAt_-1` | 6 | 6 | 6 | 0 ms |
| Doctors filtered by specialization (equality) | `specialization_1_createdAt_-1` | 2 | 2 | 2 | 0 ms |
| Doctor text search | `doctor_text_search` | 2 | 2 | 2 | 0 ms |
| Patients filtered by condition (equality) | `condition_1_createdAt_-1` | 4 | 4 | 4 | 0 ms |
| Patients for a doctor | `doctor_1_createdAt_-1` | 6 | 6 | 6 | 0 ms |

The `IXSCAN` and `TEXT_MATCH` winning plans show that the expected indexes are selected for the key list, filter, relationship, and search paths. On this sample, examined keys and documents remain close to returned results.

After pulling these changes, reseed once so existing title-case filter values are rewritten lowercase:

```bash
npm run seed:demo
```

# Query Performance Evidence

This report was generated locally with:

```bash
npm run report:queries
```

The sample dataset contained 6 doctors and 20 patients. These figures establish index usage, not production-scale throughput; rerun the command after loading a larger representative dataset for deployment capacity planning.

| Query | Winning index | Documents examined | Keys examined | Returned | Execution time |
| --- | --- | ---: | ---: | ---: | ---: |
| Doctors ordered by newest | `createdAt_-1` | 6 | 6 | 6 | 1 ms |
| Doctors filtered by specialization | `specialization_1_createdAt_-1` | 2 | 2 | 2 | 2 ms |
| Doctor text search | `doctor_text_search` | 2 | 2 | 2 | 1 ms |
| Patients filtered by condition | `condition_1_createdAt_-1` | 4 | 4 | 4 | 2 ms |
| Patients for a doctor | `doctor_1_createdAt_-1` | 6 | 6 | 6 | 2 ms |

The `IXSCAN` and `TEXT_MATCH` winning plans show that the expected indexes are selected for the key list, filter, relationship, and search paths. On this sample, examined keys and documents remain close to returned results.

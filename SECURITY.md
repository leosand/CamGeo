# Security Policy

## Supported versions

CamGeo is pre-1.0. Only the latest state of `main` is supported.

## Reporting a vulnerability

Please do **not** open a public issue for security problems — this includes exposed credentials, but also **data protection issues** (e.g. a published file revealing sensitive locations, in breach of `docs/DATA_POLICY.md`).

Instead, contact the repository owner privately via GitHub (profile link on the repository page) with:

1. A description of the problem
2. The file(s) or commit(s) concerned
3. Whether public data is affected (urgent) or only repository code

You will receive an acknowledgement within 72 hours. Verified problems are fixed as quickly as possible; serious privacy issues trigger immediate data removal, then a public post-mortem once resolved.

## Scope notes

- Secrets must never be committed (see `docs/DATA_POLICY.md` §5); CI will not catch every case, so report any leak you spot, even historical.
- Google Earth Engine authentication is personal and local; this repository never stores GEE credentials.

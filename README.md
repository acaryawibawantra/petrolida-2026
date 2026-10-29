# Petrolida 2026 FE

## Setup

Use Bun for dependency management and local development.

```bash
bun install
bun run dev
```

## Notes

- Husky runs on local machines where `git` is available.
- Docker builds disable Husky during install so image builds stay deterministic.
- Keep using Biome for linting and formatting.

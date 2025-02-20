# Data migrations

Drizzle currently lacks support for typescript migrations: https://github.com/drizzle-team/drizzle-orm/discussions/2832
To run a data migration, this project can use a similar pattern to Prisma: https://www.prisma.io/docs/orm/prisma-migrate/workflows/data-migration

Data migrations should be configured inside `data-migrations` using the same migration file name, for example `0024_blue_snowbird.ts`.

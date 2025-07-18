import postgres from 'postgres'

let sql: ReturnType<typeof postgres> | null = null

export function usePostgres() {
  if (!sql) {
    if (!process.env.NUXT_POSTGRES_URL) {
      throw new Error('Missing `NUXT_POSTGRES_URL` environment variable')
    }
    sql = postgres(process.env.NUXT_POSTGRES_URL, {
      ssl: { rejectUnauthorized: false },
      prepare: false
    })
  }
  return sql
}

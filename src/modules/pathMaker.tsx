import 'server-only'
export const assetsPath = (url: string): string => {
  const host = process.env.HOST
  const port = process.env.PORT
  const base = process.env.NEXT_PUBLIC_BASE_PATH
  return `${host}${port ? `:${port}` : '' }${base || ''}/assets${url}` 
}
export const assetsPath = (url: string): string => {
  const USE_HTTP = process.env.USE_HTTP === '1' 
  const host = process.env.HOST
  const port = process.env.PORT
  const base = process.env.BASE_PATH
  return `${USE_HTTP ? 'http' : 'https'}://${host}${port ? `:${port}` : '' }${base || ''}/assets${url}` 
}
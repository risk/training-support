export const staticPath = (url: string) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH
  return `${basePath || ''}${url}`
}
export const staticPaths = (url: string) => {
  const basePath = process.env.BASE_PATH
  if(basePath) {
    return `${basePath}` + url
  }
  return url
}
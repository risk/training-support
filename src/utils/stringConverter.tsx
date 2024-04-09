export const secToMins = (source: number | undefined) => {
  if(source === undefined || source === -1) {
    return '∞'
  }
  const min = Math.floor(source / 60)
  const sec = source % 60
  const minS = min > 0 ? `${min}分` : ''
  const secS = sec !== 0 ? `${sec}秒` : ''
  return `${minS}${secS}`
}
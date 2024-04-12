

const baseFetchOption = {
  cache: 'no-store',
  credentials: 'include',
} as RequestInit

export const getJsonFile = async (url:string): Promise<Object | null> => {

  console.log(url)
  try {
    const options = {
      ...baseFetchOption,
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    } 

    const res = await fetch(url, options)
    if(res.status === 200) {
      return await res.json()
    }
    console.error(res.status, res.statusText)
  } catch(err) {
    console.error('catch', err)
  }
  return null
}
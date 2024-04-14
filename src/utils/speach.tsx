'use client'
interface SpeachProps {
  text: string
  pitch?: number
  rate?: number
}

const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));

export async function speachText(text: string, rate: number = 1, pitch: number = 1) {
  if(text === '') {
    return
  }
  const synth = window.speechSynthesis;
  const utterThis = new SpeechSynthesisUtterance(text)

  let timeout = 5
  while(synth.getVoices().length === 0 && timeout) {    
    await sleep(100)
    timeout = timeout > 0 ? timeout -1 : 0
  }
  const voices = synth.getVoices()
  let voice = voices.find(v => v.name === 'Google 日本語')
  if(voice === undefined) {
    voice = voices.find(v => v.lang === 'ja-JP')
    if(voice === undefined) {
      return
    }
  }
  utterThis.voice = voice
  utterThis.pitch = pitch || 1
  utterThis.rate = rate || 1
  synth.speak(utterThis)

  console.log('speached')

  return (
    <></>
  )

}


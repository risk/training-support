import React from 'react'

import {
  Text,
  CircularProgress,
  CircularProgressLabel
} from '@chakra-ui/react'

import { staticPaths } from '@/utils/pathAdjust'

type onStartHandler = () => void
type onPauseHandler = () => void
type onNextHandler = () => void
type onDoneHandler = () => void

interface TrainingProgressProps {
  hidden: boolean
  id: string
  header?: string
  name: string
  description: string
  duration: number
  onStart: onStartHandler
  onPause?: onPauseHandler
  onDone: onDoneHandler
}

interface TrainingProgressState {
  progress: {
    count: number
  }
}

export class TrainingProgress extends React.Component<TrainingProgressProps, TrainingProgressState> {

  timer: NodeJS.Timeout | undefined
  currentTime: number = 0
  
  isDone: boolean = true

  constructor(props: TrainingProgressProps) {
    super(props)
    this.state = {
      progress: {
        count: 0
      }
    }
  }

  updateTimer() {
    const count = this.state.progress.count + 1
    this.setState({
      progress: {
        count
      }
    })
    if(this.props.duration !== -1 && count >= this.props.duration) {
      this.done()
    }
  }

  start() {
    console.log('start')
    if(this.isDone) {
      this.setState({
        progress: {
          count: 0
        } 
      })
      this.isDone = false
    }
    this.timer = setInterval(this.updateTimer.bind(this), 1000)
  }

  pause() {
    console.log('pause')
    clearInterval(this.timer)
    this.timer = undefined
    if(this.props.onPause) {
      this.props.onPause()
    } 
  }

  done() {
    const se = document.getElementById('progress-term') as HTMLAudioElement
    se.play()
    console.log('done', this.timer)
    if(this.timer) {
      clearInterval(this.timer)
      this.timer = undefined
    }
    this.isDone = true
    this.props.onDone()
  }

  render(): React.ReactNode {
    const duration = this.props.duration !== -1 ? this.props.duration : '∞'
    return (
      <>
        {!this.props.hidden && (
          <CircularProgress size={120} max={this.props.duration} value={this.state.progress.count}>
            <CircularProgressLabel>
              <Text fontSize="ms" color="gray.600">{this.state.progress.count}</Text>
              <Text fontSize="xs" color="gray.400">{duration}</Text>
            </CircularProgressLabel>
          </CircularProgress>
        )}
        <audio id="progress-term" src={staticPaths('/wavs/maou_se_system47.wav')} />
      </>
    )
  }
}

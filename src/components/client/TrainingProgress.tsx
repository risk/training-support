import React from 'react'

import {
  Flex,
  Heading,
  Text,
  Divider,
  CircularProgress,
  CircularProgressLabel,
  Stack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Center
} from '@chakra-ui/react'

import { secToMins } from '@/utils/stringConverter'
import { staticPath } from '@/utils/pathAdjust'

type onStartHandler = () => void
type onPauseHandler = () => void
type onDoneHandler = () => void

interface TrainingProgressProps {
  hidden: boolean
  id: string
  header?: string
  name: string
  duration: number
  bg?: string
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

  se: HTMLAudioElement | undefined = undefined

  constructor(props: TrainingProgressProps) {
    super(props)
    this.state = {
      progress: {
        count: 0
      },
    }
  }

  updateTimer() {
    const count = this.state.progress.count + 1
    this.setState({
      ...this.state,
      progress: {
        count
      }
    })
    if(this.props.duration !== -1 && count >= this.props.duration) {
      this.done()
    }
  }

  start() {
    if(this.timer !== undefined) {
      return
    }
    if(this.state.progress.count === 0) {
      this.se?.play()
    }
    console.log('start')
    if(this.isDone) {
      this.setState({
        ...this.state,
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
    if(this.timer) {
      clearInterval(this.timer)
      this.timer = undefined
      if(this.props.onPause) {
        this.props.onPause()
      } 
    }
  }

  done() {
    console.log('done', this.timer)
    this.se?.play()
    if(this.timer) {
      clearInterval(this.timer)
      this.timer = undefined
      this.isDone = true
    }
    this.setState({
      progress: {
        count: this.props.duration
      } 
    })
    this.props.onDone()
  }

  componentDidMount(): void {
    this.se = document.getElementById('progress-term') as HTMLAudioElement
  }

  render(): React.ReactNode {
    const duration = this.props.duration !== -1 ? this.props.duration : '∞'
    return (
      <>
        {!this.props.hidden && (
          <Card id={this.props.id} direction={'row'} bg={this.props.bg ? `${this.props.bg}.100` : 'purple.100'} boxShadow="xs" overflow='hidden'>
            <Flex alignItems='center' bg={this.props.bg ? `${this.props.bg}.300` : 'purple.300'}>
              <CircularProgress w={120} h={120} size={120} color={this.props.bg ? `${this.props.bg}.600` : 'purple.600'} max={this.props.duration} value={this.state.progress.count}>
                <CircularProgressLabel>
                  <Text fontSize="ms" color="gray.100">{this.state.progress.count}</Text>
                  <Center>
                    <Divider colorScheme="gray.100" width='50%' />
                  </Center>
                  <Text fontSize="xs" color="gray.200">{duration}</Text>
                </CircularProgressLabel>
              </CircularProgress>
            </Flex>
            <Stack flexGrow={1}>
              <CardHeader px={4} py={2}>
                <Heading>
                  { this.props.header && <Text fontSize="sm" color="gray.600">{this.props.header}</Text>}
                </Heading>
              </CardHeader>
              <CardBody px={4} py={2}>
                <Text fontSize="md">{this.props.name}</Text>
              </CardBody>
              <CardFooter px={4} py={2} justifyContent="space-between">
                <Text size="sm">
                  {secToMins(this.props.duration)}
                </Text>
              </CardFooter>
            </Stack>
          </Card>
        )}
        <audio id="progress-term" src={staticPath('/assets/sound/maou_se_system47.mp3')} />
      </>
    )
  }
}

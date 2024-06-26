import {
  Heading,
  Box
} from '@chakra-ui/react'

import trainingTypesJson from '../../public/assets/json/trainingTypes.json'
import trainingsJson from '../../public/assets/json/trainings.json'
import { TrainingItem, TrainingType } from '@/modules/trainingData'

import { Training } from '@/components/client/Taining'

interface TrainingTypeJson {
  id: number
  name: string
  bg?: string
}
const defaultTrainingTypeBg: string = 'blue'
interface TrainingJson {
  id: string
  type?: number
  name: string
  duration?: number
}

const defaultTrainingDuration: number = 30

async function getTrainingParameter(): Promise<{types: TrainingType[], items: TrainingItem[]}> {

  const setTrainingType = (types: TrainingTypeJson[]): TrainingType[] => {
    return types.map((type: TrainingTypeJson) : TrainingType => {
      type.bg = type.bg || defaultTrainingTypeBg
      return type as TrainingType
    })
  }

  const setTraining = (trainings: TrainingJson[]): TrainingItem[] => {
    return trainings.map((training: TrainingJson) : TrainingItem => {
      training.duration = training.duration || defaultTrainingDuration
      return training as TrainingItem
    })
  }
  const types = setTrainingType(trainingTypesJson as TrainingTypeJson[])
  const items = setTraining(trainingsJson as TrainingJson[])

  return {
    types, items
  }
}

export default async function Index() {

  const {types, items} = await getTrainingParameter()

  return (
    <main>
      <Box bg="blue.400" p={2}>
        <Heading as='h2' size='ms' color="white">
          トレーニングサポート
        </Heading>
      </Box>
      <Training types={types} items={items} />
    </main>
  )
}
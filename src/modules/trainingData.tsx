import { Training } from '@/components/client/Taining'
import { addPointerEvent } from 'framer-motion'
import { v4 as uuidV4 } from 'uuid'

export interface TrainingType {
  id: number
  name: string
  bg: string
}

export interface TrainingItem {
  id: string
  type?: number
  name: string
  duration: number
}

export const getTrainingTypes = (types: TrainingType[], typeId?: number) : TrainingType | undefined => {
  return types?.find(type => type.id === typeId)
}

export const getTrainingItem = (items: TrainingItem[], id: string): TrainingItem => {
  return items?.find(item => item.id === id) || items[0]
}

function addPreparationAndCooldown(items: TrainingItem[], addItems: TrainingItem[]): TrainingItem[] {
  return [
    {...(getTrainingItem(items, 'common-1')), id: uuidV4()},
    ...addItems,
    {...(getTrainingItem(items, 'common-6')), id: uuidV4()}
  ]
}

export function makeTrainingList(items: TrainingItem[], type?: number): TrainingItem[] {
  const baseAddList = type === undefined
      ? items.filter(item => item.type !== 0)
      : items.filter(item => item.type === type)

  const addItems: TrainingItem[] = []
  let beforType = 1
  baseAddList.forEach((item, index) => {
    if(index !== 0) {
      if(beforType === item.type) {
        addItems.push({...(getTrainingItem(items, 'common-2')), id: uuidV4()})
      } else {
        addItems.push({...(getTrainingItem(items, 'common-3')), id: uuidV4()})
        beforType = item.type || 0
      }
    }
    addItems.push({...item, id: uuidV4()})
  })
  return addPreparationAndCooldown(items, addItems)
}
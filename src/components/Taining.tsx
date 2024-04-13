"use client"
import { v4 as uuidV4 } from 'uuid'
import { useState, useRef } from 'react'
import {
  Box,
  Flex,
  SimpleGrid,
  Stack, HStack,
  Heading,
  Text,
  Button
} from '@chakra-ui/react'
import { secToMins } from '@/utils/stringConverter'
import { TrainingItem, ItemActions } from '@/components/TrainingItem'
import { TrainingProgress } from '@/components/TrainingProgress'

export interface TrainingType {
  id: number
  name: string
  bg: string
}

export interface Training {
  id: string
  type?: number
  name: string
  duration: number
}

interface TrainingPropos {
  types: TrainingType[]
  items: Training[]
}

export const Training: React.FC<TrainingPropos> = ({types, items}) => {

  const getTrainingTypes = (typeId?: number) : TrainingType | undefined => {
    if(typeId === undefined) {
      return undefined
    }
    return types.find(type => type.id === typeId)
  }

  const [executeList, setExecuteList] = useState<Training[]>([]);
  const [executeTraininig, setExecuteTraining] = useState<Training>({
    id: '',
    name: '',
    duration: 0
  })

  const progressRef = useRef<TrainingProgress>(null)

  const onItemAdd = (id: string) => {
    console.log('add!', id)
    
    const targetTraining = items.find(item => item.id === id)
    if(targetTraining) {
      setExecuteList([...executeList, {
        ...targetTraining,
        id: uuidV4()
      }])
    }
  }

  const onItemDelete = (id: string)=> {
    console.log('delete!', id)
    setExecuteList(executeList.filter(item => item.id !== id))
  }

  const getTrainingItem = (id: string): Training => {
    return items.find(item => item.id === id) || items[0]
  }

  return (
    <>
      <Flex p={4}>
        <Box flex="1" p={4}>
          <Heading as='h2' size='lg' textAlign="center" mb={4}>
            メニュー
          </Heading>
          <HStack mb={4} spacing={4} justifyContent="center">
            <Button onClick={() => {
              const baseAddList = items.filter(item => item.type !== 0)
              let addList: Training[] = []

              let beforType = 1
              baseAddList.forEach((item, index) => {
                if(index !== 0) {
                  if(beforType === item.type) {
                    addList.push({...(getTrainingItem('common-2')), id: uuidV4()})
                  } else {
                    addList.push({...(getTrainingItem('common-3')), id: uuidV4()})
                    beforType = item.type || 0
                  }
                }
                addList.push({...item, id: uuidV4()})
              })
              addList = [
                {...(getTrainingItem('common-1')), id: uuidV4()},
                  ...addList,
                  {...(getTrainingItem('common-6')), id: uuidV4()}]
              setExecuteList(addList)
            }}>Add all training</Button>
          </HStack>
          <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
            {items.map(item => (
                <TrainingItem
                  key={item.id}
                  id={item.id}
                  header={getTrainingTypes(item.type)?.name}
                  name={item.name}
                  duration={item.duration || -1}
                  bg={getTrainingTypes(item.type)?.bg || 'white'}
                  mode={ItemActions.add}
                  onAction={onItemAdd}
                />
              )
            )}
          </SimpleGrid>
        </Box>
        <Box flex="1" p={4}>
          <Heading as='h2' size='xl' textAlign="center" mb={4}>
            実行メニュー
          </Heading>
          <HStack mb={4} spacing={4} justifyContent="center">
            <Button onClick={() => {
              if(!progressRef.current) {
                return
              }
              if(!progressRef.current.isDone) {
                console.log('resume')
                progressRef.current.start()
                return
              }
              if(executeList.length === 0) {
                return
              }
              const target = executeList.slice(0)[0]
              setExecuteTraining(target)
              console.log(executeList.slice(1))
              setExecuteList(executeList.slice(1))
              progressRef.current.start()
            }}>Start</Button>
            <Button onClick={() => {
              if(progressRef.current) {
                progressRef.current.pause()
              }
            }}>Pause</Button>
            <Button onClick={() => {
              if(progressRef.current) {
                progressRef.current.done()
              }
            }}>Done</Button>
          </HStack>
          <Flex alignItems="center">
            <Stack flexGrow={1}>
              <TrainingItem
                hidden={executeTraininig.id === ''}
                id={`exec-${executeTraininig.id}`}
                header={getTrainingTypes(executeTraininig.type)?.name}
                name={executeTraininig.name}
                duration={executeTraininig.duration || -1}
                bg={getTrainingTypes(executeTraininig.type)?.bg || 'white'}
                mode={ItemActions.none}
              />
            </Stack>
            <TrainingProgress
              ref={progressRef}
              hidden={executeTraininig.id === ''}
              id={executeTraininig.id}
              header={getTrainingTypes(executeTraininig.type)?.name}
              name={executeTraininig.name}
              description=''
              duration={executeTraininig.duration}
              onStart={() => { console.log("Start!") }}
              onDone={() => {
                if(executeList.length === 0) {
                  return
                }
                const target = executeList.slice(0)[0]
                setExecuteTraining(target)
                setExecuteList(executeList.slice(1))
                if(progressRef.current) {
                  progressRef.current.start()
                }
              }}
              />
          </Flex>
          <Heading as='h2' size='xl' textAlign="center" m={4}>
            <Text>実行リスト</Text>
            <Text fontSize="md" >(TrainingTime:&nbsp;{secToMins(executeList.reduce<number>((p, c) => {
              p = p + c.duration
              return p
            }, 0))})</Text>
          </Heading>
          {executeList.length > 0 &&
            <Flex mb={4}>
              <Flex alignItems="center" p={4} bg="blue.600">
                <Text as="b" color="white">NEXT</Text>
              </Flex>
              <Box flexGrow={1}>
                <TrainingItem
                  key={executeList[0].id}
                  id={executeList[0].id}
                  header={getTrainingTypes(executeList[0].type)?.name}
                  name={executeList[0].name}
                  duration={executeList[0].duration || -1}
                  bg={getTrainingTypes(executeList[0].type)?.bg}
                  mode={ItemActions.delete}
                  onAction={onItemDelete}
                />
              </Box>
            </Flex>
          }

          <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
            {executeList.slice(1).map(item => (
                <TrainingItem
                  key={item.id}
                  id={item.id}
                  header={getTrainingTypes(item.type)?.name}
                  name={item.name}
                  duration={item.duration || -1}
                  bg={getTrainingTypes(item.type)?.bg}
                  mode={ItemActions.delete}
                  onAction={onItemDelete}
                />
              )
            )}
          </SimpleGrid>
        </Box>
      </Flex>
    </>
  )
}
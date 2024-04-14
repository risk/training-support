"use client"
import { v4 as uuidV4 } from 'uuid'
import { useState, useRef, useEffect } from 'react'
import {
  Box,
  Flex,
  SimpleGrid,
  HStack, VStack,
  Heading,
  Text,
  Button,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react'
import { secToMins } from '@/utils/stringConverter'
import { TrainingCard, ItemActions } from '@/components/client/TrainingCard'
import { TrainingProgress } from '@/components/client/TrainingProgress'
import { AddIcon } from '@chakra-ui/icons'
import { speachText } from '@/utils/speach'
import {
  TrainingType, TrainingItem,
  getTrainingItem,
  getTrainingTypes,
  makeTrainingList
} from '@/modules/trainingData'

interface TrainingPropos {
  types: TrainingType[]
  items: TrainingItem[]
}

export const Training: React.FC<TrainingPropos> = ({types, items}) => {

  const toast = useToast()
  const [executeList, setExecuteList] = useState<TrainingItem[]>([]);
  const [executeTraininig, setExecuteTraining] = useState<TrainingItem>({
    id: '',
    name: '',
    duration: 0
  })
  const { isOpen, onOpen, onClose } = useDisclosure()

  const progressRef = useRef<TrainingProgress>(null)
  const btnRef = useRef(null)

  const onItemAdd = (id: string) => {
    console.log('add!', id)
    
    const targetTraining = items.find(item => item.id === id)
    if(targetTraining) {
      setExecuteList([...executeList, {
        ...targetTraining,
        id: uuidV4()
      }])
      toast({
        title: 'メニューを追加しました',
        description: `「${targetTraining.name}」を追加しました。`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const onItemDelete = (id: string)=> {
    console.log('delete!', id)
    setExecuteList(executeList.filter(item => item.id !== id))
  }

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={btnRef}
        size='md'
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Heading as='h2' size='ms' textAlign="center" mb={4}>
              トレーニングメニュー
            </Heading>
          </DrawerHeader>
          <DrawerBody>
            <Tabs>
              <TabList>
                <Tab>Preset</Tab>
                <Tab>Manual</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <VStack spacing={4} justifyContent="center">
                    <Button onClick={() => {                      
                      
                    }}>Add all training</Button>
                    {types.filter(type => type.id !== 0).map((type, index) => (
                        <Button key={`preset-${index}`} onClick={() => {
                          setExecuteList(makeTrainingList(items, type.id))
                        }}>Add {type.name} items</Button>
                      )
                    )}
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <Accordion allowToggle>
                    {types.map((type, index) => (
                      <AccordionItem key={`manual-type-${index}`}>
                        <AccordionButton _expanded={{ bg: 'blue.600', color: 'white' }}>
                          <Box as='span' flex='1' textAlign='left'>
                            {type.name}
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                          <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                            {items.filter(item => item.type === type.id).map((item, index) => (
                                <TrainingCard
                                  key={`manual-item-${index}`}
                                  id={item.id}
                                  header={getTrainingTypes(types, item.type)?.name}
                                  name={item.name}
                                  duration={item.duration || -1}
                                  bg={getTrainingTypes(types, item.type)?.bg || 'white'}
                                  mode={ItemActions.add}
                                  onAction={onItemAdd}
                                />
                              )
                            )}
                          </SimpleGrid>
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Box maxW={600} p={4}>
        <HStack p={4} alignItems="baseline">
          <Heading as='h2' size='lg' textAlign="center">
            トレーニングメニュー
          </Heading>
          <IconButton
                ref={btnRef}
                onClick={onOpen}
                isRound={true}
                variant='solid'
                colorScheme='teal'
                aria-label='Menu open'
                fontSize='20px'
                icon={<AddIcon/>}
          />
        </HStack>
        <Box p={4}>
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
              setExecuteList(executeList.slice(1))
              speachText(target.name)
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
          <TrainingProgress
            ref={progressRef}
            hidden={executeTraininig.id === ''}
            id={executeTraininig.id}
            bg={getTrainingTypes(types, executeTraininig.type)?.bg}
            header={getTrainingTypes(types, executeTraininig.type)?.name}
            name={executeTraininig.name}
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
                speachText(target.name)
                progressRef.current.start()
              }
            }}
          />

          {executeList.length > 0 &&
            <>
              <Heading as='h2' size='lg' textAlign="center" m={4}>
                <Flex overflow='hidden' borderRadius='lg' color="white">
                  <Box flexShrink={0} bg='red.600' p={4}>
                    <Text fontSize="lg">Remaining</Text>
                  </Box>
                  <Box flexGrow={1} bg='red.400' p={4}>
                    <Text fontSize="lg">{secToMins(executeList.reduce<number>((p, c) => {
                        p = p + c.duration
                        return p
                      }, 0))}
                    </Text>
                  </Box>
                </Flex>
              </Heading>
              <Flex mb={4}>
                <Box flexGrow={1}>
                  <TrainingCard
                    infoLabel='NEXT'
                    key={executeList[0].id}
                    id={executeList[0].id}
                    header={getTrainingTypes(types, executeList[0].type)?.name}
                    name={executeList[0].name}
                    duration={executeList[0].duration || -1}
                    bg={getTrainingTypes(types, executeList[0].type)?.bg}
                    mode={ItemActions.delete}
                    onAction={onItemDelete}
                  />
                </Box>
              </Flex>
            </>
          }

          <SimpleGrid spacing={4} minChildWidth='200px'>
            {executeList.slice(1).map((item, index) => (
                <TrainingCard
                  infoLabel={`${index + 1}`}
                  key={item.id}
                  id={item.id}
                  header={getTrainingTypes(types, item.type)?.name}
                  name={item.name}
                  duration={item.duration || -1}
                  bg={getTrainingTypes(types, item.type)?.bg}
                  mode={ItemActions.delete}
                  onAction={onItemDelete}
                />
              )
            )}
          </SimpleGrid>
        </Box>
      </Box>
    </>
  )
}
import React from 'react'

import {
  Box,
  Heading,
  Text,
  IconButton,
  Card, CardHeader, CardBody, CardFooter
} from '@chakra-ui/react'
import { CheckIcon, DeleteIcon } from "@chakra-ui/icons"

import { secToMins } from '@/utils/stringConverter'

export const ItemActions = {
  none: 'none',
  add: 'add',
  delete: 'delete',
} as const;
type ItemAction = (typeof ItemActions)[keyof typeof ItemActions];

type onActionHandler = (id: string) => void

interface TrainingItemProps {
  hidden?: boolean
  id: string
  header?: string
  name: string
  description: string
  duration: number
  bg?: string
  mode: ItemAction
  onAction?: onActionHandler
}

export class TrainingItem extends React.Component<TrainingItemProps> {
  constructor(props: TrainingItemProps) {
    super(props)
  }

  onAction(event: React.MouseEvent) {
    console.log(event)
    if(this.props.onAction && this.props.id) {
      this.props.onAction(this.props.id)
    }
  }

  render(): React.ReactNode {


    return (
      <Box>
        {!this.props.hidden && 
          <Card id={this.props.id} bg={this.props.bg || 'white'} boxShadow="xs">
            <CardHeader display="flex" justifyContent={'space-between'}>
              <Heading>
                { this.props.header && <Text fontSize="sm" color="gray.400">{this.props.header}</Text>}
                <Text fontSize="md">{this.props.name}</Text>
              </Heading>
              <Text size="sm">
                {secToMins(this.props.duration)}
              </Text>
            </CardHeader>
            {/* <CardBody>
              <Text>{this.props.description}</Text>                            
            </CardBody> */}
            <CardFooter justifyContent="right">
              {this.props.mode !== ItemActions.none && <IconButton
                onClick={this.onAction.bind(this)}
                isRound={true}
                variant='solid'
                colorScheme={(() => {
                  switch(this.props.mode) {
                    case ItemActions.add:
                      return 'teal'
                    case ItemActions.delete:
                      return 'red'
                  }
                  return undefined
                })()}
                aria-label='Done'
                fontSize='20px'
                icon={(() => {
                  switch(this.props.mode) {
                    case ItemActions.add:
                      return <CheckIcon/>
                    case ItemActions.delete:
                      return <DeleteIcon/>
                  }
                  return undefined
                })()}
              />}
            </CardFooter>
          </Card>
        }
      </Box>
    )
  }
}
import { Box, Text } from '@chakra-ui/react'
import {CloseIcon} from '@chakra-ui/icons'
import React from 'react'

const UserBadgeItem = ({user,handleFunction}) => {
  return (
    <Box
        px={2}
        py={1}
        borderRadius='lg'
        m={1}
        mb={2}
        variant='solid'
        display='flex'
        alignItems='center'
        bg='purple'
        color='white'
        cursor='pointer'
        onClick={handleFunction}
    >
      <Text mr={3}>
        {user.name}
      </Text>
      <CloseIcon fontSize={12}/>
    </Box>
  )
}

export default UserBadgeItem

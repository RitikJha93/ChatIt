import { Avatar, Box, Text } from '@chakra-ui/react'
import React, { useContext } from 'react'
import ChatContext from '../../context/ChatContext'

const UserListItem = ({user,handleFunction}) => {
    console.log(user);
  return (
    <Box 
        onClick={handleFunction}
        cursor='pointer'
        bg='#E8E8E8'
        _hover={{
            background:'#38B2AC',
            color:"white"
        }}
        display='flex'
        alignItems='center'
        width='100%'
        color='black'
        px={3}
        py={2}
        mb={2}
        borderRadius='lg'
    >
        <Avatar
         mr={2}
         size='sm'
         cursor='pointer'
         name={user.name}
         src={user.pic}
        >
            
        </Avatar>
        <Box>
            <Text>{user.name}</Text>
            <Text fontSize='xs'> <b>Email : </b> {user.email}</Text>
        </Box>
    </Box>
  )
}

export default UserListItem

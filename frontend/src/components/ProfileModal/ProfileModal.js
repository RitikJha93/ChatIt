import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            {children ? (<span onClick={onOpen}>{children}</span>)
                : (<IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />)
            }

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent h='410px'>
                    <ModalHeader 
                        display='flex' 
                        justifyContent='center' 
                        fontSize='40px'
                    >{user.name}
                    </ModalHeader>

                    <ModalCloseButton />
                    <ModalBody display='flex' justiContent='space-between' flexDirection='column' alignItems='center'>
                        <Image
                            borderRadius='full'
                            boxSize='150px'
                            src={user.pic}
                            alt={user.name}
                        />
                        <Text fontSize={{base:'28px',md:'30px'}}>
                            Email : {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal

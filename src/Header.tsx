import React, { useState } from 'react';
import { Box, Image, Flex, IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text, Link, VStack } from '@chakra-ui/react';
import { FaInfoCircle } from 'react-icons/fa'; 
import wakeuplogo from './assets/wakeuplogo.png';
import anonymousUserIcon from './assets/unknown_icon.png'; 

interface HeaderProps {
  profilePicture: string | null;
  onProfilePictureClick: () => void; 
  onLogoClick: () => void; 
}

const Header: React.FC<HeaderProps> = ({ profilePicture, onProfilePictureClick, onLogoClick }) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); 

  return (
    <Box
      bg="black"
      py={2}
      px={4}
      position="fixed" 
      top={0}
      width="100%"
      zIndex={1000} 
    >
      <Flex justifyContent="space-between" alignItems="center">
        {}
        <Image
          src={wakeuplogo}
          alt="Logo"
          height={"30px"}
          cursor="pointer" 
          onClick={onLogoClick} 
        />

        {}
        <Flex alignItems="center" cursor="pointer" onClick={onOpen}>
          <FaInfoCircle color="white" size="24px" />
          <Text color="white" ml="5px" fontSize="lg">Info</Text>
        </Flex>

        {}
        <Image
          src={profilePicture || anonymousUserIcon}
          alt="Profile"
          borderRadius="full"
          boxSize="40px"
          cursor="pointer"
          onClick={onProfilePictureClick} 
        />
      </Flex>

      {}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Information</ModalHeader>
          <ModalBody>
            <VStack spacing={4} align="start">
              <Text fontWeight="bold">Instructions:</Text>
              <Text>1. Set your morning task and alarm.</Text>
              <Text>2. Use the app to take a photo as proof of completing your task.</Text>
              <Text>3. If the photo matches the task, your feed will be unlocked.</Text>

              <Text fontWeight="bold" mt={4}>Links:</Text>
              <Link href="https://devpost.com/software/wakeup-cu1lhi" color="blue.500" isExternal>
                DevPost
              </Link>
              <Link href="https://github.com/d-huliu/WakeUp" color="blue.500" isExternal>
                Github
              </Link>

              <Text fontWeight="bold" mt={4}>Authors:</Text>
              <Text>Developed by Yair & David for HackTheNorth 2024.</Text>
              <Text><Link href="https://yair.ca" color="blue.500" isExternal>www.yair.ca</Link></Text>
              <Text><Link href="https://dhuliu.ca" color="blue.500" isExternal>www.dhuliu.ca</Link></Text>
            </VStack>

          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} colorScheme="orange">Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Header;
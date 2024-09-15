import React, { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  VStack,
  Text,
  Box,
  Avatar,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaPlus, FaPaperPlane } from "react-icons/fa";

const dummyContacts = [
  {
    id: 1,
    name: "Drake",
    messages: [
      { from: "Drake", text: "Woke up early today!", color: "gray.300" },
      { from: "Drake", text: "Had a great morning run!", color: "gray.300" },
    ],
  },
  {
    id: 2,
    name: "Carti",
    messages: [
      { from: "Carti", text: "Rockstar lifestyle 🤘", color: "gray.300" },
      { from: "Carti", text: "Hyped for the day!", color: "gray.300" },
    ],
  },
  {
    id: 3,
    name: "Cap America",
    messages: [
      { from: "Cap America", text: "Rise and shine, soldier!", color: "gray.300" },
      { from: "Cap America", text: "Always ready for a new day.", color: "gray.300" },
    ],
  },

];

const messageColors = ["orange.500", "blue.500", "green.500", "purple.500", "red.500"];

const Chat: React.FC = () => {
  const [contacts, setContacts] = useState(dummyContacts); 
  const [selectedContact, setSelectedContact] = useState(dummyContacts[0]); 
  const [messageInput, setMessageInput] = useState<string>(""); 
  const [newFriendInput, setNewFriendInput] = useState<string>(""); 
  const [messageIndex, setMessageIndex] = useState<number>(0); 
  const toast = useToast();

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      const newMessage = { from: "You", text: messageInput, color: messageColors[messageIndex] };
      const updatedContacts = contacts.map((contact) =>
        contact.id === selectedContact.id
          ? { ...contact, messages: [...contact.messages, newMessage] }
          : contact
      );
      setContacts(updatedContacts);
      setSelectedContact({
        ...selectedContact,
        messages: [...selectedContact.messages, newMessage],
      });
      setMessageInput("");

      setMessageIndex((prevIndex) => (prevIndex + 1) % messageColors.length);
    }
  };

  const addFriend = () => {
    if (newFriendInput.trim() !== "") {
      const newFriend = {
        id: contacts.length + 1,
        name: newFriendInput.trim(),
        messages: [{ from: newFriendInput.trim(), text: "Hello! Let's chat.", color: "gray.300" }],
      };
      setContacts([...contacts, newFriend]);
      setNewFriendInput("");
      toast({
        title: `${newFriend.name} added to contacts!`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const selectContact = (contactId: number) => {
    const contact = contacts.find((c) => c.id === contactId);
    if (contact) {
      setSelectedContact(contact);
    }
  };

  return (
    <Flex
      as={motion.div}
      flexDirection="column"
      alignItems="center"
      padding="20px"
      fontFamily="'Satoshi', sans-serif"
      height="100vh"
      maxW="600px"
      margin="0 auto"
      backgroundColor="black"
      borderRadius="10px"
      boxShadow="lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Heading fontSize="2xl" color="orange.400" mb="4">
        Chat
      </Heading>

      {}
      <Box
        width="100%"
        maxH="150px"
        overflowY="auto"
        padding="10px"
        backgroundColor="rgba(255, 255, 255, 0.1)"
        borderRadius="10px"
        mb="4"
        as={motion.div}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Heading fontSize="lg" color="white" mb="2">
          Contacts
        </Heading>
        <VStack spacing={2}>
          {contacts.map((contact) => (
            <Flex
              key={contact.id}
              alignItems="center"
              width="100%"
              cursor="pointer"
              onClick={() => selectContact(contact.id)}
              backgroundColor={
                selectedContact.id === contact.id ? "orange.500" : "transparent"
              }
              borderRadius="8px"
              padding="5px"
              transition="background-color 0.2s"
              _hover={{ backgroundColor: "orange.400" }}
            >
              <Avatar name={contact.name} size="sm" marginRight="8px" />
              <Text color="white">{contact.name}</Text>
            </Flex>
          ))}
        </VStack>
      </Box>

      {}
      <Box
        width="100%"
        flex="1"
        backgroundColor="rgba(255, 255, 255, 0.1)"
        borderRadius="10px"
        padding="10px"
        overflowY="auto"
        mb="4"
        as={motion.div}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <VStack spacing={3} align="start">
          {selectedContact.messages.length > 0 ? (
            selectedContact.messages.map((msg, index) => (
              <Text
                key={index}
                color={msg.from === "You" ? "white" : "black"}
                backgroundColor={msg.color}
                padding="8px"
                borderRadius="10px"
                maxWidth="80%"
                alignSelf={msg.from === "You" ? "flex-end" : "flex-start"}
              >
                {msg.text}
              </Text>
            ))
          ) : (
            <Text color="gray.400">No messages yet. Start a conversation!</Text>
          )}
        </VStack>
      </Box>

      {}
      <Flex width="100%" mt="2" alignItems="center">
        <Input
          placeholder="Type your message..."
          color="white"
          flex="1"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          backgroundColor="rgba(255, 255, 255, 0.1)"
          borderColor="transparent"
          _focus={{
            borderColor: "orange.400",
            boxShadow: "0 0 0 2px orange.400",
          }}
          mr="2"
        />
        <IconButton
          aria-label="Send message"
          icon={<FaPaperPlane />}
          colorScheme="orange"
          onClick={sendMessage}
        />
      </Flex>

      {}
      <Flex width="100%" mt="4" alignItems="center">
        <Input
          placeholder="Enter friend's username"
          color="white"
          flex="1"
          value={newFriendInput}
          onChange={(e) => setNewFriendInput(e.target.value)}
          backgroundColor="rgba(255, 255, 255, 0.1)"
          borderColor="transparent"
          _focus={{
            borderColor: "orange.400",
            boxShadow: "0 0 0 2px orange.400",
          }}
          mr="2"
        />
        <Button
          leftIcon={<FaPlus />}
          colorScheme="orange"
          onClick={addFriend}
          flexShrink={0}
        >
          Add
        </Button>
      </Flex>
    </Flex>
  );
};

export default Chat;
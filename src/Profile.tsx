import React, { useState } from "react";
import { Flex, Heading, Input, Text, Box, Image, Switch, FormControl, FormLabel, Button, useToast } from "@chakra-ui/react";
import { motion } from "framer-motion"; 
import anonymousUserIcon from "./assets/unknown_icon.png"; 

interface ProfileProps {
  task: string;
  setTask: (task: string) => void;
  alarmTime: string;
  setAlarmTime: (time: string) => void;
  setCustomAlarm: (audio: HTMLAudioElement) => void;
  profilePicture: string | null;
  setProfilePicture: (picture: string | null) => void;
  onProfilePictureClick: () => void; 
}

const Profile: React.FC<ProfileProps> = ({ task, setTask, alarmTime, setAlarmTime, setCustomAlarm, profilePicture, onProfilePictureClick }) => {
  const [useRandomPrompt, setUseRandomPrompt] = useState<boolean>(false);
  const [savedPrompt, setSavedPrompt] = useState<string>(""); 
  const toast = useToast(); 

  const predefinedPrompts = [
    "a book",
    "a pillow",
    "my desk",
    "a chair",
    "my laptop",
    "a cup",
    "a pen",
    "the window",
    "the door",
    "my closet",
  ];

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const audioURL = URL.createObjectURL(file);
      const audioElement = new Audio(audioURL);
      setCustomAlarm(audioElement); 
      toast({
        title: `File Uploaded: ${file.name}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleToggleChange = () => {
    setUseRandomPrompt(!useRandomPrompt);
  };

  const handleSaveChanges = () => {
    if (useRandomPrompt) {

      const randomPrompt = predefinedPrompts[Math.floor(Math.random() * predefinedPrompts.length)];
      setSavedPrompt(randomPrompt);
    } else {

      setSavedPrompt(task);
    }
    toast({
      title: "Changes Saved",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <Flex as={motion.div} variants={containerVariants} initial="hidden" animate="visible" flexDirection="column" alignItems="center" padding="30px" maxW="450px" mx="auto" fontFamily="'Satoshi', sans-serif">
      {}
      <Box position="relative" onClick={onProfilePictureClick} cursor="pointer" mb="30px">
        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
          <Image
            src={profilePicture || anonymousUserIcon}
            alt="Profile"
            borderRadius="full"
            boxSize="140px"
            border="2px solid"
            borderColor="gray.600"
            _hover={{
              borderImageSlice: 1,
              borderImageSource: "linear-gradient(to right, #e4965c, #f5de71)",
            }}
          />
        </motion.div>
      </Box>

      <Text fontSize="2xl" color="white" mb="25px">Alarm Settings</Text>

      <Heading fontSize="xl" color="white" mt="15px" mb="10px">Morning Task</Heading>
      <Box
        as="div"
        position="relative"
        w="100%"
        _before={{
          content: '""',
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          borderRadius: "8px",
          border: "2px solid",
          borderImageSlice: 1,
          borderImageSource: "linear-gradient(to right, #e4965c, #f5de71)",
          pointerEvents: "none",
          zIndex: 1,
        }}
        mb="25px"
      >
        <Input
          value={useRandomPrompt ? "Random prompt selected" : task} 
          onChange={(e) => setTask(e.target.value)}
          placeholder="I will take a photo of..."
          color="white"
          position="relative"
          zIndex={2}
          border="none"
          _focus={{
            boxShadow: "none",
          }}
          isDisabled={useRandomPrompt} 
          padding="12px"
        />
      </Box>

      <FormControl display="flex" alignItems="center" mb="25px">
        <FormLabel htmlFor="prompt-toggle" mb="0" color="white" fontSize="lg">
          Use Random Prompt
        </FormLabel>
        <Switch id="prompt-toggle" isChecked={useRandomPrompt} onChange={handleToggleChange} size="lg" />
      </FormControl>

      <Heading fontSize="xl" color="white" mt="15px" mb="10px">Alarm Time</Heading>
      <Box
        as="div"
        position="relative"
        w="100%"
        _before={{
          content: '""',
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          borderRadius: "8px",
          border: "2px solid",
          borderImageSlice: 1,
          borderImageSource: "linear-gradient(to right, #e4965c, #f5de71)",
          pointerEvents: "none",
          zIndex: 1,
        }}
        mb="25px"
      >
        <Input
          value={alarmTime}
          onChange={(e) => setAlarmTime(e.target.value)}
          placeholder="12h format (i.e. 7:30)"
          color="white"
          position="relative"
          zIndex={2}
          border="none"
          _focus={{
            boxShadow: "none",
          }}
          padding="12px"
        />
      </Box>

      <Heading fontSize="xl" color="white" mt="25px" mb="15px">Upload Alarm Sound</Heading>
      <Button
        as={motion.div}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        bg="black"
        border="2px solid"
        borderColor="gray.600"
        _hover={{
          borderImageSlice: 1,
          borderImageSource: "linear-gradient(to right, #e4965c, #f5de71)",
        }}
        onClick={() => document.getElementById('audioUpload')?.click()}
        color="white"
        mb="25px"
        paddingX="30px"
        paddingY="12px"
        fontSize="lg"
      >
        Choose File
      </Button>
      <Input
        id="audioUpload"
        type="file"
        accept="audio/*"
        onChange={handleAudioUpload}
        display="none" 
      />

      <Button
        as={motion.div}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        bg="black"
        border="2px solid"
        borderColor="gray.600"
        _hover={{
          borderImageSlice: 1,
          borderImageSource: "linear-gradient(to right, #e4965c, #f5de71)",
        }}
        color="white"
        mt="25px"
        paddingX="30px"
        paddingY="12px"
        fontSize="lg"
        onClick={handleSaveChanges}
      >
        Save Changes
      </Button>

      {}
      {savedPrompt && (
        <Text color="white" mt="30px" fontSize="lg">
          Your Picture Prompt Is: {savedPrompt}
        </Text>
      )}
    </Flex>
  );
};

export default Profile;
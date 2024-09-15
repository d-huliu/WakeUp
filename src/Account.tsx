import React, { useState, useEffect } from "react";
import { Flex, Heading, Input, Button, VStack, Image, Text, useToast, Icon, Box } from "@chakra-ui/react";
import "./index.css";
// @ts-ignore
import { database, ref, set, get, child } from "./firebase"; 
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage"; 
import { v4 as uuidv4 } from "uuid"; 
import { motion } from "framer-motion"; 
import { AiOutlineUpload } from "react-icons/ai"; 
import anonymousUserIcon from "./assets/unknown_icon.png"; 

interface AccountProps {
  profilePicture: string | null;
  setProfilePicture: (picture: string | null) => void;
  name: string;
  setName: (name: string) => void;
  username: string;
  setUsername: (username: string) => void;
  saveUserData: () => void; 
}

const Account: React.FC<AccountProps> = ({
  profilePicture,
  setProfilePicture,
  name,
  setName,
  username,
  setUsername,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tempUsername, setTempUsername] = useState<string>(username); 
  const toast = useToast(); 

  const storage = getStorage();

  const getUserUUID = () => {
    let userUUID = localStorage.getItem("userUUID");
    if (!userUUID) {
      userUUID = uuidv4();
      localStorage.setItem("userUUID", userUUID);
    }
    return userUUID;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userUUID = getUserUUID();
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `users/${userUUID}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setName(data.name || "");
          setUsername(data.username || "");
          setProfilePicture(data.profilePicture || null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [setProfilePicture, setName, setUsername]);

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const userUUID = getUserUUID();
      const storageReference = storageRef(storage, `profilePictures/${userUUID}/${file.name}`);

      setLoading(true);

      const uploadTask = uploadBytesResumable(storageReference, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {

        },
        (error) => {

          console.error("Error uploading file:", error);
          toast({
            title: "Error uploading profile picture.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          setLoading(false);
        },
        () => {

          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setProfilePicture(downloadURL); 
            saveUserData(); 
            setLoading(false);
            toast({
              title: "Profile picture uploaded successfully!",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          });
        }
      );
    }
  };

  const saveUserData = async () => {
    const userUUID = getUserUUID();

    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `usernames/${tempUsername}`));

    if (snapshot.exists()) {

      const randomNumbers = Math.floor(1000 + Math.random() * 9000);
      const uniqueUsername = `${tempUsername}${randomNumbers}`;
      setUsername(uniqueUsername);
      toast({
        title: `Username taken. Changed to ${uniqueUsername}`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } else {

      setUsername(tempUsername);
    }

    const userRef = ref(database, `users/${userUUID}`);

    set(userRef, {
      name: name,
      username: tempUsername,
      profilePicture: profilePicture,
    })
      .then(() => {

        const usernameRef = ref(database, `usernames/${tempUsername}`);
        set(usernameRef, userUUID);

        toast({
          title: "Changes saved!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error: unknown) => {
        console.error("Error saving user data:", error);
        toast({
          title: "Error saving changes.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
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
    <Flex 
      as={motion.div} 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      flexDirection="column" 
      alignItems="center" 
      padding="30px"
      fontFamily="'Satoshi', sans-serif"
    >
      <Heading fontSize="2xl" color="white" mb="25px">My Profile</Heading>

      <VStack spacing={5} mt="20px">
        {}
        <Image
          as={motion.img}
          src={profilePicture || anonymousUserIcon}
          alt="Profile"
          borderRadius="full"
          boxSize="140px"
          mb="20px"
          whileHover={{ scale: 1.1 }} 
          transition={{ duration: "0.3s" }}
        />

        <Text color="gray.500" mb="2">User ID: {getUserUUID()}</Text> {}

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
            border: "1px solid",
            borderColor: "gray.600",
            _hover: {
              borderImageSlice: 1,
              borderImageSource: "linear-gradient(to right, #e4965c, #f5de71)",
            },
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <Input
            placeholder="Your Name"
            color="white"
            position="relative"
            zIndex={2}
            border="none"
            _focus={{
              boxShadow: "none",
            }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            padding="12px"
          />
        </Box>

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
            border: "1px solid",
            borderColor: "gray.600",
            _hover: {
              borderImageSlice: 1,
              borderImageSource: "linear-gradient(to right, #e4965c, #f5de71)",
            },
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <Input
            placeholder="Username"
            color="white"
            position="relative"
            zIndex={2}
            border="none"
            _focus={{
              boxShadow: "none",
            }}
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)}
            padding="12px"
          />
        </Box>

        {}
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
          leftIcon={<Icon as={AiOutlineUpload} />}
          onClick={() => document.getElementById('profilePictureInput')?.click()}
          isLoading={loading} 
          color="white"
          paddingX="30px"
          paddingY="12px"
          fontSize="lg"
        >
          Upload Profile Picture
        </Button>
        <Input
          id="profilePictureInput"
          type="file"
          accept="image/*"
          onChange={handleProfilePictureUpload}
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
          onClick={saveUserData}
          isDisabled={!name || !tempUsername} 
          color="white"
          paddingX="30px"
          paddingY="12px"
          fontSize="lg"
        >
          Save Changes
        </Button>
      </VStack>
    </Flex>
  );
};

export default Account;
import { Flex, Box, Heading, Text, Image, Button } from "@chakra-ui/react";
import React from "react";
import { AiOutlineCloseCircle } from "react-icons/ai"; 

interface SetAlarmProps {
  result: string;
  profilePicture: string | null;
  onProfilePictureClick: () => void; 
  task: string;
  setTask: (task: string) => void;
  alarmTime: string;
  setAlarmTime: (time: string) => void;
  onTakePhotoClick: () => void; 
}

const SetAlarm: React.FC<SetAlarmProps> = ({
  result,
  profilePicture,
  onProfilePictureClick,
  onTakePhotoClick, 
}) => {
  const friendsData = [
    { name: "Drake", time: "5:30am", message: "Go to Lake lolz" },
    { name: "Carti", time: "11:00am", message: "Rockstar sign rahhh" },
    { name: "Cap America", time: "8:00am", message: "selfie with doggy" },
    { name: "Hyunjin", time: "7:00am", message: "Macdonald fry" },
    { name: "CHICO", time: "5:00am", message: "leo the stuffed lion!" },
    { name: "Jimmy", time: "12:00pm", message: "set up show" },
    { name: "Ed Sheeran", time: "6:45am", message: "Take a photo with cat" },
    { name: "Yujin", time: "9:00am", message: "Do a peace sign!" },
    { name: "Tom", time: "7:30am", message: "Picture with Girlfriend!" },
  ];

  const friendImages = [
         "https://media.discordapp.net/attachments/1028158955463118921/1284800657819308042/drake_lake.jpg?ex=66e7f35b&is=66e6a1db&hm=2baf38a5fc54def2acfbf5a724d1fa6f5a0fd659259ae81420ae7a152a077ccd&=&format=webp&width=558&height=991",
"https://media.discordapp.net/attachments/1028158955463118921/1284800658192728137/carti_rocksign.jpg?ex=66e7f35b&is=66e6a1db&hm=d44ce7aebadce2931b5bb341f1145dd761a31a127a1a08202df6f7da1a026e76&=&format=webp&width=909&height=993",
"https://media.discordapp.net/attachments/1028158955463118921/1284800658662232154/chris_dog.jpg?ex=66e7f35b&is=66e6a1db&hm=ad0fc9ee0c1c46c5df94eaed5d2d7306190b3b5b383fdacd9e56fbd347b21e9d&=&format=webp&width=1017&height=993",
"https://media.discordapp.net/attachments/1028158955463118921/1284798427942748170/hyujin_fries.jpg?ex=66e7f147&is=66e69fc7&hm=0abfcad7ae9ff9d5f7e97f81793456fc2478ed3af92e2774b08c8ef31571af85&=&format=webp&width=558&height=993",
"https://media.discordapp.net/attachments/1028158955463118921/1284798426738855987/chico_stuffedanimal.jpg?ex=66e7f147&is=66e69fc7&hm=328c49595808a7410661dd4aced5ae424875fa24918f68a7f10fd3b41f13c903&=&format=webp&width=750&height=562",
"https://media.discordapp.net/attachments/1028158955463118921/1284798428265582644/jimmy_fallon_BR.webp?ex=66e7f147&is=66e69fc7&hm=22363254aaaf84d9a235059644f2327a69d41c0a457d06d93396f588fee0e201&=&format=webp&width=1036&height=993",
    "https://i.imgur.com/2AVhNRN.jpeg", 
    "https://i.imgur.com/5nj7A3Q.jpeg",   
    "https://i.imgur.com/FOGi4O2.jpeg", 

  ];

  const isFeedBlurred = !result;

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      width="100%"
      padding="20px"
      overflowY="auto"
      height={{ base: "100vh", md: "auto" }} 
      maxHeight="calc(100vh - 60px)" 
      fontFamily="'Satoshi', sans-serif" 
    >
      {}
      {profilePicture && (
        <Box position="absolute" top="10px" right="10px" cursor="pointer" onClick={onProfilePictureClick}>
          <Image src={profilePicture} alt="Profile" borderRadius="full" boxSize="50px" />
        </Box>
      )}

      <Box width={{ base: "100%", md: "80%" }} maxWidth="600px" textAlign="center" mb="20px">
        <Text fontSize="xl" color="white">Make waking up fun every day!</Text>
      </Box>

      <Box
        width={{ base: "100%", md: "80%" }} 
        maxWidth="600px"
        padding="10px"
        backgroundColor="rgba(0, 0, 0, 0.7)"
        borderRadius="10px"
        boxShadow="lg"
        overflow="hidden"
        position="relative"
      >
        {}
        {isFeedBlurred && (
          <Flex
            position="absolute"
            top="0"
            left="0"
            width="100%"
            height="100%"
            alignItems="center"
            justifyContent="center"
            backgroundColor="rgba(0, 0, 0, 0.8)"
            zIndex="1"
            backdropFilter="blur(6px)" 
            flexDirection="column"
          >
            <AiOutlineCloseCircle color="white" size="80px" /> {}
            <Text fontSize="2xl" color="white" textAlign="center" p="20px" fontWeight="bold">
              Post a photo to unlock your feed
            </Text>
            <Button
              mt="10px"
              bg="black"
              color="white"
              border="2px solid"
              borderColor="orange"
              _hover={{
                backgroundColor: "black",
                color: "white",
                borderImage: "linear-gradient(to right, #f5de71, #e4965c) 1",
              }}
              zIndex="2" 
              onClick={onTakePhotoClick} 
              fontFamily="'Satoshi', sans-serif" 
            >
              Take a Photo
            </Button>
          </Flex>
        )}

        <Heading fontSize="2xl" color="white" mb="10px" zIndex="0">Your Friends</Heading>

        <Box
          overflowY="auto"
          maxHeight="60vh" 
          paddingRight="10px"
          css={{

            "&::-webkit-scrollbar": { display: "none" },
            "-ms-overflow-style": "none", 
            "scrollbar-width": "none", 
          }}
          zIndex="0" 
        >
          {friendsData.map((friend, index) => (
            <Flex
              key={index}
              direction="column"
              mb="20px"
              backgroundColor="rgba(255, 255, 255, 0.1)"
              borderRadius="10px"
              overflow="hidden"
              boxShadow="md"
            >
              <Box p="10px" textAlign="center">
  <Text fontSize="lg" color="white" fontWeight="bold">{friend.name}</Text>
  <Text fontSize="sm" color="gray.300">{`WakeUp'd @  ${friend.time}`}</Text>
  <Text fontSize="md" color="gray.200" mt="5px"><b><u>PROMPT</u>:</b> {friend.message}</Text>
</Box>
              <Box width="100%" height={{ base: "200px", md: "300px" }} overflow="hidden">
                <Image
                  src={friendImages[index]} 
                  alt={`Image ${index + 1}`}
                  objectFit="cover"
                  objectPosition="center"
                  width="100%"
                  height="100%"
                />
              </Box>
            </Flex>
          ))}
        </Box>
      </Box>
    </Flex>
  );
};

export default SetAlarm;
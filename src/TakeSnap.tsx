import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Heading, Flex, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Text, VStack, IconButton } from "@chakra-ui/react";
import { motion } from "framer-motion"; 
import Webcam from "react-webcam";
import { IconCircle } from "@tabler/icons-react";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";
import { FaSyncAlt } from "react-icons/fa"; 

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const chat = new ChatOpenAI({
  modelName: "gpt-4o",
  maxTokens: 1024,
  openAIApiKey: OPENAI_API_KEY,
});

async function isBase64UrlImage(base64String: string) {
  let image = new Image();
  image.src = base64String;
  return await new Promise((resolve) => {
    image.onload = function () {
      if (image.height === 0 || image.width === 0) {
        resolve(false);
        return;
      }
      resolve(true);
    };
    image.onerror = () => {
      resolve(false);
    };
  });
}

type TakeSnapProps = {
  base64: string | ArrayBuffer | null;
  setBase64: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null>>;
  result: string;
  setResult: React.Dispatch<React.SetStateAction<string>>;
  capturedImage: string | null;
  setCapturedImage: React.Dispatch<React.SetStateAction<string | null>>;
  task: string;
  setTask: React.Dispatch<React.SetStateAction<string>>;
  unlockFeed: () => void; 
};

const TakeSnap: React.FC<TakeSnapProps> = ({ base64, setBase64, result, setResult, capturedImage, setCapturedImage, task, setTask, unlockFeed }) => {
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [isThinking, setIsThinking] = useState<boolean>(false); 
  const webcamRef = useRef<Webcam>(null);
  const { isOpen, onOpen, onClose } = useDisclosure(); 

  const videoConstraints = {
    width: 480,
    height: 640,
    facingMode: facingMode,
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setIsThinking(true); 
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(image, 0, 0);
          const base64Image = canvas.toDataURL("image/jpeg");
          setBase64(base64Image);
        }
      };
    }
  }, [webcamRef, setCapturedImage, setBase64]);

  useEffect(() => {
    async function runEffect() {
      if (base64) {
        if (await isBase64UrlImage(base64.toString())) {
          const message = new HumanMessage({
            content: [
              {
                type: "text",
                text: `The user intends to perform the following task today: '${task}'. Analyze the provided image to determine if it visually represents or contains elements directly related to this task. Look for objects, settings, actions, or contextual clues that indicate the task is being or has been performed. Respond with "yes" if there is clear visual evidence supporting the task (e.g., "brush teeth" might include a bathroom, toothbrush, or toothpaste). If there is no clear indication, ambiguity, or the image shows an unrelated context, respond with "no."

                Strictly respond with one word: "yes" or "no." Do not elaborate or provide any reasoning beyond this. Examples: For "make breakfast," an image of a kitchen with cooking utensils would result in "yes." For "go for a run," an image of a living room would result in "no." If in doubt or if the image lacks relevant elements, default to "no."`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64.toString().split(",")[1]}`,
                },
              },
            ],
          });
          console.log("making API Call");
          const res = await chat.invoke([message]);
          const responseText = res.content.toString().toLowerCase().trim();

          if (responseText === "no") {
            setResult(responseText);
            onOpen(); 
          } else {
            setResult(responseText);
            unlockFeed(); 
          }
        } else {
          console.error("Not an image");
        }
        setIsThinking(false); 
      } else {
        console.error("No base64");
      }
    }

    runEffect();
  }, [base64, setResult, task, onOpen, unlockFeed]);

  const handleRetry = () => {
    setCapturedImage(null);
    setBase64(null);
    setResult("");
    setIsThinking(false); 
    onClose(); 
  };

  const flipCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  useEffect(() => {
    if (!capturedImage) {
      setResult("");
    }
  }, [capturedImage]);

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const webcamVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, delay: 0.5 } },
  };

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" justifyItems="center" minHeight="100vh" p="20px">
      {}
      <motion.div variants={titleVariants} initial="hidden" animate="visible">
        <VStack spacing={2} mb="20px" align="center">
          <Heading as="h2" size="lg" color="white" mb="1">
            ⚠ ALARM ⚠
          </Heading>
          <Text color="gray.400" fontSize="lg" textAlign="center">
            Your Picture Prompt Is: "{task}".
          </Text>
        </VStack>
      </motion.div>

      {}
      <motion.div variants={webcamVariants} initial="hidden" animate="visible">
        <Box
          mx="20px"
          overflow="hidden"
          borderRadius="15px"
          boxShadow="lg"
          mb="20px"
          position="relative"
          maxWidth="100%" 
          maxHeight="80vh" 
        >
          {}
          <IconButton
            aria-label="Flip Camera"
            icon={<FaSyncAlt />}
            onClick={flipCamera}
            position="absolute"
            top="10px"
            left="10px"
            zIndex="2"
            colorScheme="orange"
            size="sm"
          />

          {capturedImage ? (
            <img src={capturedImage} alt="Captured" width="100%" style={{ borderRadius: '15px' }} />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="100%"
              videoConstraints={videoConstraints}
              style={{ borderRadius: '15px' }}
            />
          )}

          {}
          <Box
            position="absolute"
            bottom="10px"
            left="50%"
            transform="translateX(-50%)"
            zIndex={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {!isThinking ? (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={capture}
              >
                <IconCircle
                  color="white"
                  size="60px"
                  cursor="pointer"
                  style={{
                    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.5)', 
                    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
                    borderRadius: '50%', 
                  }}
                />
              </motion.div>
            ) : (
              <Text color="white" fontSize="xl" fontWeight="bold">
                Thinking...
              </Text>
            )}
          </Box>
        </Box>
      </motion.div>

      {}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Incorrect Photo</ModalHeader>
          <ModalBody>
            <Text>You did not take a photo that matches the specified task.</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleRetry}>
              Retry
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default TakeSnap;
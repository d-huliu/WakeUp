import React from "react";
import { Flex, IconButton } from "@chakra-ui/react";
import { FaHome, FaUser, FaComments } from "react-icons/fa";

interface NavBarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentTab, setCurrentTab }) => {
  return (
    <Flex
      position="fixed"
      bottom={0}
      width="100%"
      backgroundColor="black"
      justifyContent="space-evenly"
      padding="15px 0"
      borderTop="1px solid gray"
    >
      <IconButton
        icon={<FaHome />}
        aria-label="Home"
        onClick={() => setCurrentTab("home")}
        color={currentTab === "home" ? "white" : "gray.300"} 
        bgColor={currentTab === "home" ? "black" : "black"} 
        _hover={{ bgColor: "gray.600" }} 
        fontSize="30px" 
        borderRadius="full"
        size="lg"
      />
      <IconButton
        icon={<FaUser />}
        aria-label="Profile"
        onClick={() => setCurrentTab("profile")}
        color={currentTab === "profile" ? "white" : "gray.300"} 
        bgColor={currentTab === "profile" ? "black" : "black"} 
        _hover={{ bgColor: "gray.600" }} 
        fontSize="30px" 
        borderRadius="full"
        size="lg"
      />
      <IconButton
        icon={<FaComments />}
        aria-label="Chat"
        onClick={() => setCurrentTab("chat")}
        color={currentTab === "chat" ? "white" : "gray.300"} 
        bgColor={currentTab === "chat" ? "black" : "black"} 
        _hover={{ bgColor: "gray.600" }} 
        fontSize="30px" 
        borderRadius="full"
        size="lg"
      />
    </Flex>
  );
};

export default NavBar;
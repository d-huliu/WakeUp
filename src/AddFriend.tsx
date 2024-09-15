import React, { useState } from 'react';
// @ts-ignore
import { database, ref, get, set } from './firebase';
import { Flex, Input, Button, VStack, Text, useToast } from '@chakra-ui/react';

const AddFriend: React.FC<{ userId: string }> = ({ userId }) => {
  const [friendUsername, setFriendUsername] = useState('');
  const toast = useToast();

  const handleAddFriend = async () => {
    const dbRef = ref(database);
    try {

      const snapshot = await get(ref(database, `usernames/${friendUsername}`));
      if (snapshot.exists()) {
        const friendId = snapshot.val();

        await set(ref(database, `users/${userId}/friends/${friendId}`), {
          username: friendUsername,
        });

        toast({
          title: `Added ${friendUsername} as a friend.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setFriendUsername('');
      } else {
        toast({
          title: 'User not found.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  return (
    <Flex flexDirection="column" alignItems="center" padding="20px" fontFamily="'Satoshi', sans-serif">
      <VStack spacing={4}>
        <Input
          placeholder="Friend's username"
          value={friendUsername}
          onChange={(e) => setFriendUsername(e.target.value)}
          color="white"
        />
        <Button onClick={handleAddFriend} colorScheme="orange">Add Friend</Button>
      </VStack>
    </Flex>
  );
};

export default AddFriend;
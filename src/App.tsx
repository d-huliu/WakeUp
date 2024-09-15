import React, { useState, useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import Header from "./Header";
import SetAlarm from "./SetAlarm";
import TakeSnap from "./TakeSnap";
import Profile from "./Profile";
import Chat from "./Chat";
import Account from "./Account";
import NavBar from "./NavBar"; 
import alarm from "./assets/alarm.mp3"; 
import { v4 as uuidv4 } from "uuid";
// @ts-ignore
import { database, ref, set, get, child } from "./firebase.js";

function App() {
  const [base64, setBase64] = useState<string | ArrayBuffer | null>(null);
  const [result, setResult] = useState<string>("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [task, setTask] = useState<string>("");
  const [menu, setMenu] = useState<string>("setalarm");
  const [alarmTime, setAlarmTime] = useState<string>("");
  const [alarmSet, setAlarmSet] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>("home"); 
  const [audio, setAudio] = useState<HTMLAudioElement>(new Audio(alarm)); 

  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const userID = localStorage.getItem('userID') || uuidv4(); 

  useEffect(() => {

    if (!localStorage.getItem('userID')) {
      localStorage.setItem('userID', userID);
    }

    const fetchUserData = async () => {
      try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, `users/${userID}`)); 
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
  }, [userID]); 

  useEffect(() => {
    alarmSet ? audio.play() : audio.pause();
  }, [alarmSet, audio]);

  useEffect(() => {
    audio.addEventListener("ended", () => {
      setAlarmSet(false);
    });
    return () => {
      audio.removeEventListener("ended", () => {
        setAlarmSet(false);
      });
    };
  }, [audio]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const currentMinutes = currentTime.getMinutes();
      const alarmMinutes = parseInt(alarmTime.split(":")[1]);

      if (
        currentMinutes === alarmMinutes &&
        result.toLowerCase() !== "yes" &&
        result.toLowerCase() !== "yes."
      ) {
        setAlarmSet(true);
        setMenu("TakeSnap"); 
        setCurrentTab("home"); 
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [alarmTime, result]);

  useEffect(() => {
    if (result.toLowerCase() === "yes" || result.toLowerCase() === "yes.") {
      setAlarmSet(false);
      setMenu("setalarm");
    } else if (result.toLowerCase() === "no" || result.toLowerCase() === "no.") {
      setAlarmSet(true);
      setMenu("TakeSnap");
      setCurrentTab("home"); 
    }
  }, [result]);

  const saveUserData = () => {
    const userRef = ref(database, `users/${userID}`); 
    set(userRef, {
      name: name,
      username: username,
      profilePicture: profilePicture,
    })
      .then(() => {
        console.log("User data saved!");
      })
      .catch((error: unknown) => {
        console.error("Error saving user data:", error);
      });
  };

  const unlockFeed = () => {
    setResult("yes"); 
  };

  const onTakePhotoClick = () => {
    setCurrentTab("profile"); 
  };

  return (
    <Flex
      flexDirection={"column"}
      backgroundColor={"black"}
      height={"100vh"}
      mx="auto"
      alignItems={"center"}
      width={"100%"} 
      paddingTop="60px" 
      paddingBottom="60px" 
      overflowX="hidden" 
    >
      {}
      <Header
        profilePicture={profilePicture}
        onProfilePictureClick={() => setCurrentTab("account")}
        onLogoClick={() => setCurrentTab("home")} 
      />

      {}
      <Flex width="100%" justifyContent="center" alignItems="center">
        {currentTab === "home" && (
          <>
            {menu === "TakeSnap" && (
              <TakeSnap
                base64={base64}
                setBase64={setBase64}
                result={result}
                setResult={setResult}
                capturedImage={capturedImage}
                setCapturedImage={setCapturedImage}
                task={task}
                setTask={setTask}
                unlockFeed={unlockFeed} 
              />
            )}
            {menu === "setalarm" && (
              <SetAlarm
                result={result}
                task={task}
                setTask={setTask}
                alarmTime={alarmTime}
                setAlarmTime={setAlarmTime}
                profilePicture={profilePicture} 
                onProfilePictureClick={() => setCurrentTab("account")} 
                onTakePhotoClick={onTakePhotoClick} 
              />
            )}
          </>
        )}

        {currentTab === "profile" && (
          <Profile
            task={task}
            setTask={setTask}
            alarmTime={alarmTime}
            setAlarmTime={setAlarmTime}
            setCustomAlarm={setAudio} 
            profilePicture={profilePicture}
            setProfilePicture={setProfilePicture}
            onProfilePictureClick={() => setCurrentTab("account")} 
          />
        )}

        {currentTab === "account" && (
          <Account
            profilePicture={profilePicture}
            setProfilePicture={setProfilePicture}
            name={name}
            setName={setName}
            username={username}
            setUsername={setUsername}
            saveUserData={saveUserData} 
          />
        )}

        {currentTab === "chat" && <Chat />}
      </Flex>

      {}
      <NavBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </Flex>
  );
}

export default App;
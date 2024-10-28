//Importere
import React, { useContext, useState } from 'react';
import { View, Button, TextInput, Text } from 'react-native';
import * as Notifications from 'expo-notifications'; //Sender notifikationer
import { TimerContext } from '../TimerContext'; //Bruges til at holde styr på tiden på timeren.
import GlobalStyles from '../GlobalStyles';

//Oprette state, der indeholder vasketiden
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

//Wash_timer funktionen navigere til scan-skærmen og starter en timer, der tæller ned fra det antal minutter man har indtastet.
const Wash_timer = ({ navigation }) => {
  const { setRemainingTime, setIsActive } = useContext(TimerContext);
  const [washTime, setWashTime] = useState('');

  const startTimer = async () => {
    const timeInMs = parseInt(washTime) * 60000; //Omregner minutter til millisekunder

    //Hvis tiden er mindre end 0 eller ikke er et tal, gives en alert
    if (isNaN(timeInMs) || timeInMs <= 0) { 
      alert('Indtast venligst et gyldigt antal minutter');
      return;
    }

    setRemainingTime(timeInMs);
    setIsActive(true);

    //Sender notifikation ved brug af Notifications modulet, når tiden er gået
    setTimeout(async () => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Vask færdig!",
          body: `Vasketiden er færdig.`,
          sound: 'default', //Sørger for at der er en notifikationslyd - det er vigtigt at have en lyd da folk ikke altid ser notifikationen, når de var i gang med noget andet.
        },
        trigger: null,
      });
    }, timeInMs);

    //Navigerer til Scan-skærmen
    navigation.navigate('ScanScreen');
  };

  //Viser et tekstinput hvor brugeren kan indtaste vasketiden  og en knap til at starte timeren
  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.label}>Indtast vasketid (minutter):</Text>
      <TextInput
        style={GlobalStyles.input}
        keyboardType="numeric"
        value={washTime}
        onChangeText={setWashTime}
        placeholder="Vasketid i minutter"
      />
      <Button title="Start Timer" onPress={startTimer} color={GlobalStyles.button.backgroundColor} />
    </View>
  );
};

export default Wash_timer;

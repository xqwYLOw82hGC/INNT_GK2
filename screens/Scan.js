//Impor
import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, Vibration, Text, StyleSheet, Dimensions } from 'react-native'; //Vibration bruges til at vibrere telefonen, når der scannes
import { Audio } from 'expo-av'; //Bruges til at afspille lyd når der scannes
import { TimerContext } from '../TimerContext'; //Bruges til at holde styr på tiden på timeren.
import GlobalStyles from '../GlobalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons'; //Bruges til at vise scan-icon på skærmen

const ScanScreen = ({ navigation }) => {
  const { remainingTime, setRemainingTime } = useContext(TimerContext);
  const [sound, setSound] = useState();

  //Bruger useEffect til at tælle ned på timeren, hvis der er en timer sat.
  useEffect(() => {
    let timer;

    //Hvis der er tid tilbage og tiden er større end 0, så tælles der ned hvert sekund - således opdateres tiden på timeren i realtid.
    if (remainingTime !== null && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1000) {
            clearInterval(timer);
            return 0; //Timer færdig
          }
          return prevTime - 1000; //Tæl ned hvert sekund
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [setRemainingTime]); //Brug setRemainingTime som afhængighed i stedet for remainingTime

  const handleVibrateAndPlaySound = async () => {
    Vibration.vibrate(300); //Telefonen vibrerer i 0.3 sek
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/sounds/confirmation.mp3') //Henter lyden fra assets
    );
    setSound(sound);
    await sound.playAsync();
  };

  //Bruges til at stoppe lyden
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); //Stopper lyden, så der ikke er lyd, der kører i baggrunden
        }
      : undefined;
  }, [sound]);

  //Funktion til at håndtere formatet tiden på timeren
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = ((time % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  //Returnerer en knap til at scanne og en knap til at navigere til timeren
  return (
    <View style={GlobalStyles.container}>
      <TouchableOpacity style={styles.circularButton} onPress={handleVibrateAndPlaySound}>
        <Ionicons name="wifi-outline" size={130} color="#FFFFFF" />
        <Text style={styles.buttonText}>Scan</Text>
      </TouchableOpacity>
      {remainingTime !== null && (<Text style={GlobalStyles.label}>Remaining Time: {formatTime(remainingTime)}</Text>)}
      <TouchableOpacity style={styles.timerButton} onPress={() => navigation.navigate('TimerScreen')}>
        <Ionicons name="timer-outline" size={24} color="#FFFFFF" />
        <Text style={styles.timerButtonText}>Timer</Text>
      </TouchableOpacity>
    </View>
  );
};

//Styling til knapperne - behøves ikke være globalt
const styles = StyleSheet.create({
  circularButton: {
    width: Dimensions.get('window').width * 0.75,
    height: Dimensions.get('window').width * 0.75,
    borderRadius: Dimensions.get('window').width * 0.375,
    backgroundColor: '#48A860',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: '30%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
    padding: 10,
    borderRadius: 8,
  },
  timerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default ScanScreen;

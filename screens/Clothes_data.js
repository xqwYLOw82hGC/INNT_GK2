//Henter nødvendige imports
import { StatusBar } from 'expo-status-bar';
import { View, Text, Button, Alert } from 'react-native';
import { useEffect, useState } from "react";
import { getDatabase, ref, remove } from "firebase/database";
import GlobalStyles from '../GlobalStyles';

//Laver en function Clothes_data, der tager route og navigation som argumenter
function Clothes_data({ route, navigation }) {
    const [aPieceOfClothes, setClothes] = useState({});

    //Benytter useEffect for at kunne hente data fra route.params
    useEffect(() => {
        //Henter data fra route.params og sætter det i vores state
        setClothes(route.params.aPieceOfClothes[1]);

        //Returnerer en function, der tømmer vores state
        return () => {
            setClothes({})
        }
    }, []);

    //Funktion til at håndtere redigering af tøj
    const handleEdit = () => {
        //Navigerer til EditClothes skærmen og sender data med detcenkelte stykke tøj med videre
        const aPieceOfClothes = route.params.aPieceOfClothes
        navigation.navigate('Edit Clothes', { aPieceOfClothes });
    };

    //Sikre at brugeren ønsker at slette det pågældende stykke tøj. Hvis ja, så slettes det
    const confirmDelete = () => {
        //Appen skal virker uanset om det er ios eller android
        Alert.alert('Are you sure?', 'Do you want to delete the clothes?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => handleDelete() },
        ]);
    };

    //Funktion der sletter det pågældende stykke tøj
    const handleDelete = async () => {
        const id = route.params.aPieceOfClothes[0];
        const db = getDatabase();

        //Reference til det pågældende stykke tøj
        const ClothesRef = ref(db, `Clothes/${id}`);

        //Sletter det pågældende stykke tøj efterfulgt af en alert, der informerer brugeren om at tøjet er slettet. Afventer derefter at brugeren trykker ok, hvorefter brugeren (bør) sendes tilbage til forrige skærm. 
        await remove(ClothesRef)
            .then(() => {
                navigation.goBack(); //Fejler når brugeren skal sendes tilbage til forrige skærm. Virker ikke.
            })
            .catch((error) => {
                Alert.alert(error.message);
            });
    };

    //Hvis der ikke er data, så vises teksten 'No data' på skærmen.
    if (!aPieceOfClothes) {
        return <Text>No data</Text>;
    }

    //Returnerer et 'view' med en knap til redigering og sletning af tøj. Derudover vises data om det pågældende stykke tøj.
    return (
        <View style={GlobalStyles.container}>
            <Button title="Edit" onPress={() => handleEdit()} color={GlobalStyles.button.backgroundColor} />
            <Button title="Delete" onPress={() => confirmDelete()} color={GlobalStyles.buttonDelete.backgroundColor} />
            {
                Object.entries(aPieceOfClothes).map((item, index) => {
                    return (
                        //Viser data om det pågældende stykke tøj
                        <View style={GlobalStyles.row} key={index}>
                            <Text style={GlobalStyles.label}>{item[0]} </Text>
                            <Text style={GlobalStyles.value}>{item[1]}</Text>
                        </View>
                    )
                })
            }
            <StatusBar style="auto" />
        </View>
    );
}

//Eksporterer Clothes_data så det kan bruges i app.js
export default Clothes_data;

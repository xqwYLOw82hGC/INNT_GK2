//Imports
import { View, Text, StyleSheet, TextInput, Button, Alert, ScrollView, SafeAreaView } from 'react-native';
import { useEffect, useState } from "react";
import { getDatabase, ref, push, update } from "firebase/database";
import GlobalStyles from '../GlobalStyles';

//Laver en function Registrer_clothes, til at registrere nyt tøj, eller redigere eksisterende tøj
function Registrer_clothes({ navigation, route }) {
    //Henter database med getDatabase som er en del af firebase metoderne.
    const db = getDatabase();

    const initialState = {
        brand: '',
        model: '',
        size: '',
        washCounter: '', //Her kunne den også sættes til 0 frem for en tom string, så brugeren ikke selv skal indtaste 0, hvis tøjet er nyt. Det vil dog betyde, at man ikke kan tilføje allerede vasket tøj så nemt.
        UUID: '',
        purchasingDPT: '',
    }

    //Bruger usestate til at oprette en state, der indeholder tøj
    const [newClothes, setNewClothes] = useState(initialState);

    const isAlterClothes = route.name === "Edit Clothes";

    //Bruger useEffect til at hente data fra route.params. Sættes herefter i state, så man kan redigere det pågældende stykke tøj.
    useEffect(() => {
        //Hvis man er i 'redigeringsmode', så hentes data fra route.params og sættes i state
        if (isAlterClothes) {
            const aPieceOfClothes = route.params.aPieceOfClothes[1];
            setNewClothes(aPieceOfClothes);
        }

        return () => {
            setNewClothes(initialState);
        };
    }, [isAlterClothes, route.params]);

    //Funktion til at ændre tekstinput løbende
    const changeTextInput = (name, event) => {
        setNewClothes({ ...newClothes, [name]: event });
    };

    //handleSave gemmer tøj i firebase databasen
    const handleSave = async () => {
        const { brand, model, size, washCounter, UUID, purchasingDPT } = newClothes;

        //Sørger for at væsentlige felter ikke er tomme
        if (brand.length === 0 || model.length === 0 || size.length === 0 || UUID.length === 0) {
            return Alert.alert('Brand, Model, Size and UUID are required');
        }

        if (isAlterClothes) {
            const id = route.params.aPieceOfClothes[0];
            //Definerer vejen til noden (Clothes) i firebase, hvor data skal opdateres
            const ClothesRef = ref(db, `Clothes/${id}`);

            //Angiver hvilke felter, der skal opdateres i firebase databasen, når brugeren trykker på 'Save changes'
            const updatedFields = {
                brand,
                model,
                size,
                washCounter,
                UUID,
                purchasingDPT,
            };

            //Opdaterer data i firebase og viser en alert til brugeren, når data er opdateret. Afventer derefter at brugeren trykker ok, hvorefter brugeren (bør) sendes tilbage til forrige skærm.
            await update(ClothesRef, updatedFields)
                .then(() => {
                    Alert.alert("Information updated successfully");
                    navigation.goBack();
                })
                .catch((error) => {
                    console.error(`Error: ${error.message}`);
                });
        } else {
            const ClothesRef = ref(db, "/Clothes/");

            //Angiver hvilke felter, der skal opdateres i firebase databasen, når brugeren trykker på 'Add Clothes'
            const newClothesData = {
                brand,
                model,
                size,
                washCounter,
                UUID,
                purchasingDPT,
            };

            //Gemmer data i firebase og viser en alert (saved) til brugeren, når data er gemt.
            await push(ClothesRef, newClothesData)
                .then(() => {
                    Alert.alert("Clothes added successfully");
                    setNewClothes(initialState);
                })
                .catch((error) => {
                    console.error(`Error: ${error.message}`);
                });
        }
    };

    //Returnerer en view med tekstinput felter, hvor brugeren kan indtaste data om tøj. Derudover vises en knap, der gemmer data i firebase.
    return (
        <SafeAreaView style={GlobalStyles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <Text style={styles.header}>{isAlterClothes ? "Edit Clothes" : "Register New Clothes"}</Text>
                {
                    newClothes && Object.keys(initialState).map((key, index) => {
                        return (
                            <View style={styles.inputContainer} key={index}>
                                <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                                <TextInput
                                    value={newClothes[key] || ''} //Hvis der ikke er data i newClothes, vises en tom string
                                    onChangeText={(event) => changeTextInput(key, event)}
                                    style={[GlobalStyles.input, styles.fullWidthInput]}
                                    placeholder={`Enter ${key}`}
                                    placeholderTextColor="#95A5A6"
                                />
                            </View>
                        );
                    })
                }
                <Button title={isAlterClothes ? "Save Changes" : "Add Clothes"} onPress={handleSave} color={GlobalStyles.button.backgroundColor} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        paddingVertical: 20,
        paddingHorizontal: 1,
        width: 300,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 40,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#34495E',
        marginBottom: 1,
    },
    fullWidthInput: {
        width: '100%',
    },
});

//Eksporterer Registrer_clothes så det kan bruges i app.js
export default Registrer_clothes;

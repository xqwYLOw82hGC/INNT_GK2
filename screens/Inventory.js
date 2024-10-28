//Henter imports
import { View, Text, FlatList, TouchableOpacity, Button } from 'react-native';
import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, off } from "firebase/database";
import * as MailComposer from 'expo-mail-composer';
import GlobalStyles from '../GlobalStyles';

//Laver en function Inventory, der tager navigation som argument, så vi kan navigere rundt i appen, når vi skal sende email, eller se data om tøj, der skal udskiftes, fordi det er blevet vasket for mange gange, og derfor er slidt.
function Inventory({ navigation }) {
    //Bruger useState til at oprette states, der indeholder tøj, tøj der skal sendes i email, email body og email modtager
    const [clothes, setClothes] = useState();
    const [clothesToEmail, setClothesToEmail] = useState([]);  // List of clothes to be sent in email
    const [emailBody, setEmailBody] = useState('');             // Email body text
    const [emailRecipient, setEmailRecipient] = useState('');   // Email recipient

    //Bruger useEffect til at hente data fra firebase, og filtrere tøj, der har washCounter > 44. Derefter bygges email body ud fra tøjet, og email modtager findes.
    useEffect(() => {
        const db = getDatabase();
        const clothesRef = ref(db, "Clothes");

        //Henter data fra firebase og sætter det i vores state
        onValue(clothesRef, (snapshot) => {
            //snapshot.val() indeholder data fra firebase
            const data = snapshot.val();

            if (data) {
                setClothes(data);

                //Filtrerer tøj med washCounter > 44
                const filteredClothes = Object.values(data).filter(item => item.washCounter > 44);

                //Sætter tøj i usestate, der skal sendes i email
                setClothesToEmail(filteredClothes);

                //Bygger email body (teksen i emailen), baseret på tøjet med for mange vaske
                const bodyText = filteredClothes.map(item => 
                    `Brand: ${item.brand}
                    Model: ${item.model}
                    Size: ${item.size}
                    UUID: ${item.UUID}
                    Wash Counter: ${item.washCounter}`
                ).join('\n\n');

                setEmailBody(bodyText);

                //Filtrerer eksisterende e-mails og vælg den første gyldige email.  Her skal det bemærkes at der ingen validering er af email, så det er muligt at sende til en ugyldig email eller om der er flere forskellige emails. Den vælger blot den første gyldige email.
                const validEmail = filteredClothes
                    .map(item => item.purchasingDPT)
                    .find(email => email && email.length > 0);

                setEmailRecipient(validEmail || ''); //Hvis ingen gyldige e-mails findes, så sættes emailRecipient til en tom string.
            }
        });

        return () => {
            off(clothesRef);
        };
    }, []);

    //Hvis der ikke er nogen tøj-data, så vises teksten på skærmen.
    if (!clothes) {
        return <Text>Loading... Findes der tøj i DB?</Text>;
    }

    //Funktion til at håndtere valg af tøj, og navigation til Clothes Data skærmen, hvor data om det pågældende stykke tøj vises.
    const handleSelectClothes = id => {
        const aPieceOfClothes = Object.entries(clothes).find(aPieceOfClothes => aPieceOfClothes[0] === id);
        navigation.navigate('Clothes Data', { aPieceOfClothes });
    };

    //Funktion til at kreere og sende en email, hvis der er tøj, der skal sendes i email
    const handleSendEmail = async () => {
        if (clothesToEmail.length > 0) {
            await MailComposer.composeAsync({
                subject: 'Clothes that need replacement',
                body: emailBody,
                recipients: emailRecipient,
            });
        }
    };

    //Laver et array af tøj, og et array af tøj keys
    const clothesArray = Object.values(clothes);
    const clothesKeys = Object.keys(clothes);

    //Returnerer en flatlist med tøj. Hvis det har washCounter > 44 markeres antal vaske med rød. Ellers sort. Under vises en knap, der sender email, hvis der er tøj, der skal sendes i email.
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={clothesArray}
                keyExtractor={(item, index) => clothesKeys[index]}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity style={GlobalStyles.listItemContainer} onPress={() => handleSelectClothes(clothesKeys[index])}>
                            <View style={GlobalStyles.listItemText}>
                                <Text>
                                    {item.brand} {item.model}
                                </Text>
                                <Text style={{ color: item.washCounter > 44 ? 'red' : 'black' }}>
                                    {item.washCounter}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />

            {/* Vis kun knappen til at sende førnævnte email, hvis der er tøj med washCounter > 44 */}
            {clothesToEmail.length > 0 && (
                <Button title="Send Email" onPress={handleSendEmail} color={GlobalStyles.button.backgroundColor} />
            )}
        </View>
    );
}

//Eksporterer Inventory så det kan bruges i app.js
export default Inventory;

//Imports
import { useEffect, useState } from 'react';
import * as MailComposer from 'expo-mail-composer'; //Husk at installere expo-mail-composer med npm install expo-mail-composer

//Funktion der bruger MailComposer til at sende en email. Funktion kaldet i filen Inventory.js.
export default function Email() {
  const [isAvailable, setIsAvailable] = useState(false);

  //Bruger useEffect til at tjekke om MailComposer er tilgængelig. Da MailComposer er en del af expo, så er det ikke sikkert, at det er tilgængeligt på alle enheder.
  //Hvis mailcomposer er tilgængelig, så tjek om du er logget ind på din defaut email-app, og om du har internetforbindelse.
  useEffect(() => {
    async function checkAvailability() {
      const isMailAvailable = await MailComposer.isAvailableAsync();
      setIsAvailable(isMailAvailable);
    }

    checkAvailability();
  }, []);

};

//Ingen styling, da det er en funktion, der ikke vises på skærmen.

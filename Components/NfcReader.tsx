import {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import NfcManager, {NfcEvents, NfcTech} from 'react-native-nfc-manager';

export default function NfcReader(): JSX.Element {
  const [nfc, setNfc] = useState<Boolean>(false);

  // checks if the device supports NFC
  useEffect(() => {
    const checkSupported = async () => {
      const deviceSupported = await NfcManager.isSupported();

      setNfc(deviceSupported);
      if (deviceSupported) {
        await NfcManager.start();
      }
    };

    checkSupported();
  }, []);

  // read the nfc tag

  async function readNdef() {
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      console.warn('Tag found', tag);
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  }

  if (nfc === null) return <></>;

  if (!nfc) {
    return (
      <View>
        <Text>NFC not supported</Text>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <Text>Scan the NFC Sticker Please</Text>
      <TouchableOpacity onPress={readNdef}>
        <Text>Scan Tag</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

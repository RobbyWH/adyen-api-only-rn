import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';

import Modal from 'react-native-modal';

const SERVER_URL = 'http://192.168.8.102:8089';
const molpayType = 'molpay_ebanking_TH';

const getPaymentMethods = async () => {
  const response = await fetch(`${SERVER_URL}/api/getPaymentMethods`, {
    method: 'POST',
  });
  const responseJson = await response.json();
  return responseJson;
};

const initiatePayment = async data => {
  const response = await fetch(`${SERVER_URL}/api/initiatePayment`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const responseJson = await response.json();
  return responseJson;
};

const ModalIssuer = ({data, isVisible, onClose}) => {
  const handlePayment = async issuer => {
    const response = await initiatePayment({
      paymentMethod: {
        type: molpayType,
        issuer,
      },
    });
    if (
      response?.resultCode === 'RedirectShopper' &&
      response?.action?.type === 'redirect'
    ) {
      Linking.openURL(response?.action?.url);
    }
    onClose();
    console.log('PAYMENT', response);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        handlePayment(item.id);
      }}
      style={{padding: 10, borderWidth: 1}}>
      <Image
        resizeMode="contain"
        style={{height: 50, width: 50}}
        source={{
          uri: `https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/small/${item.id}.png`,
        }}
      />
      <Text>id : {item.id}</Text>
      <Text>name : {item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <Modal isVisible={isVisible}>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <FlatList
            keyExtractor={item => item.id}
            data={data}
            renderItem={renderItem}
          />
          <TouchableOpacity onPress={onClose}>
            <Text>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const Payment = () => {
  const [paymentMethods, setPaymentMethods] = React.useState([]);
  const [dataSelect, setDataSelect] = React.useState([]);
  const [isVisibleIssuer, setIsVisibleIssuer] = React.useState(false);

  React.useEffect(() => {
    Linking.getInitialURL().then(url => {
      const event = {url};
      console.log('URL', url);
    });

    Linking.addEventListener('url', event => {
      const url = event?.url;
      console.log('URL', url);
    });

    const getDataPaymentMethods = async () => {
      const dataPaymentMethods = await getPaymentMethods();
      console.log('PAYMENT METHODS', dataPaymentMethods);
      setPaymentMethods(dataPaymentMethods?.paymentMethods || []);
    };
    getDataPaymentMethods();

    return () => {
      Linking.removeEventListener('url', event => {
        const url = event?.url;
        console.log('URL', url);
      });
    };
  }, []);

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        if (item.type === molpayType) {
          setIsVisibleIssuer(true);
          item.details.map(detail => {
            if (detail.type === 'select') {
              setDataSelect(detail.items);
            }
          });
        } else {
          alert(JSON.stringify(item));
        }
      }}
      style={{padding: 10, borderWidth: 1}}>
      <Text>Name : {item.name}</Text>
      <Text>Type : {item.type}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <FlatList
          data={paymentMethods}
          keyExtractor={item => item.type}
          renderItem={renderItem}
        />
      </ScrollView>
      <ModalIssuer
        onClose={() => setIsVisibleIssuer(false)}
        isVisible={isVisibleIssuer}
        data={dataSelect}
      />
    </SafeAreaView>
  );
};

export default Payment;

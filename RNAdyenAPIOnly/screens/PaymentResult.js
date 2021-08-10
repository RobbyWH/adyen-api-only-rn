import * as React from 'react';
import {Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

const SERVER_URL = 'http://192.168.8.102:8089';

const submitAdditionalDetails = async data => {
  const response = await fetch(`${SERVER_URL}/api/submitAdditionalDetails`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const responseJson = await response.json();
  return responseJson;
};

const PaymentResult = () => {
  const [result, setResult] = React.useState('');
  const route = useRoute();
  const {redirectResult} = route?.params || {};

  React.useEffect(() => {
    const submitMethod = async () => {
      if (redirectResult) {
        const data = {
          details: {
            redirectResult,
          },
        };
        const submit = await submitAdditionalDetails(data);
        setResult(submit?.resultCode);
        console.log('SUBMIT', submit);
      }
    };
    submitMethod();
  }, [redirectResult]);

  return (
    <View style={{padding: 20}}>
      <Text style={{textAlign: 'center', fontSize: 40, fontWeight: 'bold'}}>
        {result}
      </Text>
    </View>
  );
};

export default PaymentResult;

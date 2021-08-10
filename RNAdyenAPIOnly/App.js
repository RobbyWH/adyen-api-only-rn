import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Payment from './screens/Payment';
import PaymentResult from './screens/PaymentResult';

const Stack = createStackNavigator();

export const deeplinkConfig = {
  screens: {
    initialRouteName: 'Payment',
    Payment: 'payment',
    PaymentResult: 'paymentresult',
  },
};

export const linking = {
  prefixes: ['testadyen://'],
  config: deeplinkConfig,
};

function App() {
  return (
    <NavigationContainer linking={linking} initialRouteName="Payment">
      <Stack.Navigator>
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="PaymentResult" component={PaymentResult} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

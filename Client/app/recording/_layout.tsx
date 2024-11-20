import React from 'react';
import { View, Text } from 'react-native';
import RecordingsSection from './index';

const Layout: React.FC = () => {
  return (
    <View>
      <Text className="text-center font-bold text-2xl mt-4">Recording Section</Text>
      <RecordingsSection />
    </View>
  );
};

export default Layout;

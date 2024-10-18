// import { View, Text } from 'react-native';
import { Redirect, Stack } from "expo-router";
import React from "react";
// import Loader from '@/components/Loader';

const AuthLayout = () => {
    return (
        <>
          <Stack>
            <Stack.Screen
              name="sign-in"options={{headerShown: false,}}
            />
            <Stack.Screen
              name="sign-up" options={{headerShown: false}}
            />
          </Stack>
    
          {/* <Loader isLoading={loading} />
          <StatusBar backgroundColor="#161622" style="light" /> */}
        </>
      );
    };


export default AuthLayout 
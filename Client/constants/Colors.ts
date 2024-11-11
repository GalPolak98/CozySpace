/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    surface: '#F5F5F5',    
    header: '#F0F0F0',    
    bottomBar: '#F0F0F0',   
    border: '#E0E0E0',     
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    surface: '#1E1E1E',
    header: '#1A1A1A',  
    bottomBar: '#1A1A1A',   
    border: '#2C2C2C',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

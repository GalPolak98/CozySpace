import React, { useState } from 'react';
import { TouchableOpacity, Modal, Pressable, View, ActivityIndicator } from 'react-native';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from 'react-i18next';
import ThemedText from '@/components/ThemedText';
import ThemedView from '@/components/ThemedView';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/styles/Theme';
import { Ionicons } from '@expo/vector-icons';
import { availableLanguages } from '@/constants/translations';

const LanguageToggle = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { currentLanguage, changeLanguage, t } = useLanguage();
//   const { t } = useTranslation();
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  const handleLanguageSelect = async (langCode: string) => {
    setIsModalVisible(false);
    await changeLanguage(langCode);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        className="px-3 py-2 flex-row items-center"
      >
        <ThemedText variant="primary" className="text-base font-psemibold mr-1">
          {currentLanguage === 'en' ? 'EN' : 'HE'}
        </ThemedText>
        <Ionicons 
          name="chevron-down" 
          size={16} 
          color={colors.primary}
        />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-end">
          <Pressable 
            className="flex-1 bg-black/30"
            onPress={() => setIsModalVisible(false)}
          />
          <ThemedView variant="surface" className="rounded-t-3xl">
            <View className="items-center py-4 border-b border-gray-200 dark:border-gray-700">
              <View className="w-12 h-1 rounded-full bg-gray-300 dark:bg-gray-600 mb-2" />
              <ThemedText variant="primary" className="text-xl font-pbold">
                {t.common.language}
              </ThemedText>
            </View>
            
            <View className="p-4">
              {availableLanguages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  onPress={() => handleLanguageSelect(lang.code)}
                  
                  style={{
                    backgroundColor: lang.code === currentLanguage 
                      ? `${colors.primary}20` // 20 is the hex opacity (12.5%)
                      : currentTheme === 'light' ? '#F9FAFB' : '#1F2937'
                  }}
                  className="flex-row items-center justify-between p-4 mb-2 rounded-xl"
                >
                  <View>
                    <ThemedText 
                      variant="primary" 
                      className={`text-lg font-pbold mb-1 ${
                        lang.code === currentLanguage ? 'text-primary' : ''
                      }`}
                    >
                      {lang.nativeLabel}
                    </ThemedText>
                    <ThemedText 
                      variant="secondary" 
                      className="text-sm font-pregular"
                    >
                      {lang.label}
                    </ThemedText>
                  </View>
                  {lang.code === currentLanguage && (
                    <Ionicons 
                      name="checkmark-circle" 
                      size={24} 
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={{
                backgroundColor: currentTheme === 'light' ? '#F3F4F6' : '#1F2937'
              }}
              className="mx-4 mb-4 p-4 rounded-xl items-center"
            >
              <ThemedText variant="primary" className="text-base font-psemibold">
                {t.common.cancel}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </View>
      </Modal>
    </>
  );
};

export default LanguageToggle;
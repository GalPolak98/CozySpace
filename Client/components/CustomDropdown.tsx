import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Animated, Modal, SafeAreaView } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/styles/Theme';
import { Ionicons } from '@expo/vector-icons';
import { CustomDropdownProps, OptionType } from '@/types/onboarding';

interface ExtendedCustomDropdownProps extends CustomDropdownProps {
  isRTL?: boolean;
}

export const CustomDropdown: React.FC<ExtendedCustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  isRTL = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  const selectedOption = options.find(opt => opt.id === value);

  return (
    <View className="mb-4">
      {label && (
        <Text 
          style={{ 
            color: colors.text,
            textAlign: isRTL ? 'right' : 'left'
          }} 
          className="font-pmedium mb-2"
        >
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="p-4 border rounded-lg"
        style={{ 
          borderColor: colors.border,
          backgroundColor: colors.surface,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Text 
          style={{ 
            color: selectedOption ? colors.text : colors.textSecondary,
            textAlign: isRTL ? 'right' : 'left'
          }}
          className="font-pregular"
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons 
          name={isRTL ? "chevron-down" : "chevron-down"} 
          size={20} 
          color={colors.text}
          style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity 
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <SafeAreaView className="flex-1 justify-end">
            <View 
              className="bg-white rounded-t-xl max-h-[70%]"
              style={{ backgroundColor: colors.background }}
            >
              <View 
                className="p-4 border-b" 
                style={{ 
                  borderColor: colors.border,
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Text 
                  style={{ 
                    color: colors.text,
                    textAlign: isRTL ? 'right' : 'left'
                  }} 
                  className="text-lg font-pbold"
                >
                  {label}
                </Text>
                <TouchableOpacity onPress={() => setIsOpen(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={options}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      onChange(item.id);
                      setIsOpen(false);
                    }}
                    className="p-4 border-b"
                    style={{ borderColor: colors.border }}
                  >
                    <View 
                      style={{ 
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                        <Text 
                          style={{ 
                            color: colors.text,
                            textAlign: isRTL ? 'right' : 'left'
                          }} 
                          className="font-pmedium"
                        >
                          {item.label}
                        </Text>
                        {item.sublabel && (
                          <Text 
                            style={{ 
                              color: colors.textSecondary,
                              textAlign: isRTL ? 'right' : 'left'
                            }} 
                            className="font-pregular text-sm mt-1"
                          >
                            {item.sublabel}
                          </Text>
                        )}
                      </View>
                      {value === item.id && (
                        <Ionicons 
                          name="checkmark-circle" 
                          size={24} 
                          color={colors.primary}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              />
              <View style={{ paddingBottom: 20 }} />
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
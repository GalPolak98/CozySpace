import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Animated, Modal, SafeAreaView } from 'react-native';
import { useTheme } from '@/components/ThemeContext';
import { theme } from '@/Styles/Theme';
import { Ionicons } from '@expo/vector-icons';
import { CustomDropdownProps, OptionType } from '@/types/onboarding';

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme: currentTheme } = useTheme();
  const colors = theme[currentTheme];

  const selectedOption = options.find(opt => opt.id === value);

  return (
    <View className="mb-4">
      {label && (
        <Text style={{ color: colors.text }} className="font-pmedium mb-2">
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="flex-row items-center justify-between p-4 border rounded-lg"
        style={{ 
          borderColor: colors.border,
          backgroundColor: colors.surface
        }}
      >
        <Text 
          style={{ color: selectedOption ? colors.text : colors.textSecondary }}
          className="font-pregular"
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.text} />
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
              <View className="p-4 border-b flex-row justify-between items-center" 
                style={{ borderColor: colors.border }}
              >
                <Text style={{ color: colors.text }} className="text-lg font-pbold">
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
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text style={{ color: colors.text }} className="font-pmedium">
                          {item.label}
                        </Text>
                        {item.sublabel && (
                          <Text style={{ color: colors.textSecondary }} className="font-pregular text-sm mt-1">
                            {item.sublabel}
                          </Text>
                        )}
                      </View>
                      {value === item.id && (
                        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              />
              {/* Adding padding at the bottom */}
              <View style={{ paddingBottom: 20 }} />
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

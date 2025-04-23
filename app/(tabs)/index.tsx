import React, { useState } from 'react';
import { StyleSheet, TextInput, FlatList, SafeAreaView } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');
  const ITEM_DATA: string[] = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
  const [filteredData, setFilteredData] = useState(ITEM_DATA);
  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text) {
      const newData = ITEM_DATA.filter(item => {
        const itemData = item.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.includes(textData);
      });
      setFilteredData(newData);
    } else {
      setFilteredData(ITEM_DATA);
    }
  };

  const renderItem = ({ item }: { item: string }) => (
    <ThemedView style={styles.itemContainer}>
      <ThemedText style={styles.itemText}>{item}</ThemedText>
    </ThemedView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.searchContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Search items..."
          value={searchText}
          onChangeText={handleSearch}
          placeholderTextColor="#888"
        />
      </ThemedView>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f8f8f8',
  },
  textInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 56,
  },
});

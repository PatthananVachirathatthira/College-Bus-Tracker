import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Searchbar, Card } from 'react-native-paper';

// Assuming you have the bus data in the following format:
import buses from '../data/bus.json'

const BusList = ({ route }) => {
  const { selectedLocation } = route.params;
  const [searchQuery, setSearchQuery] = useState('');

  // Filter buses with the same startPoint, endPoint, and routes as the selected location
  const filteredBuses = buses.filter(
    (bus) =>
      bus.startPoint === selectedLocation ||
      bus.endPoint === selectedLocation ||
      bus.routes.includes(selectedLocation)
  );

  // Filter buses based on search query
  const searchedBuses = filteredBuses.filter(
    (bus) =>
      bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.startPoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.endPoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.routes.some((route) =>
        route.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus List for {selectedLocation}</Text>
      <Searchbar
        placeholder="Search bus number or location"
        onChangeText={(handleSearch)}
        value={searchQuery}
        style={styles.searchBar}
      />
      <ScrollView>
        {searchedBuses.length > 0 ? (
          searchedBuses.map((bus) => (
            <Card key={bus.busNumber} style={styles.busItem}>
              <Card.Title title={bus.busNumber} />
              <Card.Content>
                <Text>Start Point: {bus.startPoint}</Text>
                <Text>End Point: {bus.endPoint}</Text>
                <Text>Routes: {bus.routes.join(', ')}</Text>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Text>No buses found for {selectedLocation}</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  busItem: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
  },
});

export default BusList;

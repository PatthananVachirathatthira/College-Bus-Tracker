import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Searchbar, Card } from 'react-native-paper';
import axios from 'axios';

const BusList = ({ navigation, route }) => {
  const { selectedLocation } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from Firebase Realtime Database
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.FIREBASE_DB_URL
        );
        setBuses(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter buses with the same startPoint, endPoint, and routes as the selected location
  const filteredBuses = buses.filter(
    (bus) =>
      bus['Bus Route'].includes(selectedLocation)
  );

  // Filter buses based on bus number and location queries
  const searchedBuses = filteredBuses.filter((bus) =>
    bus['BusNo'].toString().includes(searchQuery) ||
    bus['Bus Route'].some((route) => route.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCardClick = (routes) => {
    // Handle the navigation to RouteMap with the selected routes
    navigation.navigate('RouteMap', { routes });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus List for {selectedLocation}</Text>
      <Searchbar
        placeholder="Search bus number or location"
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      <ScrollView>
        {searchedBuses.length > 0 ? (
          searchedBuses.map((bus) => (
            <TouchableOpacity
              key={bus['BusNo']}
              onPress={() => handleCardClick(bus['Bus Route'])}
            >
              <Card style={styles.busItem}>
                <Card.Title title={`Bus ${bus['BusNo']}`} />
                <Card.Content>
                  <Text>Routes: {bus['Bus Route'].join(', ')}</Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
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

import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Menu } from 'react-native-paper';

const locations = [
  "Tambaram",
  "Nanganallur",
  "Tillaiganga Nagar",
  "St Mount",
  "Guindy",
  "Ekkaduthangal",
  "Kotturpuram",
  "Perumbakkam",
  "Chrompet",
  "Mogappair"
];

const SetHome = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setIsMenuVisible(false);

    // Redirect to BusList screen with the selected location
    navigation.navigate('BusList', { selectedLocation: location });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set your home location</Text>
      <Menu style={styles.menu}
        visible={isMenuVisible}
        onDismiss={() => setIsMenuVisible(false)}
        anchor={
          <Text style={styles.locationText} onPress={() => setIsMenuVisible(true)}>
            {selectedLocation ? selectedLocation : "Select location"}
          </Text>
        }
      >
        {locations.map((location, index) => (
          <Menu.Item
            key={index}
            title={location}
            onPress={() => handleLocationSelect(location)}
          />
        ))}
      </Menu>
      {selectedLocation ? (
        <Text style={styles.selectedLocation}>Selected location: {selectedLocation}</Text>
      ) : null}
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
  menu: {
    width: '80%',
    marginLeft: '5%',
  },
  locationText: {
    marginBottom: 16,
    fontSize: 16,
    borderRadius: 8,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  selectedLocation: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default SetHome;

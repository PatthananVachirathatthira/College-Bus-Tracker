import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Linking, ScrollView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { FAB, List, Divider } from 'react-native-paper';
import axios from 'axios';

const RouteMap = ({ route }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch coordinates for each route from the given address
    const fetchRouteCoordinates = async (routes) => {
      try {
        const allRoutes = [];
        for (const address of routes) {
          const response = await axios.get(`https://geocode.maps.co/search?q=${address} chennai`);
          const data = response.data;
          const lat = parseFloat(data[0]?.lat);
          const lon = parseFloat(data[0]?.lon);

          if (!isNaN(lat) && !isNaN(lon)) {
            allRoutes.push({ latitude: lat, longitude: lon, address }); // Include the address in the route object
          } else {
            console.log('Invalid latitude or longitude:', data[0]?.lat, data[0]?.lon);
          }
        }

        setRoutes(allRoutes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching route coordinates:', error);
        setLoading(false);
      }
    };

    // Call the fetch function with a delay of 3 seconds
    const delay = 3000; // 3 seconds
    const timer = setTimeout(() => fetchRouteCoordinates(route.params.routes), delay); // Access the routes array from route.params

    // Clear the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [route.params.routes]); // Make sure to include route.params.routes in the dependency array

  const openInGoogleMaps = () => {
    const routeUrl = routes
      .map((coordinate) => `${coordinate.latitude},${coordinate.longitude}`)
      .join('/');
    Linking.openURL(`https://www.google.com/maps/dir/${routeUrl}`);
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
      {/* Top half with MapView */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: routes.length > 0 ? routes[0].latitude : 0,
            longitude: routes.length > 0 ? routes[0].longitude : 0,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {routes.map((coordinate, index) => (
            <Marker key={index} coordinate={coordinate} title={`Route ${index + 1}`} />
          ))}
          {routes.length > 1 && (
            <Polyline coordinates={routes} strokeColor="#000" strokeWidth={2} />
          )}
        </MapView>
      </View>

      {/* Bottom half with routes list */}
      <View style={styles.routesContainer}>
        <ScrollView>
          <List.Section>
            <List.Subheader>Routes</List.Subheader>
            {routes.map((route, index) => ( // Change the variable name to route
              <View key={index}>
                <List.Item
                  title={`Stop ${index + 1}`}
                  description={route.address} // Display the address here
                  left={(props) => <List.Icon {...props} icon="map-marker" />}
                />
                <Divider />
              </View>
            ))}
          </List.Section>
        </ScrollView>
      </View>

      {/* Floating button */}
      <FAB
        style={styles.fab}
        icon="map"
        onPress={openInGoogleMaps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  routesContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: 'gray',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    overflow: 'hidden',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default RouteMap;

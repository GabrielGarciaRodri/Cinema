import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';

const { width } = Dimensions.get('window');

const MOCK_SHOWTIMES = [
  { id: '1', time: '14:30', date: '2024-03-28' },
  { id: '2', time: '17:00', date: '2024-03-28' },
  { id: '3', time: '19:30', date: '2024-03-28' },
  { id: '4', time: '22:00', date: '2024-03-28' },
];

const MovieDetailScreen = ({ route, navigation }) => {
  const { movie } = route.params;
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  const handleSelectShowtime = (showtime) => {
    setSelectedShowtime(showtime);
  };

  const handleBookTickets = () => {
    if (!selectedShowtime) {
      Alert.alert('Error', 'Por favor selecciona un horario');
      return;
    }
    navigation.navigate('SeatSelection', {
      movie: movie,
      showtime: selectedShowtime
    });
  };

  return (
    <ScrollView style={styles.container} bounces={false}>
      <Image
        source={{ uri: movie.posterUrl }}
        style={styles.poster}
        resizeMode="cover"
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{movie.title}</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detail}>⭐ {movie.rating}</Text>
          <Text style={styles.detail}>⏱️ {movie.duration} min</Text>
          <Text style={styles.detail}>🎭 {movie.genre}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sinopsis</Text>
          <Text style={styles.synopsis}>
            {movie.synopsis || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horarios Disponibles</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.showtimesContainer}
          >
            {MOCK_SHOWTIMES.map((showtime) => (
              <TouchableOpacity
                key={showtime.id}
                style={[
                  styles.showtimeCard,
                  selectedShowtime?.id === showtime.id && styles.selectedShowtime,
                ]}
                onPress={() => handleSelectShowtime(showtime)}
              >
                <Text 
                  style={[
                    styles.showtimeText,
                    selectedShowtime?.id === showtime.id && styles.selectedShowtimeText,
                  ]}
                >
                  {showtime.time}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookTickets}
        >
          <Text style={styles.bookButtonText}>Reservar Tickets</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  poster: {
    width: width,
    height: width * 1.5,
  },
  infoContainer: {
    padding: 20,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#1a1a1a',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  detail: {
    color: '#999',
    marginRight: 20,
    fontSize: 14,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  synopsis: {
    color: '#999',
    lineHeight: 20,
  },
  showtimesContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  showtimeCard: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedShowtime: {
    borderColor: '#e31837',
    backgroundColor: '#e31837',
  },
  showtimeText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedShowtimeText: {
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#e31837',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  bookButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MovieDetailScreen;
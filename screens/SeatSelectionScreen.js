import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const SEATS_PER_ROW = 8;
const SEAT_PRICE = 12.99;

const OCCUPIED_SEATS = ['A3', 'A4', 'C5', 'D7', 'F2', 'G3'];

const SeatSelectionScreen = ({ route, navigation }) => {
  const { movie, showtime } = route.params;
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatPress = useCallback((seatId) => {
    if (OCCUPIED_SEATS.includes(seatId)) {
      Alert.alert('Asiento no disponible', 'Este asiento ya está ocupado');
      return;
    }

    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(seat => seat !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  }, []);

  const getSeatStatus = useCallback((seatId) => {
    if (OCCUPIED_SEATS.includes(seatId)) return 'occupied';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  }, [selectedSeats]);

  const handleConfirmSelection = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('Error', 'Por favor selecciona al menos un asiento');
      return;
    }

    navigation.navigate('OrderSummary', {
      movie,
      showtime,
      selectedSeats,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.showtime}>
        Función: {showtime.date} - {showtime.time}
      </Text>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.seatAvailable]} />
          <Text style={styles.legendText}>Disponible</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.seatSelected]} />
          <Text style={styles.legendText}>Seleccionado</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, styles.seatOccupied]} />
          <Text style={styles.legendText}>Ocupado</Text>
        </View>
      </View>

      <View style={styles.screenContainer}>
        <View style={styles.screen} />
        <Text style={styles.screenText}>PANTALLA</Text>
      </View>

      <ScrollView contentContainerStyle={styles.seatsContainer}>
        {ROWS.map(row => (
          <View key={row} style={styles.row}>
            <Text style={styles.rowLabel}>{row}</Text>
            {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
              const seatId = `${row}${i + 1}`;
              const status = getSeatStatus(seatId);
              return (
                <TouchableOpacity
                  key={seatId}
                  style={[
                    styles.seat,
                    status === 'occupied' && styles.seatOccupied,
                    status === 'selected' && styles.seatSelected,
                  ]}
                  onPress={() => handleSeatPress(seatId)}
                >
                  <Text style={styles.seatText}>{i + 1}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>

      {selectedSeats.length > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>
              {selectedSeats.length} asiento(s) x ${SEAT_PRICE}
            </Text>
            <Text style={styles.summaryText}>
              ${(selectedSeats.length * SEAT_PRICE).toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmSelection}
          >
            <Text style={styles.confirmButtonText}>
              Confirmar Selección
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingTop: 20,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  showtime: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendSeat: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 5,
  },
  legendText: {
    color: '#999',
    fontSize: 12,
  },
  screenContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  screen: {
    width: '80%',
    height: 5,
    backgroundColor: '#666',
    borderRadius: 5,
    marginBottom: 5,
  },
  screenText: {
    color: '#666',
    fontSize: 12,
  },
  seatsContainer: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowLabel: {
    color: '#999',
    fontSize: 14,
    width: 20,
    textAlign: 'center',
    marginRight: 10,
  },
  seat: {
    width: 30,
    height: 30,
    margin: 3,
    borderRadius: 4,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatText: {
    color: '#fff',
    fontSize: 12,
  },
  seatAvailable: {
    backgroundColor: '#333',
  },
  seatSelected: {
    backgroundColor: '#e31837',
  },
  seatOccupied: {
    backgroundColor: '#666',
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  summaryText: {
    color: '#fff',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#e31837',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SeatSelectionScreen;
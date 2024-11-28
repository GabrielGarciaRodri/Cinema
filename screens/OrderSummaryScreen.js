import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

const OrderSummaryScreen = ({ route, navigation }) => {
  const { movie, showtime, selectedSeats } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const SEAT_PRICE = 12.99;
  const totalAmount = selectedSeats.length * SEAT_PRICE;
  const serviceCharge = 1.99;
  const finalTotal = totalAmount + serviceCharge;

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // Aquí iría la integración con el sistema de pagos
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      Alert.alert(
        '¡Pago exitoso!',
        'Tu reserva ha sido confirmada',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo procesar el pago');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Cabecera con información de la película */}
        <View style={styles.movieInfoContainer}>
          <Image
            source={{ uri: movie.posterUrl }}
            style={styles.movieImage}
            resizeMode="cover"
          />
          <View style={styles.movieDetails}>
            <Text style={styles.movieTitle}>{movie.title}</Text>
            <Text style={styles.showtime}>
              {showtime.date} - {showtime.time}
            </Text>
            <Text style={styles.location}>
              MARTONG MALL
            </Text>
          </View>
        </View>

        {/* Detalles de la orden */}
        <View style={styles.orderDetails}>
          <Text style={styles.sectionTitle}>Resumen del pedido</Text>
          <Text style={styles.orderNumber}>ORDER NUMBER: {Math.random().toString(36).substring(7).toUpperCase()}</Text>
          
          <View style={styles.ticketDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>
                {selectedSeats.length} TICKET{selectedSeats.length > 1 ? 'S' : ''}
              </Text>
              <Text style={styles.detailText}>
                ${(selectedSeats.length * SEAT_PRICE).toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>ASIENTOS</Text>
              <Text style={styles.detailText}>
                {selectedSeats.join(', ')}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailText}>CARGO POR SERVICIO</Text>
              <Text style={styles.detailText}>${serviceCharge.toFixed(2)}</Text>
            </View>

            <View style={[styles.detailRow, styles.totalRow]}>
              <Text style={styles.totalText}>TOTAL</Text>
              <Text style={styles.totalText}>${finalTotal.toFixed(2)}</Text>
            </View>
          </View>

          {/* Método de pago */}
          <View style={styles.paymentMethod}>
            <Text style={styles.sectionTitle}>Método de pago</Text>
            <TouchableOpacity style={styles.paymentCard}>
              <Image
                source={require('../assets/mastercard.png')} 
                style={styles.cardIcon}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>•••• 4242</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Botón de pago */}
      <TouchableOpacity
        style={[styles.payButton, isLoading && styles.payButtonDisabled]}
        onPress={handlePayment}
        disabled={isLoading}
      >
        <Text style={styles.payButtonText}>
          {isLoading ? 'Procesando...' : 'Comprar ticket'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  movieInfoContainer: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  movieImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  movieDetails: {
    marginLeft: 15,
    flex: 1,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  showtime: {
    color: '#999',
    fontSize: 14,
    marginBottom: 5,
  },
  location: {
    color: '#999',
    fontSize: 14,
  },
  orderDetails: {
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderNumber: {
    color: '#999',
    fontSize: 12,
    marginBottom: 20,
  },
  ticketDetails: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailText: {
    color: '#999',
    fontSize: 14,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#444',
    marginTop: 10,
    paddingTop: 15,
    marginBottom: 0,
  },
  totalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentMethod: {
    marginBottom: 20,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
  },
  cardIcon: {
    width: 40,
    height: 25,
    marginRight: 10,
  },
  cardText: {
    color: '#fff',
    fontSize: 14,
  },
  payButton: {
    backgroundColor: '#e31837',
    padding: 18,
    margin: 20,
    borderRadius: 8,
  },
  payButtonDisabled: {
    backgroundColor: '#666',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OrderSummaryScreen;
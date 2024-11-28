import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../src/api/authService';

// Datos simulados de compras anteriores
const MOCK_PURCHASES = [
  {
    id: '1',
    movieTitle: 'Dune: Part Two',
    date: '2024-03-25',
    time: '19:30',
    seats: ['A1', 'A2'],
    total: 26.98,
  },
  {
    id: '2',
    movieTitle: 'Poor Things',
    date: '2024-03-20',
    time: '17:00',
    seats: ['C4'],
    total: 12.99,
  },
];

// Géneros preferidos simulados
const GENRES = [
  'Acción',
  'Aventura',
  'Comedia',
  'Drama',
  'Ciencia ficción',
  'Terror',
  'Romance',
  'Animación',
];

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        setUserData(JSON.parse(userDataString));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => {
      if (prev.includes(genre)) {
        return prev.filter(g => g !== genre);
      } else {
        return [...prev, genre];
      }
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Cabecera del perfil */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {userData?.name?.charAt(0) || 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>{userData?.name || 'Usuario'}</Text>
        <Text style={styles.userEmail}>{userData?.email}</Text>
      </View>

      {/* Sección de preferencias */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferencias</Text>
        
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceText}>Notificaciones</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#666', true: '#e31837' }}
            thumbColor={notifications ? '#fff' : '#f4f3f4'}
          />
        </View>

        <Text style={styles.subsectionTitle}>Géneros favoritos</Text>
        <View style={styles.genresContainer}>
          {GENRES.map(genre => (
            <TouchableOpacity
              key={genre}
              style={[
                styles.genreTag,
                selectedGenres.includes(genre) && styles.genreTagSelected
              ]}
              onPress={() => toggleGenre(genre)}
            >
              <Text style={[
                styles.genreText,
                selectedGenres.includes(genre) && styles.genreTextSelected
              ]}>
                {genre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Historial de compras */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historial de compras</Text>
        {MOCK_PURCHASES.map(purchase => (
          <View key={purchase.id} style={styles.purchaseCard}>
            <Text style={styles.movieTitle}>{purchase.movieTitle}</Text>
            <Text style={styles.purchaseDetail}>
              {formatDate(purchase.date)} - {purchase.time}
            </Text>
            <Text style={styles.purchaseDetail}>
              Asientos: {purchase.seats.join(', ')}
            </Text>
            <Text style={styles.purchaseTotal}>
              Total: ${purchase.total.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Botón de cerrar sesión */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e31837',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    color: '#999',
    fontSize: 16,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  preferenceText: {
    color: '#fff',
    fontSize: 16,
  },
  subsectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  genreTag: {
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 20,
    margin: 4,
  },
  genreTagSelected: {
    backgroundColor: '#e31837',
  },
  genreText: {
    color: '#fff',
    fontSize: 14,
  },
  genreTextSelected: {
    fontWeight: 'bold',
  },
  purchaseCard: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  purchaseDetail: {
    color: '#999',
    fontSize: 14,
    marginBottom: 3,
  },
  purchaseTotal: {
    color: '#e31837',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#e31837',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
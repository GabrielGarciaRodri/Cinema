import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MOCK_MOVIES = [
  {
    id: '1',
    title: 'Dune: Part Two',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    duration: 166,
    genre: 'Ciencia ficción',
    rating: 8.5,
  },
  {
    id: '2',
    title: 'Poor Things',
    posterUrl: 'https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg',
    duration: 141,
    genre: 'Comedia/Drama',
    rating: 8.2,
  },
  {
    id: '3',
    title: 'Kung Fu Panda 4',
    posterUrl: 'https://image.tmdb.org/t/p/w500/wkfG7DaExmcVsGLR4kLouiFh5fL.jpg',
    duration: 94,
    genre: 'Animación',
    rating: 7.4,
  },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.42;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

const HomeScreen = ({ navigation }) => {
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Sí, cerrar sesión',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userData');
              navigation.replace('Login');
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
          }
        }
      ]
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutButtonText}>Salir</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderMovie = ({ item }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => navigation.navigate('MovieDetail', { movie: item })}
    >
      <Image
        source={{ uri: item.posterUrl }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.movieInfo}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.rating}>⭐ {item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_MOVIES}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  listContainer: {
    padding: 10,
  },
  movieCard: {
    width: CARD_WIDTH,
    marginHorizontal: 6,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#333',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  poster: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  movieInfo: {
    padding: 10,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rating: {
    color: '#ffd700',
    fontSize: 12,
  },
  logoutButton: {
    marginRight: 15,
    padding: 8,
  },
  logoutButtonText: {
    color: '#e31837',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
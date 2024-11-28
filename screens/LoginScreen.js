import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = 'Ingrese un correo electrónico válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  }, [errors]);

  const handleLogin = async () => {
    Keyboard.dismiss();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await AsyncStorage.setItem('userToken', 'dummy-token');
      await AsyncStorage.setItem('userData', JSON.stringify({
        email: formData.email,
        name: 'Usuario de Prueba'
      }));
      navigation.replace('Home');
    } catch (error) {
      Alert.alert(
        'Error',
        error.message || 'No se pudo iniciar sesión. Por favor intente nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = useCallback(() => {
    if (!formData.email) {
      setErrors(prev => ({
        ...prev,
        email: 'Ingrese su correo electrónico para restablecer la contraseña',
      }));
      return;
    }

    if (!EMAIL_REGEX.test(formData.email)) {
      setErrors(prev => ({
        ...prev,
        email: 'Ingrese un correo electrónico válido',
      }));
      return;
    }

    Alert.alert(
      'Restablecer Contraseña',
      '¿Desea recibir un enlace para restablecer su contraseña?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: async () => {
            setIsLoading(true);
            try {
              await new Promise(resolve => setTimeout(resolve, 1000));
              Alert.alert(
                'Éxito',
                'Se ha enviado un enlace a su correo electrónico'
              );
            } catch (error) {
              Alert.alert('Error', 'No se pudo enviar el enlace');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  }, [formData.email]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>¡Bienvenido!</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Correo electrónico"
            placeholderTextColor="#666"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
            editable={!isLoading}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                errors.password && styles.inputError,
              ]}
              placeholder="Contraseña"
              placeholderTextColor="#666"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
              returnKeyType="done"
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            >
              <Text style={styles.eyeIconText}>
                {secureTextEntry ? '👁️' : '👁️‍🗨️'}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.forgotPasswordButton}
          onPress={handleForgotPassword}
          disabled={isLoading}
        >
          <Text style={styles.forgotPasswordText}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}
          disabled={isLoading}
        >
          <Text style={styles.registerButtonText}>
            ¿No tienes una cuenta? Regístrate
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#e31837',
  },
  errorText: {
    color: '#e31837',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  eyeIconText: {
    fontSize: 20,
  },
  loginButton: {
    backgroundColor: '#e31837',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: '#666',
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordButton: {
    marginTop: 15,
    padding: 10,
  },
  forgotPasswordText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  registerButton: {
    marginTop: 5,
    padding: 10,
  },
  registerButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default LoginScreen;
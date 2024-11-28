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
import authService from '../src/api/authService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'El nombre es requerido';
    }

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

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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

  const handleRegister = async () => {
    Keyboard.dismiss();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await authService.register(formData.name, formData.email, formData.password);
      Alert.alert('Éxito', 'Registro exitoso', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login')
        }
      ]);
    } catch (error) {
      Alert.alert(
        'Error',
        error.message || 'No se pudo completar el registro. Por favor intente nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Crear Cuenta</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Nombre completo"
            placeholderTextColor="#666"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            autoCorrect={false}
            returnKeyType="next"
            editable={!isLoading}
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name}</Text>
          )}
        </View>

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
              style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
              placeholder="Contraseña"
              placeholderTextColor="#666"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
              returnKeyType="next"
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

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            placeholder="Confirmar contraseña"
            placeholderTextColor="#666"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            secureTextEntry={secureTextEntry}
            autoCapitalize="none"
            returnKeyType="done"
            editable={!isLoading}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Registrarse</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
          disabled={isLoading}
        >
          <Text style={styles.loginLinkText}>
            ¿Ya tienes una cuenta? Inicia sesión
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
  registerButton: {
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
  registerButtonDisabled: {
    backgroundColor: '#666',
  },
  registerButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    marginTop: 15,
    padding: 10,
  },
  loginLinkText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default RegisterScreen;
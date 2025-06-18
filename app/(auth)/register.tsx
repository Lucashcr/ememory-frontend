import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';
import { useReviews } from '@/contexts/ReviewsContext';
import { useSubjects } from '@/contexts/SubjectsContext';
import api from '@/services/api';
import {validateEmail, validatePassword} from '@/services/validators';
import { Toast } from 'toastify-react-native';

export default function Register() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signIn } = useAuth();
  const { setSubjects } = useSubjects();
  const { setReviews } = useReviews();

  const handleRegister = async () => {
    if (!email || !firstName || !password) {
      Toast.warn('Preencha todos os campos obrigatórios!');
      return;
    }

    const emailValidation = validateEmail(email);
    if (emailValidation.error) {
      Toast.warn(emailValidation.error);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (passwordValidation.error) {
      Toast.warn(passwordValidation.error);
      return;
    }

    if (password !== confirmPassword) {
      Toast.warn('As senhas não coincidem!');
      return;
    }

    const response = await api.post('/auth/users/', {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    });
    if (response.status !== 201) {
      Toast.error('Ocorreu um erro inesperado ao registrar! Tente novamente.');
      return;
    }

    const loginResponse = await api.post('/auth/token/login', {
      email,
      password,
    });
    await signIn(loginResponse.data.auth_token);

    const [subjectsResponse, reviewsResponse] = await Promise.all([
      api.get('/reviews/subjects/'),
      api.get('/reviews/'),
    ]);

    setSubjects(subjectsResponse.data);
    setReviews(reviewsResponse.data);

    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="sentences"
      />
      <TextInput
        style={styles.input}
        placeholder="Sobrenome (opcional)"
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="sentences"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Registrar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.replace('/(auth)/login')}
      >
        <Text style={styles.loginButtonText}>Já tenho uma conta!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  registerButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

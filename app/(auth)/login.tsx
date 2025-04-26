import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useSubjects } from '@/contexts/SubjectsContext';
import { useReviews } from '@/contexts/ReviewsContext';
import { router } from 'expo-router';
import api from '@/services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const { setSubjects } = useSubjects();
  const { setReviews } = useReviews();

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/token', { username, password });
      await signIn(response.data.token);
      
      const [subjectsResponse, reviewsResponse] = await Promise.all([
        api.get('/reviews/subjects/'),
        api.get('/reviews/')
      ]);

      setSubjects(subjectsResponse.data);
      setReviews(reviewsResponse.data);

      router.replace('/(tabs)');
    } catch (error: any) {
      if (error.response) {
        Alert.alert('Erro', 'Credenciais inválidas! Verifique seu usuário e senha e tente novamente.');
      } else if (error.request) {
        Alert.alert('Erro', 'Erro de conexão com o servidor! Tente novamente mais tarde.');
      } else {
        Alert.alert('Erro', 'Ocorreu um erro inesperado');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Entrar</Text>
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
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
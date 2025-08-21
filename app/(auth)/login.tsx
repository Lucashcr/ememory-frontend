import { Button, Input } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { LoginResponse } from '@/services/auth/types';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Toast } from 'toastify-react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      const loginData = { email, password };
      const response = await api.post<LoginResponse>('/auth/token/login', loginData);
      await signIn(response.auth_token);
      Toast.success('Login realizado com sucesso!');
      router.replace('/(tabs)');
    } catch (error: any) {
      if (error?.response?.status === 400) {
        Toast.warn(
          'Credenciais inválidas! Verifique seu usuário e senha e tente novamente.'
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Input
        type="password"
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />
      <Button variant="primary" onPress={handleLogin}>
        Entrar
      </Button>
      <Button
        variant="secondary"
        onPress={() => router.replace('/(auth)/register')}
      >
        Criar minha conta
      </Button>
      <Button
        variant="secondary"
        onPress={() => router.replace('/(auth)/forgot-password')}
      >
        Esqueci minha senha
      </Button>
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
});

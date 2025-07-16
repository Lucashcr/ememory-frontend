import { api } from '@/services/api';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Toast } from 'toastify-react-native';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleForgotPassword = () => {
    api.post('/auth/users/reset_password/', { email });
    Toast.success(
      'As instruções para redefinir a senha foram enviadas para o seu email.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Esqueci minha senha</Text>
      <Text style={styles.message}>
        Digite seu email abaixo e caso ele esteja cadastrado, você receberá um link para redefinir sua senha. Se você não receber o email, verifique sua caixa de spam ou lixo eletrônico.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TouchableOpacity
        style={styles.forgotButton}
        onPress={handleForgotPassword}
      >
        <Text style={styles.forgotButtonText}>Enviar instruções</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={() => router.replace('/(auth)/login')}
      >
        <Text style={styles.loginButtonText}>Fazer login</Text>
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
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  forgotButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  forgotButtonText: {
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

import { api } from '@/services/api';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Toast } from 'toastify-react-native';

import { Button, Input } from '@/components/ui';

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
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Button
        variant="primary"
        onPress={handleForgotPassword}
      >
        Enviar instruções
      </Button>
      <Button
        variant="secondary"
        onPress={() => router.replace('/(auth)/login')}
      >
        Fazer login
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
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
  },
});

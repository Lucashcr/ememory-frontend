type Result<T> = {
  value: T | null;
  error: string | null;
};


export function validateEmail(email: string): Result<string> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      value: null,
      error: 'Email inválido.',
    };
  }
  return {
    value: email,
    error: null,
  }
}

export function validatePassword(password: string): Result<string> {
  if (password.length < 8) {
    return {
      value: null,
      error: 'A senha deve ter pelo menos 8 caracteres.',
    }
  }

  if (!/[a-zA-Z]/.test(password)) {
    return {
      value: null,
      error: 'A senha deve conter pelo menos uma letra.',
    }
  }

  if (!/\d/.test(password)) {
    return {
      value: null,
      error: 'A senha deve conter pelo menos um número.',
    }
  }

  return {
    value: password,
    error: null,
  }
}

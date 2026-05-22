export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isStrongPassword(password: string): boolean {
  return password.length >= 8;
}

export function validateRegister(input: {
  name: string;
  email: string;
  password: string;
}): string | null {
  if (!input.name.trim()) return 'Name is required';
  if (!isValidEmail(input.email)) return 'Enter a valid email';
  if (!isStrongPassword(input.password)) return 'Password must be at least 8 characters';
  return null;
}

export function validateLogin(input: { email: string; password: string }): string | null {
  if (!isValidEmail(input.email)) return 'Enter a valid email';
  if (!input.password) return 'Password is required';
  return null;
}

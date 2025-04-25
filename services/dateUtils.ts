export function formatDateString(date: string | Date): string {
  if (date instanceof Date) {
    // Se for um objeto Date, converte para string no formato yyyy-mm-dd
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  // Se já for uma string no formato correto, retorna a própria string
  return date;
}

export function getCurrentDate(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
}

export function formatDateToLocalString(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
}

export function addDays(date: string, days: number): string {
  const [year, month, day] = date.split('-').map(Number);
  const newDate = new Date(year, month - 1, day);
  newDate.setDate(newDate.getDate() + days);
  return formatDateString(newDate);
}
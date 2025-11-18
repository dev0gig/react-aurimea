
export const getViennaDate = (date: Date | string): Date => {
  const d = new Date(date);
  const viennaDateStr = d.toLocaleDateString('en-CA', { timeZone: 'Europe/Vienna' });
  return new Date(`${viennaDateStr}T00:00:00.000Z`);
};

export const getViennaFirstOfMonth = (): Date => {
  const now = new Date();
  const viennaDateStr = now.toLocaleDateString('en-CA', { timeZone: 'Europe/Vienna' });
  const [year, month] = viennaDateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, 1));
};

export const formatDay = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', timeZone: 'Europe/Vienna' };
  return date.toLocaleDateString('de-DE', options) + '.';
};

export const getFormattedDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const viennaDateFormatter = new Intl.DateTimeFormat('de-DE', {
      timeZone: 'Europe/Vienna',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
  });

  if (viennaDateFormatter.format(date) === viennaDateFormatter.format(today)) return 'Heute';
  if (viennaDateFormatter.format(date) === viennaDateFormatter.format(yesterday)) return 'Gestern';

  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', timeZone: 'Europe/Vienna' };
  return date.toLocaleDateString('de-DE', options);
};

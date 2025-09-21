import type { Participant } from './types';

export function exportToCSV(participants: Participant[], listName: string) {
  const headers = 'name,email,phone';
  const rows = participants.map(p => {
    const name = `"${p.name.replace(/"/g, '""')}"`;
    const email = p.email ? `"${p.email.replace(/"/g, '""')}"` : '';
    const phone = p.phone ? `"${p.phone.replace(/"/g, '""')}"` : '';
    return `${name},${email},${phone}`;
  });
  const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows.join('\n')}`;
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${listName.replace(/\s+/g, '_')}_participants.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function importFromCSV(file: File): Promise<Omit<Participant, 'id'>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split(/\r\n|\n/);
        if (lines.length < 1) {
          resolve([]);
          return;
        }

        const headerLine = lines.shift() as string;
        const headers = headerLine.split(',').map(h => h.trim().toLowerCase());
        
        const nameIndex = headers.indexOf('name');
        if (nameIndex === -1) {
          throw new Error('CSV must have a "name" column.');
        }

        const emailIndex = headers.indexOf('email');
        const phoneIndex = headers.indexOf('phone');

        const participants = lines.map(line => {
          if (!line.trim()) return null;
          const data = line.split(',');
          return {
            name: data[nameIndex]?.trim().replace(/^"|"$/g, '') || '',
            email: emailIndex > -1 ? data[emailIndex]?.trim().replace(/^"|"$/g, '') : undefined,
            phone: phoneIndex > -1 ? data[phoneIndex]?.trim().replace(/^"|"$/g, '') : undefined,
          };
        }).filter((p): p is Omit<Participant, 'id'> => p !== null && !!p.name);
        
        resolve(participants);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

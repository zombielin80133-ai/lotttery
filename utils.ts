
import { Participant } from './types';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const parseNames = (text: string): string[] => {
  return text
    .split(/[\n,]+/)
    .map(name => name.trim())
    .filter(name => name !== '');
};

// Fix: Removed unnecessary comma in generic declaration to improve type inference compatibility
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const downloadCSV = (data: any[][], filename: string) => {
  const csvContent = "data:text/csv;charset=utf-8," 
    + data.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

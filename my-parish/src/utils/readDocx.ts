import Mammoth from "mammoth";

interface ParsedContent {
  title: string;
  content: { order: number; text: string }[];
  extraInfo: string;
}

export async function readFile(file: File): Promise<ParsedContent> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const result = await Mammoth.extractRawText({ arrayBuffer });
        const text = result.value;

        const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
        
        if (lines.length === 0) {
          return reject("Plik jest pusty lub nie można go odczytać.");
        }

        const title = lines[0] || "Untitled Announcement";
        const extraInfo = lines.length > 1 ? lines[lines.length - 1] : "";
        const content = lines.slice(1, lines.length - 1).map((line, index) => ({
          order: index + 1,
          text: line,
        }));

        resolve({ title, content, extraInfo });
      } catch {
        reject("Błąd podczas przetwarzania pliku .docx");
      }
    };

    reader.onerror = () => reject("Błąd wczytywania pliku");
    reader.readAsArrayBuffer(file);
  });
}

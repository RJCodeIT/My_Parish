// Skrypt do naprawy błędów TypeScript w projekcie
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

// Funkcja do rekurencyjnego przeszukiwania plików
function findFiles(dir, extension, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.next')) {
      findFiles(filePath, extension, fileList);
    } else if (path.extname(file) === extension) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Funkcja do naprawy błędów TypeScript w pliku
function fixTypeScriptErrors(filePath) {
  console.log(`Naprawianie pliku: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Napraw błędy z context: any
  if (content.includes('context: any')) {
    content = content.replace(/context: any/g, 'context: { params: { id: string } }');
    modified = true;
  }
  
  // Napraw błędy z Prisma.PrismaClientKnownRequestError
  if (content.includes('Prisma.PrismaClientKnownRequestError')) {
    content = content.replace(
      /if \(error instanceof Prisma\.PrismaClientKnownRequestError && error\.code === 'P2025'\)/g,
      "if (error instanceof Error && 'code' in error && error.code === 'P2025')"
    );
    modified = true;
  }
  
  // Napraw błędy z member: any i group: any
  if (content.includes('member: any') || content.includes('group: any')) {
    content = content.replace(/member: any/g, 'member: { parishionerId: string }');
    content = content.replace(/group: any/g, 'group: { id: string; name: string }');
    modified = true;
  }
  
  // Napraw błędy z prismaTransaction: any
  if (content.includes('prismaTransaction: any') || content.includes('prismaTransaction)')) {
    content = content.replace(/prismaTransaction: any/g, 'prismaTransaction');
    content = content.replace(/\(prismaTransaction\)/g, '(prismaTransaction)');
    modified = true;
  }
  
  // Zapisz zmiany, jeśli plik został zmodyfikowany
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Naprawiono plik: ${filePath}`);
  }
}

// Główna funkcja
function main() {
  const apiDir = path.join(__dirname, 'src', 'app', 'api');
  const tsFiles = findFiles(apiDir, '.ts');
  
  console.log(`Znaleziono ${tsFiles.length} plików TypeScript do naprawy`);
  
  tsFiles.forEach(file => {
    fixTypeScriptErrors(file);
  });
  
  console.log('Zakończono naprawianie błędów TypeScript');
}

// Uruchom skrypt
main();

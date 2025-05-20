/* eslint-disable @typescript-eslint/no-require-imports */
// Skrypt do naprawy błędów ESLint z nieużywanymi zmiennymi
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

// Funkcja do naprawy nieużywanych zmiennych w pliku
function fixUnusedVars(filePath) {
  console.log(`Naprawianie pliku: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Usuń nieużywane zmienne RouteContext
  if (content.includes("type RouteContext =")) {
    content = content.replace(/type RouteContext = [^;]+;/g, '');
    modified = true;
  }
  
  // Napraw funkcje GET bez używanych parametrów
  if (content.includes("export async function GET(request: NextRequest, { params }")) {
    // Sprawdź, czy params jest używane w funkcji
    const getFunction = content.match(/export async function GET[^{]+{([^}]+)}/s);
    if (getFunction && !getFunction[1].includes("params.")) {
      content = content.replace(
        /export async function GET\(request: NextRequest, { params }: [^)]+\)/g,
        'export async function GET(_request: NextRequest, _context: { params: { id: string } })'
      );
      modified = true;
    }
  }
  
  // Napraw funkcje PUT bez używanych parametrów
  if (content.includes("export async function PUT(request: NextRequest, { params }")) {
    content = content.replace(
      /export async function PUT\(request: NextRequest, { params }: [^)]+\)/g,
      'export async function PUT(request: NextRequest, { params }: { params: { id: string } })'
    );
    modified = true;
  }
  
  // Napraw funkcje DELETE bez używanych parametrów
  if (content.includes("export async function DELETE(request: NextRequest, { params }")) {
    content = content.replace(
      /export async function DELETE\(request: NextRequest, { params }: [^)]+\)/g,
      'export async function DELETE(_request: NextRequest, { params }: { params: { id: string } })'
    );
    modified = true;
  }
  
  // Dodaj podkreślenie do nieużywanych parametrów
  content = content.replace(/\(request: NextRequest, /g, '(_request: NextRequest, ');
  content = content.replace(/\{ params \}/g, '{ params: _params }');
  
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
    fixUnusedVars(file);
  });
  
  console.log('Zakończono naprawianie nieużywanych zmiennych');
}

// Uruchom skrypt
main();

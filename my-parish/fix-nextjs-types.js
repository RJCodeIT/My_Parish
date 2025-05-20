/* eslint-disable @typescript-eslint/no-require-imports */
// Skrypt do naprawy typów w API routes dla kompatybilności z Next.js
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

// Funkcja do naprawy typów Next.js w pliku
function fixNextJsTypes(filePath) {
  console.log(`Naprawianie pliku: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Sprawdź, czy plik zawiera definicję API route
  if (content.includes('export async function GET') || 
      content.includes('export async function POST') || 
      content.includes('export async function PUT') || 
      content.includes('export async function DELETE')) {
    
    // Dodaj import NextRequest jeśli nie istnieje
    if (!content.includes('import { NextRequest }')) {
      content = content.replace(
        'import { NextResponse } from "next/server";',
        'import { NextResponse, NextRequest } from "next/server";'
      );
      modified = true;
    }
    
    // Usuń własne definicje typów RouteContext
    const routeContextRegex = /type\s+RouteContext\s*=\s*\{\s*params\s*:\s*\{\s*id\s*:\s*string[^}]*\}\s*\}\s*;/g;
    if (routeContextRegex.test(content)) {
      content = content.replace(routeContextRegex, '');
      modified = true;
    }
    
    // Napraw sygnatury funkcji GET
    content = content.replace(
      /export async function GET\([^)]*\)\s*{/g,
      'export async function GET(request: NextRequest, { params }: { params: { id: string } }) {'
    );
    
    // Napraw sygnatury funkcji PUT
    content = content.replace(
      /export async function PUT\([^)]*\)\s*{/g,
      'export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {'
    );
    
    // Napraw sygnatury funkcji DELETE
    content = content.replace(
      /export async function DELETE\([^)]*\)\s*{/g,
      'export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {'
    );
    
    // Napraw odwołania do context.params
    content = content.replace(/const params = context\.params;/g, '');
    
    // Napraw odwołania do params.id
    if (content.includes('const id = params.id;')) {
      content = content.replace(/const id = params\.id;/g, 'const id = params.id;');
    }
    
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
    fixNextJsTypes(file);
  });
  
  console.log('Zakończono naprawianie typów Next.js');
}

// Uruchom skrypt
main();

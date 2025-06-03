import React from 'react'

export default function AdminFooter() {
  return (
    <footer className="bg-white shadow-sm border border-neutral/10 p-2 text-center">
      <p>Wszelkie prawa zastrzeżone {new Date().getFullYear()} Moja Parafia</p>
      <p className="text-sm text-gray-500 mt-1">Powered by RJ Code</p>
    </footer>
  )
}
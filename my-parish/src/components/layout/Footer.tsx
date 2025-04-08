import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaCross } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 text-primary mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center sm:text-left">
            <Link href="/kontakt" className="block hover:text-secondary transition-colors">
              <h2 className="text-lg font-semibold mb-3 flex items-center sm:justify-start justify-center">
                <FaCross className="mr-2" /> Parafia
              </h2>
              <div className="text-sm space-y-1">
                <p>Parafia Rzymskokatolicka</p>
                <p>ul. Przykładowa 123</p>
                <p>00-000 Miasto</p>
              </div>
            </Link>
          </div>

          <div className="text-center sm:text-left">
            <Link href="/kontakt" className="block hover:text-secondary transition-colors">
              <h2 className="text-lg font-semibold mb-3">Kontakt</h2>
              <div className="text-sm space-y-1">
                <div className="flex items-center sm:justify-start justify-center hover:text-secondary transition-colors">
                  <FaPhone className="mr-2" /> +48 123 456 789
                </div>
                <div className="flex items-center sm:justify-start justify-center hover:text-secondary transition-colors">
                  <FaEnvelope className="mr-2" /> parafia@example.com
                </div>
                <div className="flex items-center sm:justify-start justify-center hover:text-secondary transition-colors">
                  <FaMapMarkerAlt className="mr-2" /> Mapa dojazdu
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center sm:text-left">
            <Link href="/kontakt" className="block hover:text-secondary transition-colors">
              <h2 className="text-lg font-semibold mb-3">Godziny otwarcia</h2>
              <div className="text-sm space-y-1">
                <p className="font-medium">Kancelaria parafialna:</p>
                <p>Pon - Pt: 9:00 - 12:00</p>
                <p>Sob: 9:00 - 11:00</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Moja Parafia. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
}

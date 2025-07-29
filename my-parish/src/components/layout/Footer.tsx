import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 text-primary mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Parafia section - not clickable */}
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <div>
              <h2 className="text-lg font-semibold mb-2 sm:mb-3">Parafia</h2>
              <div className="text-sm space-y-1">
                <p>Kościół rzymskokatolicki pw.</p>
                <p>Przemienienia Pańskiego</p>
                <p>Kościelna 7</p>
                <p>21-136 Białystok</p>
              </div>
            </div>
          </div>

          {/* Kontakt section - with clickable elements */}
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <div>
              <h2 className="text-lg font-semibold mb-2 sm:mb-3">Kontakt</h2>
              <div className="text-sm space-y-2">
                <a href="tel:+48123456789" className="flex items-center sm:justify-start justify-center hover:text-secondary transition-colors">
                  <FaPhone className="mr-2 flex-shrink-0" /> <span className="break-all">+48 123 456 789</span>
                </a>
                <a href="mailto:parafia@gmail.com" className="flex items-center sm:justify-start justify-center hover:text-secondary transition-colors">
                  <FaEnvelope className="mr-2 flex-shrink-0" /> <span className="break-all">parafia@gmail.com</span>
                </a>
                <Link href="/kontakt" className="flex items-center sm:justify-start justify-center hover:text-secondary transition-colors">
                  <FaMapMarkerAlt className="mr-2 flex-shrink-0" /> Mapa dojazdu
                </Link>
              </div>
            </div>
          </div>

          {/* Godziny otwarcia section - not clickable */}
          <div className="text-center sm:text-left">
            <div>
              <h2 className="text-lg font-semibold mb-2 sm:mb-3">Godziny otwarcia</h2>
              <div className="text-sm space-y-1">
                <p className="font-medium">Kancelaria parafialna:</p>
                <p>Poniedziałek - Piątek: 8:00 - 12:00</p>
                <p>Sobota: 8:00 - 11:00</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-6 sm:mt-8 pt-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Moja Parafia. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
}

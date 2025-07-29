import PageContainer from "@/components/layout/PageContainer";
import SectionTitle from "@/components/layout/SectionTitle";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div>
      <SectionTitle name="Kontakt" className="mt-8"/>
      <PageContainer>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-8 border border-neutral/30 space-y-6">
            <h2 className="text-2xl font-bold text-neutral-700">
              Kościół rzymskokatolicki pw. Przemienienia Pańskiego
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-[auto_100px_1fr] gap-y-6 gap-x-3">
                <MapPin className="w-5 h-5 text-neutral-500 self-center" />
                <p className="text-neutral-600 self-center">Adres:</p>
                <p className="text-neutral-900 self-center">Kościelna 7, 21-136 Firlej</p>
                
                <Phone className="w-5 h-5 text-neutral-500 self-center" />
                <p className="text-neutral-600 self-center">Telefon:</p>
                <p className="text-neutral-900 self-center">+48 123 456 789</p>
                
                <Mail className="w-5 h-5 text-neutral-500 self-center" />
                <p className="text-neutral-600 self-center">Email:</p>
                <p className="text-neutral-900 self-center">parafia@gmail.com</p>
                
                <Clock className="w-5 h-5 text-neutral-500 self-start mt-1" />
                <p className="text-neutral-600 self-start mt-1">Godziny otwarcia:</p>
                <div>
                  <p className="text-neutral-900">Poniedziałek - Piątek: 8:00 - 12:00</p>
                  <p className="text-neutral-900">Sobota: 8:00 - 11:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-neutral-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:bg-white/90">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9950.258214539755!2d22.51183671281737!3d51.55477997181436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x472251795c4c6b0b%3A0x1c0c2c4e6c4c6b0a!2zS2_Fm2Npw7PFgiBQcnplbWllbmllbmlhIFBhxYRza2llZ28!5e0!3m2!1spl!2spl!4v1711206140!5m2!1spl!2spl"
              className="w-full h-[500px] transition-transform duration-500 hover:scale-[1.02]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

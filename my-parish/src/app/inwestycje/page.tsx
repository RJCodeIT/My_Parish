import PageContainer from "@/components/layout/PageContainer";
import Hero from "@/components/ui/Hero";

export default function Investments() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative">
        <Hero 
          imageUrl="/mojaParafia/KaplicaSwJana.jpg"
          quote="Kto by między wami chciał stać się wielkim, niech będzie waszym sługą."
          source="Ewangelia wg św. Mateusza 20:26"
          pageName="Inwestycje"
          altText="Kościół parafialny"
        />
      </div>
      <PageContainer className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Inwestycje parafialne
        </h2>

        <p className="text-lg text-gray-700">
          Nasza parafia nieustannie się rozwija, dbając zarówno o duchowy rozwój
          wiernych, jak i o infrastrukturę kościoła oraz otaczających go
          budynków. Dzięki wsparciu parafian i hojnych darczyńców realizujemy
          liczne inwestycje, które przyczyniają się do piękna i funkcjonalności
          naszej świątyni.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Zrealizowane inwestycje
        </h3>

        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>
            <strong>Renowacja dachu kościoła</strong> (2021) – wymiana dachówki
            i konserwacja drewnianej konstrukcji.
          </li>
          <li>
            <strong>Nowe nagłośnienie</strong> (2022) – poprawa jakości dźwięku
            podczas nabożeństw.
          </li>
          <li>
            <strong>Odnowienie ołtarza głównego</strong> (2023) – prace
            konserwatorskie i przywrócenie pierwotnego wyglądu.
          </li>
          <li>
            <strong>Nowe ławki i konfesjonały</strong> (2023) – zwiększenie
            komfortu wiernych.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Planowane inwestycje
        </h3>

        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>
            <strong>Budowa nowej kaplicy</strong> – miejsce cichej modlitwy i
            adoracji Najświętszego Sakramentu.
          </li>
          <li>
            <strong>Modernizacja ogrzewania</strong> – instalacja nowoczesnego
            systemu ogrzewania, który poprawi komfort wiernych w sezonie
            zimowym.
          </li>
          <li>
            <strong>Renowacja elewacji kościoła</strong> – oczyszczenie i
            odnowienie ścian zewnętrznych świątyni.
          </li>
          <li>
            <strong>Rozbudowa parkingu</strong> – zwiększenie liczby miejsc dla
            wiernych przyjeżdżających na msze święte.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Jak możesz pomóc?
        </h3>

        <p className="text-lg text-gray-700">
          Wszystkie te inwestycje są możliwe dzięki wsparciu naszych parafian.
          Jeśli chcesz przyczynić się do rozwoju parafii, możesz wesprzeć nas
          modlitwą, pracą społeczną lub ofiarą na cele remontowe. Każdy dar ma
          ogromne znaczenie dla naszej wspólnoty.
        </p>

        <p className="mt-6 text-lg text-gray-700">
          Serdecznie dziękujemy za każdą formę wsparcia i zaangażowania. Razem
          budujemy naszą parafię na przyszłe pokolenia!
        </p>
      </PageContainer>
    </div>
  );
}

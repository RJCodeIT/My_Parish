import PageContainer from "@/components/layout/PageContainer";
import Hero from "@/components/ui/Hero";

export default function Schedule() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative">
        <Hero 
          imageUrl="/mojaParafia/KaplicaSwJana.jpg"
          quote="Ilekroć bowiem spożywacie ten chleb i pijecie kielich, śmierć Pana głosicie, aż przyjdzie."
          source="1 List do Koryntian 11:26"
          pageName="Porządek Mszy Świętych"
          altText="Kościół parafialny"
        />
      </div>
      <PageContainer className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Porządek Mszy Świętych
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Msze Święte w niedziele i święta
        </h3>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>
            <strong>07:30</strong> – Msza Święta dla osób starszych i chorych.
          </li>
          <li>
            <strong>09:00</strong> – Msza Święta z udziałem dzieci.
          </li>
          <li>
            <strong>11:00</strong> – Suma parafialna.
          </li>
          <li>
            <strong>18:00</strong> – Msza Święta wieczorna.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Msze Święte w dni powszednie
        </h3>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>
            <strong>07:00</strong> – Msza Święta poranna.
          </li>
          <li>
            <strong>18:00</strong> – Msza Święta wieczorna.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
          Stałe nabożeństwa w naszej parafii
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Nabożeństwa w ciągu roku liturgicznego
        </h3>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>
            <strong>Roraty</strong> – w Adwencie, codziennie o 06:30.
          </li>
          <li>
            <strong>Droga Krzyżowa</strong> – w Wielkim Poście w każdy piątek o
            17:15.
          </li>
          <li>
            <strong>Gorzkie Żale</strong> – w Wielkim Poście w każdą niedzielę o
            17:00.
          </li>
          <li>
            <strong>Nabożeństwa majowe</strong> – codziennie w maju o 17:30.
          </li>
          <li>
            <strong>
              Nabożeństwa czerwcowe ku czci Najświętszego Serca Pana Jezusa
            </strong>{" "}
            – codziennie w czerwcu po wieczornej Mszy Świętej.
          </li>
          <li>
            <strong>Różaniec</strong> – w październiku codziennie o 17:30.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Nabożeństwa pierwszopiątkowe i pierwszosobotnie
        </h3>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>
            <strong>Pierwszy piątek miesiąca</strong> – spowiedź od 17:00, Msza
            Święta ku czci Najświętszego Serca Jezusa o 18:00.
          </li>
          <li>
            <strong>Pierwsza sobota miesiąca</strong> – różaniec wynagradzający
            i Msza Święta o 07:00.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Nabożeństwa okolicznościowe
        </h3>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>
            <strong>Rekolekcje wielkopostne</strong> – prowadzone co roku przed
            Wielkanocą.
          </li>
          <li>
            <strong>Nowenna do Matki Bożej Nieustającej Pomocy</strong> – w
            każdą środę po wieczornej Mszy Świętej.
          </li>
          <li>
            <strong>Nabożeństwo fatimskie</strong> – 13. dnia każdego miesiąca
            od maja do października.
          </li>
          <li>
            <strong>Adoracja Najświętszego Sakramentu</strong> – w każdy
            czwartek od 17:00 do 18:00.
          </li>
          <li>
            <strong>Błogosławieństwo pokarmów wielkanocnych</strong> – w Wielką
            Sobotę od 9:00 do 12:00.
          </li>
        </ul>

        <p className="mt-6 text-lg text-gray-700">
          Serdecznie zapraszamy do udziału w Mszach Świętych i nabożeństwach.
          Wspólna modlitwa i celebracja świąt liturgicznych to najlepszy sposób
          na pogłębienie relacji z Bogiem i wspólnotą parafialną.
        </p>
      </PageContainer>
    </div>
  );
}

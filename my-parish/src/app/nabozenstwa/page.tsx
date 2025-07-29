import PageContainer from "@/components/layout/PageContainer";
import SectionTitle from "@/components/layout/SectionTitle";

export default function Devotions() {
  return (
    <div>
      <SectionTitle name="Nabożeństwa" className="mt-8"/>
      <PageContainer>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Stałe nabożeństwa w naszej parafii
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Codzienne nabożeństwa
        </h3>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>
            <strong>Eucharystia – Msza Święta</strong>
          </li>
          <li>
            <strong>Sakrament Pokuty</strong> – możliwość spowiedzi 30 minut
            przed każdą Mszą Świętą.
          </li>
          <li>
            <strong>Koronka do Miłosierdzia Bożego</strong> – 20 minut przed
            Eucharystią.
          </li>
          <li>
            <strong>Lektura „Dzienniczka” św. s. Faustyny</strong> – 10 minut
            przed Koronką.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Cotygodniowe nabożeństwa
        </h3>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>
            <strong>Wypominki za zmarłych</strong> – niedziela przed Mszą Świętą
            o 7:30 oraz 9:30.
          </li>
          <li>
            <strong>Godzinki o Niepokalanym Poczęciu NMP</strong> – niedziela o
            7:00.
          </li>
          <li>
            <strong>Nowenna do Matki Bożej Nieustającej Pomocy</strong> – środa
            na rozpoczęcie Mszy Świętej.
          </li>
          <li>
            <strong>Cykl kazań katechizmowych</strong> – podczas środowej Mszy
            Świętej.
          </li>
          <li>
            <strong>Droga Krzyżowa</strong> – po piątkowej Mszy Świętej (nie w
            każdy piątek).
          </li>
          <li>
            <strong>Różaniec</strong> – niedziela przed Mszą Świętą wieczorną.
          </li>
          <li>
            <strong>Godzina adoracji Pana Jezusa</strong> przez grupę
            intronizacyjną – piątek przed Mszą Świętą.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Comiesięczne nabożeństwa
        </h3>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>
            <strong>Adoracja Pana Jezusa w Najświętszym Sakramencie</strong> –
            1. niedziela miesiąca na każdej Mszy Świętej.
          </li>
          <li>
            <strong>Adoracja i modlitwa za kapłanów</strong> – 1. czwartek
            miesiąca, godzina przed Mszą Świętą.
          </li>
          <li>
            <strong>Nabożeństwo do Najświętszego Serca Pana Jezusa</strong> – 1.
            piątek miesiąca przed wystawionym Najświętszym Sakramentem.
          </li>
          <li>
            <strong>Różaniec do 7 boleści NMP</strong> – 45 minut przed Mszą
            Świętą w 1. piątek miesiąca.
          </li>
          <li>
            <strong>
              Cały Różaniec wynagradzający Niepokalanemu Poczęciu NMP
            </strong>{" "}
            – 1. sobota miesiąca przed wystawionym Najświętszym Sakramentem.
          </li>
          <li>
            <strong>Nabożeństwo do Miłosierdzia Bożego</strong> – 3. piątek
            miesiąca.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Coroczne nabożeństwa
        </h3>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>
            <strong>Droga Krzyżowa</strong> – każdy piątek w Wielkim Poście.
          </li>
          <li>
            <strong>Gorzkie Żale</strong> – każda niedziela w Wielkim Poście.
          </li>
          <li>
            <strong>Droga Krzyżowa ulicami parafii</strong> – jeden z piątków w
            Wielkim Poście.
          </li>
          <li>
            <strong>Nabożeństwa majowe</strong> – codziennie po Mszy Świętej w
            maju.
          </li>
          <li>
            <strong>Nabożeństwa do Najświętszego Serca Pana Jezusa</strong> –
            codziennie po Mszy Świętej w czerwcu.
          </li>
          <li>
            <strong>Nabożeństwa Różańcowe</strong> – codziennie w październiku.
          </li>
          <li>
            <strong>Roraty</strong> – w Adwencie.
          </li>
          <li>
            <strong>Nowenna do Dzieciątka Jezus</strong> – przed Bożym
            Narodzeniem.
          </li>
          <li>
            <strong>Całodobowa adoracja Pana Jezusa</strong> – 14–15
            października.
          </li>
        </ul>

        <p className="mt-6 text-lg text-gray-700">
          Serdecznie zapraszamy wszystkich parafian i gości do uczestnictwa w
          nabożeństwach. Wspólna modlitwa umacnia naszą wiarę i daje siłę do
          codziennego życia w bliskości z Bogiem.
        </p>
      </PageContainer>
    </div>
  );
}

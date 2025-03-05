import PageContainer from "@/components/layout/PageContainer";
import SectionTitle from "@/components/layout/SectionTitle";

export default function Counseling() {
  return (
    <div>
      <SectionTitle name="Poradnia życia rodzinnego" />
      <PageContainer>
        <p className="text-lg text-gray-700">
          Poradnia Życia Rodzinnego to miejsce, gdzie narzeczeni, małżonkowie
          oraz rodziny mogą uzyskać pomoc i wsparcie w budowaniu trwałych,
          opartych na wierze relacji. Nasza poradnia działa w duchu
          chrześcijańskich wartości, pomagając w przygotowaniu do sakramentu
          małżeństwa oraz w rozwiązywaniu problemów rodzinnych.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Dla kogo jest poradnia?
        </h3>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>
            <strong>Narzeczeni</strong> – przygotowanie do małżeństwa i nauki
            przedślubne.
          </li>
          <li>
            <strong>Małżonkowie</strong> – wsparcie w budowaniu relacji i
            rozwiązywaniu konfliktów.
          </li>
          <li>
            <strong>Rodziny</strong> – pomoc w wychowaniu dzieci i rozwoju
            duchowym.
          </li>
          <li>
            <strong>Osoby w kryzysie</strong> – rozmowy i wsparcie duchowe dla
            osób przeżywających trudności.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Jakie tematy poruszamy?
        </h3>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>Przygotowanie do sakramentu małżeństwa.</li>
          <li>Budowanie więzi i komunikacji w małżeństwie.</li>
          <li>Naturalne planowanie rodziny (NPR).</li>
          <li>Wychowanie dzieci w duchu chrześcijańskim.</li>
          <li>Przezwyciężanie kryzysów małżeńskich.</li>
          <li>Rola modlitwy i sakramentów w życiu rodziny.</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Kurs przedmałżeński
        </h3>
        <p className="text-lg text-gray-700">
          Narzeczeni przygotowujący się do zawarcia sakramentu małżeństwa są
          zobowiązani do uczestnictwa w naukach przedmałżeńskich. Spotkania
          odbywają się raz w miesiącu i obejmują tematykę duchowego,
          emocjonalnego i praktycznego przygotowania do życia w małżeństwie.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Jak skorzystać z poradni?
        </h3>
        <p className="text-lg text-gray-700">
          Poradnia działa przy naszej parafii i przyjmuje po wcześniejszym
          umówieniu spotkania. Osoby zainteresowane mogą zgłaszać się osobiście
          do kancelarii parafialnej lub kontaktować się telefonicznie.
        </p>

        <p className="mt-6 text-lg text-gray-700">
          Serdecznie zapraszamy wszystkich, którzy pragną budować swoje życie
          rodzinne na mocnym, chrześcijańskim fundamencie.
        </p>
      </PageContainer>
    </div>
  );
}

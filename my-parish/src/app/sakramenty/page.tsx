import PageContainer from "@/components/layout/PageContainer";
import SectionTitle from "@/components/layout/SectionTitle";

export default function Sacraments() {
  return (
    <div>
      <SectionTitle name="Sakramenty" className="mt-8"/>
      <PageContainer>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Sakramenty Święte
        </h2>

        <p className="text-lg text-gray-700">
          Sakramenty to widzialne znaki niewidzialnej łaski, ustanowione przez
          Jezusa Chrystusa i przekazane Kościołowi. W naszej parafii udzielamy
          siedmiu sakramentów, które prowadzą wiernych przez całe życie duchowe.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Chrzest Święty
        </h3>
        <p className="text-lg text-gray-700">
          Chrzest jest pierwszym i najważniejszym sakramentem, który włącza nas
          do wspólnoty Kościoła. Udzielany jest niemowlętom oraz osobom dorosłym
          po odpowiednim przygotowaniu.
        </p>
        <p className="text-lg text-gray-700">
          <strong>Wymagane dokumenty:</strong>
        </p>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>Akt urodzenia dziecka z USC.</li>
          <li>Świadectwo ślubu kościelnego rodziców.</li>
          <li>Zgoda z parafii chrzestnych na pełnienie tej funkcji.</li>
          <li>Biała szata i świeca chrzcielna.</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Sakrament Eucharystii (I Komunia Święta)
        </h3>
        <p className="text-lg text-gray-700">
          Pierwsza Komunia Święta jest uroczystym momentem przyjęcia Jezusa do
          serca w postaci Ciała i Krwi Pańskiej. Przygotowanie odbywa się
          podczas katechezy parafialnej.
        </p>
        <p className="text-lg text-gray-700">
          <strong>Wymagane dokumenty:</strong>
        </p>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>Świadectwo chrztu dziecka.</li>
          <li>Zaświadczenie o uczestnictwie w katechezie.</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Sakrament Bierzmowania
        </h3>
        <p className="text-lg text-gray-700">
          Bierzmowanie umacnia nas w wierze i wyposaża w dary Ducha Świętego,
          pomagając nam dojrzale przeżywać nasze chrześcijaństwo. Udzielane jest
          młodzieży i osobom dorosłym po odpowiednim przygotowaniu.
        </p>
        <p className="text-lg text-gray-700">
          <strong>Wymagane dokumenty:</strong>
        </p>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>Świadectwo chrztu.</li>
          <li>Zaświadczenie o uczestnictwie w katechezie.</li>
          <li>Zgoda świadka bierzmowania na pełnienie tej funkcji.</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Sakrament Małżeństwa
        </h3>
        <p className="text-lg text-gray-700">
          Małżeństwo to sakrament, w którym mężczyzna i kobieta zawierają święty
          związek przed Bogiem. Narzeczeni powinni zgłosić się do kancelarii
          parafialnej co najmniej 3 miesiące przed planowanym ślubem.
        </p>
        <p className="text-lg text-gray-700">
          <strong>Wymagane dokumenty:</strong>
        </p>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>Świadectwo chrztu (nie starsze niż 3 miesiące).</li>
          <li>Zaświadczenie o bierzmowaniu.</li>
          <li>Dowód osobisty.</li>
          <li>Świadectwo ukończenia kursu przedmałżeńskiego.</li>
          <li>Protokół małżeński.</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Sakrament Pokuty i Pojednania
        </h3>
        <p className="text-lg text-gray-700">
          Spowiedź święta daje wiernym możliwość oczyszczenia serca i pojednania
          się z Bogiem. Możliwość spowiedzi jest codziennie przed Mszą Świętą
          oraz w czasie nabożeństw pierwszopiątkowych.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Sakrament Namaszczenia Chorych
        </h3>
        <p className="text-lg text-gray-700">
          Sakrament Namaszczenia Chorych udzielany jest osobom poważnie chorym
          lub w podeszłym wieku, a także przed poważnymi operacjami. W naszej
          parafii organizujemy specjalne nabożeństwo dla chorych raz w roku oraz
          odwiedziny chorych w domach.
        </p>
        <p className="text-lg text-gray-700">
          <strong>Jak zgłosić potrzebę sakramentu?</strong>
          Rodzina chorego może zgłosić się do kancelarii parafialnej lub
          bezpośrednio do kapłana.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Sakrament Kapłaństwa
        </h3>
        <p className="text-lg text-gray-700">
          Kapłaństwo to sakrament, w którym mężczyźni zostają powołani do służby
          Bożej jako diakoni, prezbiterzy i biskupi. Każdy, kto czuje powołanie
          do służby w Kościele, powinien zgłosić się do seminarium duchownego po
          wcześniejszej rozmowie z proboszczem.
        </p>

        <p className="mt-6 text-lg text-gray-700">
          Wszystkich wiernych zachęcamy do pełnego uczestnictwa w sakramentalnym
          życiu Kościoła. W razie pytań dotyczących sakramentów prosimy o
          kontakt z kancelarią parafialną.
        </p>
      </PageContainer>
    </div>
  );
}

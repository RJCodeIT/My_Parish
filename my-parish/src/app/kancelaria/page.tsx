import PageContainer from "@/components/layout/PageContainer";
import SectionTitle from "@/components/layout/SectionTitle";

export default function Office() {
  return (
    <div>
      <SectionTitle name="Kancelaria" className="mt-8"/>
      <PageContainer>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Godziny urzędowania
        </h2>

        <p className="text-lg text-gray-700">
          Kancelaria parafialna jest czynna codziennie bezpośrednio po
          zakończeniu Mszy Świętej. W sprawach pilnych prosimy o wcześniejszy
          kontakt telefoniczny lub osobisty z duszpasterzem.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
          Potrzebne dokumenty
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Chrzest
        </h3>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>Akt urodzenia dziecka z USC.</li>
          <li>Świadectwo sakramentu małżeństwa rodziców.</li>
          <li>
            Zgoda chrzestnych z parafii zamieszkania na spełnianie tej funkcji.
          </li>
          <li>
            Świadectwo odbytego katechumenatu (w przypadku osób starszych).
          </li>
          <li>Biała szata i świeca chrzcielna.</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          I Komunia Święta
        </h3>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>Świadectwo chrztu.</li>
          <li>Świadectwo katechizacji.</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Bierzmowanie
        </h3>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>Świadectwo chrztu.</li>
          <li>Świadectwo katechizacji.</li>
          <li>Zgoda dla świadka bierzmowania z parafii zamieszkania.</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Małżeństwo
        </h3>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>Świadectwo chrztu do ślubu (nie starsze niż 3 miesiące).</li>
          <li>Zaświadczenie o bierzmowaniu.</li>
          <li>Dowód osobisty.</li>
          <li>Świadectwo katechizacji.</li>
          <li>Zaświadczenie o ukończeniu kursu przedmałżeńskiego.</li>
          <li>
            Protokół małżeński (spisywany co najmniej 3 miesiące przed ślubem).
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Pogrzeb chrześcijański
        </h3>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>Akt zgonu z USC.</li>
          <li>Potwierdzenie przyjęcia ostatnich sakramentów.</li>
          <li>
            Pogrzeb katolicki przysługuje wierzącym i praktykującym katolikom.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
          Księgi i segregatory w kancelarii
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Segregatory
        </h3>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>Dokumenty.</li>
          <li>Kuria.</li>
          <li>Umowy.</li>
          <li>Płatności.</li>
          <li>Gmina.</li>
          <li>Rady Parafialne.</li>
          <li>Inwentarz parafii.</li>
          <li>Budowa kościoła – projekty techniczne, mapki.</li>
          <li>Ogłoszenia parafialne (archiwalne).</li>
          <li>Dzienniki katechetyczne.</li>
          <li>Ochrona Danych Osobowych.</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Księgi parafialne
        </h3>
        <ul className="list-disc list-inside text-lg text-gray-700">
          <li>Chrzty – od 1842 roku.</li>
          <li>Śluby – od 1899 roku.</li>
          <li>Zgony – od 1886 roku.</li>
          <li>Księga bierzmowanych – od 1993 roku.</li>
          <li>Księga pierwszych komunii – od 2017 roku.</li>
          <li>Księga chorych – od 1916 roku.</li>
          <li>Księga darowizn na rzecz parafii.</li>
        </ul>

        <p className="mt-6 text-lg text-gray-700">
          Wszystkie dokumenty są starannie przechowywane w kancelarii
          parafialnej i udostępniane w razie potrzeby zgodnie z obowiązującymi
          przepisami. W przypadku pytań dotyczących dokumentacji prosimy o
          kontakt z kancelarią.
        </p>
      </PageContainer>
    </div>
  );
}

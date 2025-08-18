import PageContainer from "@/components/layout/PageContainer";
import Hero from "@/components/ui/Hero";

export default function History() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative">
        <Hero 
          imageUrl="/mojaParafia/KaplicaSwJana.jpg"
          quote="Pamiętaj o dniach minionych, rozważaj lata poprzednich pokoleń."
          source="Księga Powtórzonego Prawa 32:7"
          pageName="Historia kościoła"
          altText="Kościół parafialny"
        />
      </div>
      <PageContainer className="px-6 mt-8">
        <p className="text-lg text-gray-700">
          Historia naszego kościoła sięga <strong>XV wieku</strong>, kiedy to
          miejscowa ludność, kierowana głęboką wiarą i potrzebą wspólnej
          modlitwy, postanowiła wznieść pierwszą drewnianą kaplicę. W tamtych
          czasach społeczność parafialna była niewielka, ale pełna determinacji,
          by stworzyć miejsce kultu, które stanie się sercem życia religijnego i
          kulturalnego regionu.
        </p>

        <p className="mt-4 text-lg text-gray-700">
          Pierwsza świątynia, choć skromna, przez długie lata pełniła swoją
          rolę, aż do <strong>XVIII wieku</strong>, gdy została zastąpiona
          nowym, murowanym kościołem. Była to wielka zmiana dla parafii –
          budowla ta wyróżniała się piękną architekturą, charakterystyczną dla
          baroku, oraz bogato zdobionym wnętrzem, które przyciągało wiernych z
          pobliskich miejscowości.
        </p>

        <p className="mt-4 text-lg text-gray-700">
          Wiek <strong>XIX</strong> i <strong>XX</strong> przyniósł kolejne
          zmiany. W latach <strong>1875-1880</strong>
          dobudowano wieżę, która do dziś jest jednym z najbardziej
          rozpoznawalnych elementów naszej świątyni. W tym czasie do wnętrza
          trafiły również niezwykle cenne dzieła sztuki sakralnej – obrazy
          przedstawiające świętych patronów, a także rzeźbiony ołtarz główny,
          który jest jednym z najcenniejszych zabytków naszej parafii.
        </p>

        <p className="mt-4 text-lg text-gray-700">
          Okres <strong>II wojny światowej</strong> był dla naszej wspólnoty
          trudnym czasem. Kościół, choć nie został zniszczony, służył przez
          pewien czas jako magazyn wojskowy. Po zakończeniu wojny parafianie
          podjęli wysiłek przywrócenia świątyni do pierwotnej świetności,
          dokonując gruntownej renowacji wnętrza oraz elewacji.
        </p>

        <p className="mt-4 text-lg text-gray-700">
          Lata powojenne to okres rozwoju parafii – powstały nowe wspólnoty
          religijne, organizowano pielgrzymki, rekolekcje oraz wydarzenia
          charytatywne. W <strong>latach 70.</strong> przeprowadzono kolejną
          renowację, w tym wymianę dachówki, odnowienie fresków oraz konserwację
          drewnianych elementów wyposażenia.
        </p>

        <p className="mt-4 text-lg text-gray-700">
          Współczesność przyniosła kolejne zmiany – w <strong>2010 roku</strong>{" "}
          zakończono wielki remont kościoła, przywracając mu dawny blask. Dzięki
          wsparciu parafian i darczyńców udało się odrestaurować organy,
          zamontować nowoczesne ogrzewanie oraz oświetlenie, które podkreśla
          piękno wnętrza. Kościół stał się miejscem nie tylko modlitwy, ale
          także ważnym punktem kulturalnym – odbywają się tu koncerty muzyki
          sakralnej oraz wykłady historyczne.
        </p>

        <p className="mt-4 text-lg text-gray-700">
          Dziś nasza parafia to tętniąca życiem wspólnota, która łączy
          pokolenia. Organizujemy liczne wydarzenia, angażujemy się w pomoc
          potrzebującym i pielęgnujemy dziedzictwo, które zostawili nam nasi
          przodkowie. Historia naszego kościoła to historia ludzi – ich wiary,
          poświęcenia i troski o przyszłe pokolenia.
        </p>
      </PageContainer>
    </div>
  );
}

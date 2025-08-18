import PageContainer from "@/components/layout/PageContainer";
import Hero from "@/components/ui/Hero";

export default function Priests() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative">
        <Hero 
          imageUrl="/mojaParafia/KaplicaSwJana.jpg"
          quote="Idźcie więc i nauczajcie wszystkie narody, udzielając im chrztu w imię Ojca i Syna, i Ducha Świętego."
          source="Ewangelia wg św. Mateusza 28:19"
          pageName="Duszpasterze"
          altText="Kościół parafialny"
        />
      </div>
      <PageContainer className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Duszpasterze naszej parafii
        </h2>

        <p className="text-lg text-gray-700">
          Nasza parafia ma zaszczyt być prowadzona przez oddanych kapłanów,
          którzy każdego dnia służą wiernym, prowadząc liturgię, sakramenty oraz
          działalność duszpasterską.
        </p>

        <ul className="mt-4 list-disc list-inside text-lg text-gray-700">
          <li>
            <strong>Proboszcz:</strong> ks. Jan Kowalski – pełni swoją posługę
            od 2015 roku, dbając o rozwój duchowy parafii.
          </li>
          <li>
            <strong>Wikariusz:</strong> ks. Piotr Nowak – odpowiedzialny za
            katechezę młodzieży i organizację wydarzeń parafialnych.
          </li>
          <li>
            <strong>Rezydent:</strong> ks. Andrzej Wiśniewski – emerytowany
            kapłan, który wspomaga parafię w celebracji sakramentów.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">
          Kapłani i siostry zakonne pochodzące z naszej parafii
        </h2>

        <p className="text-lg text-gray-700">
          Nasza wspólnota parafialna wydała wielu wspaniałych kapłanów i siostry
          zakonne, którzy podjęli się służby Bogu w różnych częściach Polski i
          świata.
        </p>

        <ul className="mt-4 list-disc list-inside text-lg text-gray-700">
          <li>ks. Tomasz Zieliński – misjonarz pracujący w Afryce.</li>
          <li>ks. Mateusz Dąbrowski – duszpasterz akademicki w Krakowie.</li>
          <li>
            s. Anna Chmielewska – członkini Zgromadzenia Sióstr Miłosierdzia św.
            Wincentego à Paulo.
          </li>
          <li>
            s. Magdalena Król – pracuje wśród chorych i ubogich w Warszawie.
          </li>
        </ul>

        <p className="mt-6 text-lg text-gray-700">
          Wierzymy, że ich posługa jest owocem modlitwy i duchowego wsparcia
          naszej parafii. Nieustannie otaczamy ich naszą modlitwą i jesteśmy
          dumni, że pochodzą z naszej wspólnoty.
        </p>
      </PageContainer>
    </div>
  );
}

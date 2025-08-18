import PageContainer from "@/components/layout/PageContainer";
import Hero from "@/components/ui/Hero";

export default function Memorial() {
  const deceased = [
    "Jan Kowalski",
    "Maria Nowak",
    "Stanisław Wiśniewski",
    "Anna Zielińska",
    "Tadeusz Malinowski",
    "Zofia Kamińska",
    "Kazimierz Lewandowski",
    "Barbara Szymańska",
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative">
        <Hero 
          imageUrl="/mojaParafia/KaplicaSwJana.jpg"
          quote="Błogosławieni, którzy umierają w Panu. Zaiste, mowi Duch, niech odpoczną od swoich mozolów, bo idą wraz z nimi ich czyny."
          source="Apokalipsa św. Jana 14:13"
          pageName="Nasi zmarli"
          altText="Kościół parafialny"
        />
      </div>
      <PageContainer className="mt-8">
        <p className="text-lg text-gray-700 mb-6">
          Pamięć o naszych bliskich zmarłych jest ważnym elementem życia
          wspólnoty parafialnej. Nasz cmentarz parafialny znajduje się przy
          kościele i jest miejscem modlitwy oraz zadumy. Zachęcamy do
          odwiedzania grobów oraz do wspólnej modlitwy za zmarłych.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Lista zmarłych parafian
        </h3>
        <ul className="list-disc list-inside text-lg text-gray-700">
          {deceased.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>

        <p className="mt-6 text-lg text-gray-700">
          &quot;Wieczny odpoczynek racz im dać, Panie, a światłość wiekuista
          niechaj im świeci.&quot; Niech odpoczywają w pokoju wiecznym. Amen.
        </p>
      </PageContainer>
    </div>
  );
}

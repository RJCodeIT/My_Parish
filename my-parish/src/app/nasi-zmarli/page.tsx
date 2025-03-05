import PageContainer from "@/components/layout/PageContainer";
import SectionTitle from "@/components/layout/SectionTitle";

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
    <div>
      <SectionTitle name="Nasi zmarli" />
      <PageContainer>
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

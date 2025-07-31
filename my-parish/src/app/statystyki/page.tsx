import PageContainer from "@/components/layout/PageContainer";
import SectionTitle from "@/components/layout/SectionTitle";

const statistics = [
  { year: 2020, baptisms: 45, firstCommunions: 50, confirmations: 48, weddings: 20, funerals: 30, dominicantes: 500, comunicantes: 300, annualCommunions: 25000 },
  { year: 2021, baptisms: 40, firstCommunions: 52, confirmations: 47, weddings: 18, funerals: 35, dominicantes: 480, comunicantes: 310, annualCommunions: 26000 },
  { year: 2022, baptisms: 38, firstCommunions: 45, confirmations: 49, weddings: 25, funerals: 28, dominicantes: 470, comunicantes: 320, annualCommunions: 27000 },
  { year: 2023, baptisms: 42, firstCommunions: 53, confirmations: 51, weddings: 22, funerals: 33, dominicantes: 490, comunicantes: 330, annualCommunions: 28000 },
];

export default function Statistics() {
  return (
    <div>
      <SectionTitle name="Statystyki" className="mt-8"/>
      <PageContainer>
        <p className="text-lg text-gray-700 mb-6">
          Poniżej przedstawiamy statystyki dotyczące sakramentów oraz
          uczestnictwa wiernych w liturgii na przestrzeni ostatnich lat.
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Rok</th>
                <th className="px-4 py-2 border">Chrzty</th>
                <th className="px-4 py-2 border">I Komunia</th>
                <th className="px-4 py-2 border">Bierzmowanie</th>
                <th className="px-4 py-2 border">Śluby</th>
                <th className="px-4 py-2 border">Pogrzeby</th>
                <th className="px-4 py-2 border">Dominicantes</th>
                <th className="px-4 py-2 border">Comunicantes</th>
                <th className="px-4 py-2 border">Komunie / rok</th>
              </tr>
            </thead>
            <tbody>
              {statistics.map((stat) => (
                <tr key={stat.year} className="text-center">
                  <td className="px-4 py-2 border font-semibold">
                    {stat.year}
                  </td>
                  <td className="px-4 py-2 border">{stat.baptisms}</td>
                  <td className="px-4 py-2 border">{stat.firstCommunions}</td>
                  <td className="px-4 py-2 border">{stat.confirmations}</td>
                  <td className="px-4 py-2 border">{stat.weddings}</td>
                  <td className="px-4 py-2 border">{stat.funerals}</td>
                  <td className="px-4 py-2 border">{stat.dominicantes}</td>
                  <td className="px-4 py-2 border">{stat.comunicantes}</td>
                  <td className="px-4 py-2 border">{stat.annualCommunions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageContainer>
    </div>
  );
}

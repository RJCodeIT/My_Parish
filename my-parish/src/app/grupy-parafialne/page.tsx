import PageContainer from "@/components/layout/PageContainer";
import SectionTitle from "@/components/layout/SectionTitle";

export default function Groups() {
  return (
    <div>
      <SectionTitle name="Grupy parafialne" className="mt-8"/>
      <PageContainer>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Grupy parafialne
        </h2>

        <p className="text-lg text-gray-700">
          W naszej parafii działa wiele wspólnot, które umożliwiają wiernym
          pogłębianie relacji z Bogiem i aktywne uczestnictwo w życiu Kościoła.
          Każda z grup oferuje różne formy duchowości, modlitwy oraz
          zaangażowania w życie parafialne.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Ministranci i lektorzy
        </h3>
        <p className="text-lg text-gray-700">
          Ministranci i lektorzy pełnią ważną rolę podczas liturgii, służąc przy
          ołtarzu i pomagając w przebiegu Mszy Świętych. Chłopcy, którzy chcą
          dołączyć do tej grupy, mogą zgłaszać się do opiekuna – księdza
          wikariusza.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Schola parafialna
        </h3>
        <p className="text-lg text-gray-700">
          Schola parafialna ubogaca liturgię śpiewem i animuje modlitwę przez
          muzykę. Zapraszamy wszystkich, którzy lubią śpiewać i chcą wielbić
          Boga poprzez muzykę. Próby odbywają się w każdy piątek o 18:30.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Żywy Różaniec
        </h3>
        <p className="text-lg text-gray-700">
          Żywy Różaniec to wspólnota modlitewna, w której członkowie codziennie
          odmawiają jedną dziesiątkę różańca, modląc się w intencjach Kościoła i
          świata. Spotkania odbywają się raz w miesiącu po niedzielnej Mszy
          Świętej.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Ruch Światło-Życie (Oaza)
        </h3>
        <p className="text-lg text-gray-700">
          Oaza to wspólnota dla dzieci i młodzieży, której celem jest formacja
          duchowa i aktywne uczestnictwo w życiu parafii. Spotkania odbywają się
          w każdą sobotę o 17:00 w salce parafialnej.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Apostolat Maryjny
        </h3>
        <p className="text-lg text-gray-700">
          Wspólnota skupia osoby pragnące szerzyć kult Matki Bożej i pomagać
          potrzebującym. Spotkania odbywają się w pierwsze soboty miesiąca o
          16:00.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Caritas parafialny
        </h3>
        <p className="text-lg text-gray-700">
          Parafialny Caritas niesie pomoc osobom starszym, chorym i ubogim.
          Organizuje zbiórki żywności, odzieży oraz wsparcie dla potrzebujących.
          Spotkania wolontariuszy odbywają się w pierwszy wtorek miesiąca o
          18:30.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Grupa Biblijna
        </h3>
        <p className="text-lg text-gray-700">
          Wspólnota miłośników Pisma Świętego, którzy regularnie spotykają się,
          by pogłębiać znajomość Słowa Bożego. Spotkania odbywają się w czwartki
          po wieczornej Mszy Świętej.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          Grupa Mężczyzn Świętego Józefa
        </h3>
        <p className="text-lg text-gray-700">
          Grupa formacyjna dla mężczyzn, której celem jest budowanie
          chrześcijańskiej tożsamości i odpowiedzialności za rodzinę i Kościół.
          Spotkania odbywają się w drugi piątek miesiąca o 19:00.
        </p>

        <p className="mt-6 text-lg text-gray-700">
          Zapraszamy wszystkich, którzy chcą włączyć się w życie parafii i
          rozwijać swoją duchowość. Każdy może znaleźć miejsce dla siebie i
          służyć Bogu oraz wspólnocie według swoich talentów i powołania.
        </p>
      </PageContainer>
    </div>
  );
}

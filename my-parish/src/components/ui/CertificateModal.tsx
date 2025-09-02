import React from "react";
import { useAlerts } from "./Alerts";

export default function CertificateModal({ parishionerId, onClose }: { parishionerId: string; onClose?: () => void }) {
  const [step, setStep] = React.useState<1 | 2>(1);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string>("");
  const alerts = useAlerts();

  // Step 1: wybór typu (wartości muszą odpowiadać backendowi: baptism | confirmation | marriage)
  const [certificateType, setCertificateType] = React.useState<string>("");

  // Step 2: dane do zaświadczenia
  const [purpose, setPurpose] = React.useState<string>("");
  const [language, setLanguage] = React.useState<string>("PL");
  // Pola wspólne
  const [issuedAt, setIssuedAt] = React.useState<string>(new Date().toISOString().slice(0, 10)); // yyyy-mm-dd
  const [footerParishName, setFooterParishName] = React.useState<string>("");
  const [footerParishAddress, setFooterParishAddress] = React.useState<string>("");
  // Chrzest
  const [placeOfBirth, setPlaceOfBirth] = React.useState<string>("");
  const [fatherName, setFatherName] = React.useState<string>("");
  const [motherName, setMotherName] = React.useState<string>("");
  const [godfatherName, setGodfatherName] = React.useState<string>("");
  const [godmotherName, setGodmotherName] = React.useState<string>("");
  const [baptismParish, setBaptismParish] = React.useState<string>("");
  // Bierzmowanie
  const [confirmationParish, setConfirmationParish] = React.useState<string>("");
  // Małżeństwo
  const [marriageParish, setMarriageParish] = React.useState<string>("");
  const [spouse1, setSpouse1] = React.useState<string>("");
  const [spouse2, setSpouse2] = React.useState<string>("");
  const [witnesses, setWitnesses] = React.useState<string>("");

  const handleCancel = () => {
    alerts.showConfirmation(
      "Czy na pewno chcesz anulować generowanie zaświadczenia?",
      () => {
        onClose?.();
      }
    );
  };

  const handleNext = () => {
    if (!certificateType) {
      setError("Wybierz rodzaj zaświadczenia.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const details: Record<string, unknown> = {
        issuedAt: issuedAt ? new Date(issuedAt).toISOString() : new Date().toISOString(),
        footerParishName: footerParishName || undefined,
        footerParishAddress: footerParishAddress || undefined,
      };

      if (certificateType === "baptism") {
        Object.assign(details, {
          placeOfBirth: placeOfBirth || undefined,
          fatherName: fatherName || undefined,
          motherName: motherName || undefined,
          godfatherName: godfatherName || undefined,
          godmotherName: godmotherName || undefined,
          baptismParish: baptismParish || undefined,
        });
      } else if (certificateType === "confirmation") {
        Object.assign(details, {
          baptismParish: baptismParish || undefined,
          confirmationParish: confirmationParish || undefined,
        });
      } else if (certificateType === "marriage") {
        Object.assign(details, {
          marriageParish: marriageParish || undefined,
          spouse1: spouse1 || undefined,
          spouse2: spouse2 || undefined,
          witnesses: witnesses || undefined,
        });
      }

      const res = await fetch(`/mojaParafia/api/parishioners/${parishionerId}/certificates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: certificateType, // baptism | confirmation | marriage
          details,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Nie udało się wygenerować zaświadczenia");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      // Spróbuj odczytać nazwę pliku z nagłówka
      const cd = res.headers.get("Content-Disposition");
      const match = cd && /filename="?([^";]+)"?/i.exec(cd);
      a.href = url;
      a.download = match ? match[1] : `zaswiadczenie-${certificateType}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      onClose?.();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Wystąpił błąd";
      alerts.showError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-xl font-semibold text-gray-800 text-left">
            Generuj zaświadczenie
            <span className="sr-only"> dla parafianina o ID {parishionerId}</span>
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <span className={"px-2 py-1 rounded " + (step === 1 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600")}>1. Wybór</span>
            <span className="text-gray-400">/</span>
            <span className={"px-2 py-1 rounded " + (step === 2 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600")}>2. Dane</span>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6">
          {step === 1 ? (
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="certificateType">Rodzaj zaświadczenia</label>
              <select
                id="certificateType"
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={certificateType}
                onChange={(e) => setCertificateType(e.target.value)}
              >
                <option value="">— Wybierz —</option>
                <option value="baptism">Zaświadczenie o Chrzcie Świętym</option>
                <option value="confirmation">Zaświadczenie o Bierzmowaniu</option>
                <option value="marriage">Zaświadczenie o Zawarciu Małżeństwa</option>
              </select>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:justify-end">
                <button
                  type="button"
                  className="w-full sm:w-auto px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-60"
                  onClick={handleCancel}
                  disabled={submitting}
                >
                  Anuluj
                </button>
                <button
                  type="button"
                  className="w-full sm:w-auto px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
                  onClick={handleNext}
                  disabled={submitting}
                >
                  Dalej
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="purpose">Cel wydania</label>
                  <input
                    id="purpose"
                    type="text"
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="Np. do urzędu, do parafii narzeczonej/go..."
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="language">Język</label>
                  <select
                    id="language"
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="PL">Polski</option>
                    <option value="EN">English</option>
                  </select>
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="issuedAt">Data wystawienia</label>
                  <input
                    id="issuedAt"
                    type="date"
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={issuedAt}
                    onChange={(e) => setIssuedAt(e.target.value)}
                  />
                </div>

                {/* Pola zależne od typu zaświadczenia */}
                {certificateType === "baptism" && (
                  <>
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="placeOfBirth">Miejsce urodzenia</label>
                      <input id="placeOfBirth" type="text" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={placeOfBirth} onChange={(e) => setPlaceOfBirth(e.target.value)} />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="baptismParish">Parafia chrztu (nadpisz)</label>
                      <input id="baptismParish" type="text" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={baptismParish} onChange={(e) => setBaptismParish(e.target.value)} />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="fatherName">Imię i nazwisko ojca</label>
                      <input id="fatherName" type="text" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={fatherName} onChange={(e) => setFatherName(e.target.value)} />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="motherName">Imię i nazwisko matki</label>
                      <input id="motherName" type="text" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={motherName} onChange={(e) => setMotherName(e.target.value)} />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="godfatherName">Imię i nazwisko ojca chrzestnego</label>
                      <input id="godfatherName" type="text" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={godfatherName} onChange={(e) => setGodfatherName(e.target.value)} />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="godmotherName">Imię i nazwisko matki chrzestnej</label>
                      <input id="godmotherName" type="text" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={godmotherName} onChange={(e) => setGodmotherName(e.target.value)} />
                    </div>
                  </>
                )}

                {certificateType === "confirmation" && (
                  <>
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="baptismParish2">Parafia chrztu (nadpisz)</label>
                      <input id="baptismParish2" type="text" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={baptismParish} onChange={(e) => setBaptismParish(e.target.value)} />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="confirmationParish">Parafia bierzmowania (nadpisz)</label>
                      <input id="confirmationParish" type="text" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={confirmationParish} onChange={(e) => setConfirmationParish(e.target.value)} />
                    </div>
                  </>
                )}

                {certificateType === "marriage" && (
                  <>
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="marriageParish">Parafia ślubu (nadpisz)</label>
                      <input id="marriageParish" type="text" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={marriageParish} onChange={(e) => setMarriageParish(e.target.value)} />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="witnesses">Świadkowie</label>
                      <input id="witnesses" type="text" placeholder="Jan Kowalski, Anna Nowak" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={witnesses} onChange={(e) => setWitnesses(e.target.value)} />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="spouse1">Małżonek 1 (jeśli różny od parafianina)</label>
                      <input id="spouse1" type="text" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={spouse1} onChange={(e) => setSpouse1(e.target.value)} />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700" htmlFor="spouse2">Małżonek 2</label>
                      <input id="spouse2" type="text" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={spouse2} onChange={(e) => setSpouse2(e.target.value)} />
                    </div>
                  </>
                )}

                {/* Stopka parafii */}
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="footerParishName">Nazwa parafii (stopka)</label>
                  <input id="footerParishName" type="text" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={footerParishName} onChange={(e) => setFooterParishName(e.target.value)} />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="footerParishAddress">Adres parafii (stopka)</label>
                  <input id="footerParishAddress" type="text" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={footerParishAddress} onChange={(e) => setFooterParishAddress(e.target.value)} />
                </div>
                
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:justify-end">
                <button
                  type="button"
                  className="w-full sm:w-auto px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-60"
                  onClick={handleCancel}
                  disabled={submitting}
                >
                  Anuluj
                </button>
                <button
                  type="button"
                  className="w-full sm:w-auto px-4 py-2 text-sm rounded-md bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 disabled:opacity-60"
                  onClick={() => setStep(1)}
                  disabled={submitting}
                >
                  Wstecz
                </button>
                <button
                  type="button"
                  className="w-full sm:w-auto px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Generowanie..." : "Generuj zaświadczenie"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
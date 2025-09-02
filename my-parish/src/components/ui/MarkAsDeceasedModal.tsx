import React from "react";
import Input from "./Input";
import { useAlerts } from "./Alerts";

export default function MarkAsDeceasedModal({ parishionerId, onClose }: { parishionerId: string; onClose?: () => void }) {
  const alerts = useAlerts();
  const [step, setStep] = React.useState<1 | 2>(1);
  const [submitting, setSubmitting] = React.useState(false);

  // Step 1: Death data
  const [deceasedAt, setDeceasedAt] = React.useState<string>("");
  const [placeOfDeath, setPlaceOfDeath] = React.useState<string>("");
  const [deathCertificateNumber, setDeathCertificateNumber] = React.useState<string>("");
  const [deathCertificateIssuedBy, setDeathCertificateIssuedBy] = React.useState<string>("");
  const [deathReporterName, setDeathReporterName] = React.useState<string>("");
  const [deathReporterRelation, setDeathReporterRelation] = React.useState<string>("");
  const [deathReporterPhone, setDeathReporterPhone] = React.useState<string>("");
  const [deathNotes, setDeathNotes] = React.useState<string>("");

  // Step 2: Funeral data (optional)
  const [funeralDate, setFuneralDate] = React.useState<string>("");
  const [funeralLocation, setFuneralLocation] = React.useState<string>("");
  const [cemeteryName, setCemeteryName] = React.useState<string>("");
  const [cremation, setCremation] = React.useState<boolean>(false);
  const [officiant, setOfficiant] = React.useState<string>("");
  const [funeralNotes, setFuneralNotes] = React.useState<string>("");

  const [error, setError] = React.useState<string>("");

  const handleNext = () => {
    // Basic validation: deceasedAt is required
    if (!deceasedAt) {
      setError("Data zgonu jest wymagana.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!deceasedAt) {
      setError("Data zgonu jest wymagana.");
      setStep(1);
      return;
    }

    const payload = {
      deceased: {
        deceasedAt,
        placeOfDeath,
        deathCertificateNumber,
        deathCertificateIssuedBy,
        deathReporterName,
        deathReporterRelation,
        deathReporterPhone,
        deathNotes,
      },
      funeral: {
        funeralDate,
        funeralLocation,
        cemeteryName,
        cremation,
        officiant,
        funeralNotes,
      },
    };

    try {
      setSubmitting(true);
      const res = await fetch(`/mojaParafia/api/parishioners/${parishionerId}/deceased`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Nie udało się oznaczyć jako zmarłego");
      }
      alerts.showSuccess("Parafianin oznaczony jako zmarły");
      onClose?.();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Wystąpił błąd";
      alerts.showError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    alerts.showConfirmation(
      "Czy na pewno chcesz anulować rejestrację zgonu?",
      () => {
        onClose?.();
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-xl font-semibold text-gray-800 text-left">Rejestracja zgonu parafianina</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className={"px-2 py-1 rounded " + (step === 1 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600")}>1. Dane o zgonie</span>
            <span className="text-gray-400">/</span>
            <span className={"px-2 py-1 rounded " + (step === 2 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600")}>2. Dane o pogrzebie</span>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6">
          {step === 1 ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-1">
                  <Input
                    label="Data zgonu"
                    type="date"
                    name="deceasedAt"
                    value={deceasedAt}
                    onChange={(e) => setDeceasedAt(e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-1">
                  <Input
                    label="Miejsce zgonu"
                    type="text"
                    name="placeOfDeath"
                    value={placeOfDeath}
                    onChange={(e) => setPlaceOfDeath(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-1">
                  <Input
                    label="Nr aktu zgonu"
                    type="text"
                    name="deathCertificateNumber"
                    value={deathCertificateNumber}
                    onChange={(e) => setDeathCertificateNumber(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-1">
                  <Input
                    label="Wystawca aktu"
                    type="text"
                    name="deathCertificateIssuedBy"
                    value={deathCertificateIssuedBy}
                    onChange={(e) => setDeathCertificateIssuedBy(e.target.value)}
                  />
                </div>

                {/* Zgłaszający (opcjonalne) */}
                <div className="sm:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-700 mt-2">Zgłaszający (opcjonalne)</h3>
                </div>
                <div className="sm:col-span-1">
                  <Input
                    label="Imię i nazwisko"
                    type="text"
                    name="deathReporterName"
                    value={deathReporterName}
                    onChange={(e) => setDeathReporterName(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-1">
                  <Input
                    label="Relacja"
                    type="text"
                    name="deathReporterRelation"
                    value={deathReporterRelation}
                    onChange={(e) => setDeathReporterRelation(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-1">
                  <Input
                    label="Telefon"
                    type="tel"
                    name="deathReporterPhone"
                    value={deathReporterPhone}
                    onChange={(e) => setDeathReporterPhone(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Uwagi</label>
                  <textarea
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[90px]"
                    value={deathNotes}
                    onChange={(e) => setDeathNotes(e.target.value)}
                  />
                </div>
              </div>

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
                <div className="sm:col-span-1">
                  <Input
                    label="Data pogrzebu"
                    type="date"
                    name="funeralDate"
                    value={funeralDate}
                    onChange={(e) => setFuneralDate(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-1">
                  <Input
                    label="Miejsce liturgii"
                    type="text"
                    name="funeralLocation"
                    value={funeralLocation}
                    onChange={(e) => setFuneralLocation(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-1">
                  <Input
                    label="Cmentarz"
                    type="text"
                    name="cemeteryName"
                    value={cemeteryName}
                    onChange={(e) => setCemeteryName(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-1 flex items-center gap-2 mt-6 sm:mt-7">
                  <input
                    id="cremation"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={cremation}
                    onChange={(e) => setCremation(e.target.checked)}
                  />
                  <label htmlFor="cremation" className="text-sm font-medium text-gray-700">Kremacja</label>
                </div>
                <div className="sm:col-span-1">
                  <Input
                    label="Celebrans"
                    type="text"
                    name="officiant"
                    value={officiant}
                    onChange={(e) => setOfficiant(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Uwagi dot. pogrzebu</label>
                  <textarea
                    className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[90px]"
                    value={funeralNotes}
                    onChange={(e) => setFuneralNotes(e.target.value)}
                  />
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
                  className="w-full sm:w-auto px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Zapisywanie..." : "Oznacz jako zmarłego"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
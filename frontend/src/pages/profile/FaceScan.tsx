import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";
import { submitCriminalRecord } from "../../api/verifications";
import { uploadDocumentFromDataUrl } from "../../api/documents";
import { ApiClientError } from "../../api/client";

/**
 * Capture photo utilisee pour fournir le document "casier judiciaire" du
 * conducteur (a fournir dans le mois suivant l'inscription). Dans une vraie
 * integration, le fichier serait televerse vers un stockage d'objets ; ici on
 * envoie directement la capture (data URL) au backend, qui l'accepte comme
 * reference de document.
 */
export default function FaceScan() {
  const nav = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    async function start() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
        if (!active) { s.getTracks().forEach((t) => t.stop()); return; }
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          await videoRef.current.play();
        }
      } catch {
        setError("Impossible d'accéder à la caméra. Autorise l'accès dans le navigateur, ou saisis un lien de document ci-dessous.");
      }
    }
    start();
    return () => {
      active = false;
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopCamera() {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
  }

  function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    setCaptured(canvas.toDataURL("image/jpeg", 0.85));
  }

  async function handleSend() {
    if (!captured) return;
    setSubmitting(true);
    setError(null);
    try {
      const documentId = await uploadDocumentFromDataUrl("CRIMINAL_RECORD", captured);
      await submitCriminalRecord(documentId);
      stopCamera();
      nav("/profile/verifications");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Envoi impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell
      title="Casier judiciaire"
      subtitle="Photo du document • envoi direct à l'équipe de vérification"
      actions={[{ label: "Retour", href: "/profile/verifications", variant: "secondary" }]}
      nextApi={["POST /verifications/driver/criminal-record"]}
    >
      <Section title="Caméra">
        {error && <div className="rounded-xl border border-brand-red-200 bg-brand-red-50 p-3 text-sm text-brand-red-700 mb-4">{error}</div>}
        <div className="grid gap-4">
          <div className="rounded-2xl overflow-hidden border bg-black">
            <video ref={videoRef} className="w-full h-auto" playsInline />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button className="rounded-xl bg-brand-green-600 px-4 py-2 text-white font-semibold hover:bg-brand-green-700" onClick={capture}>
              Prendre la photo
            </button>
            <button className="rounded-xl border px-4 py-2 font-medium hover:bg-gray-50" onClick={() => setCaptured(null)}>
              Refaire
            </button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
          {captured && (
            <div className="rounded-2xl border bg-white p-4">
              <div className="text-sm font-semibold">Aperçu</div>
              <img src={captured} alt="Document capturé" className="mt-3 w-full max-w-md rounded-2xl border" />
              <button
                disabled={submitting}
                className="mt-4 rounded-xl bg-brand-green-600 px-4 py-2 text-white font-semibold hover:bg-brand-green-700 disabled:opacity-50"
                onClick={handleSend}
              >
                {submitting ? "Envoi…" : "Envoyer à l'équipe de vérification"}
              </button>
            </div>
          )}
        </div>
      </Section>
    </PageShell>
  );
}

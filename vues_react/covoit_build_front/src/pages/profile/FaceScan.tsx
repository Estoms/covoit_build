import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../../ui/PageShell";
import Section from "../../ui/Section";

export default function FaceScan() {
  const nav = useNavigate();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let active = true;

    async function start() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        if (!active) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }

        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          await videoRef.current.play();
        }
      } catch (e: any) {
        setError(
          "Impossible d’accéder à la caméra. Autorise l’accès caméra dans le navigateur."
        );
      }
    }

    start();

    return () => {
      active = false;
      // stop cam on unmount
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
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCaptured(dataUrl);
  }

  return (
    <PageShell
      title="Selfie (visage)"
      subtitle="Caméra directe • Version simple (photo) • Mock upload"
      actions={[{ label: "Retour", href: "/profile/verifications", variant: "secondary" }]}
      nextApi={["POST /verifications/face"]}
    >
      <Section title="Caméra">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="rounded-2xl overflow-hidden border bg-black">
              <video ref={videoRef} className="w-full h-auto" playsInline />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                className="rounded-xl bg-gray-900 px-4 py-2 text-white font-semibold hover:bg-gray-800"
                onClick={capture}
              >
                Prendre le selfie
              </button>

              <button
                className="rounded-xl border px-4 py-2 font-medium hover:bg-gray-50"
                onClick={() => {
                  setCaptured(null);
                }}
              >
                Refaire
              </button>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {captured && (
              <div className="rounded-2xl border bg-white p-4">
                <div className="text-sm font-semibold">Aperçu</div>
                <img
                  src={captured}
                  alt="Selfie capturé"
                  className="mt-3 w-full max-w-md rounded-2xl border"
                />

                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button
                    className="rounded-xl bg-gray-900 px-4 py-2 text-white font-semibold hover:bg-gray-800"
                    onClick={() => {
                      // MOCK : ici on enverrait captured (base64) au backend
                      stopCamera();
                      nav("/profile/verifications");
                    }}
                  >
                    Envoyer (mock)
                  </button>

                  <button
                    className="rounded-xl border px-4 py-2 font-medium hover:bg-gray-50"
                    onClick={() => nav("/profile/verifications")}
                  >
                    Annuler
                  </button>
                </div>

                <p className="mt-3 text-xs text-gray-500">
                  Astuce : bonne lumière, visage centré, pas de flou.
                </p>
              </div>
            )}
          </div>
        )}
      </Section>
    </PageShell>
  );
}

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

/**
 * Zobrazí inštaláciu iba na domovskej obrazovke, aby neprekrývala priebeh hry.
 * Chrome/Android dostane natívne okno inštalácie; iPhone dostane stručný návod
 * na „Pridať na plochu“, keďže Safari nepodporuje beforeinstallprompt.
 */
export function PwaInstallPrompt({ visible }: { visible: boolean }) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    setIos(isIOS());
    setInstalled(isStandalone());

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!visible || dismissed || installed || (!deferredPrompt && !ios)) {
    return null;
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
    }
    setDeferredPrompt(null);
  }

  return (
    <aside
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[120] mx-auto max-w-md rounded-2xl border border-violet-200/25 bg-[#11162a]/95 p-3 text-white shadow-2xl shadow-black/50 backdrop-blur-xl"
      aria-label="Inštalácia aplikácie"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-400/15 text-xl">
          🎭
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black">Maj Podvodníka vždy poruke</p>
          {ios ? (
            <p className="mt-0.5 text-xs leading-5 text-white/70">
              Ťukni na <span className="font-bold text-white">Zdieľať</span> a
              vyber{" "}
              <span className="font-bold text-white">Pridať na plochu</span>.
            </p>
          ) : (
            <p className="mt-0.5 text-xs leading-5 text-white/70">
              Nainštaluj si appku na plochu a spúšťaj ju ako bežnú aplikáciu.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="-mr-1 -mt-1 rounded-lg p-2 text-white/55 transition hover:bg-white/10 hover:text-white"
          aria-label="Zavrieť ponuku inštalácie"
        >
          ×
        </button>
      </div>
      {!ios && (
        <button
          type="button"
          onClick={install}
          className="mt-3 w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-sm font-black shadow-lg shadow-violet-950/50 transition active:scale-[0.98]"
        >
          Nainštalovať aplikáciu
        </button>
      )}
    </aside>
  );
}

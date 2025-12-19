import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("installPromptDismissed", "true");
  };

  if (!showPrompt || localStorage.getItem("installPromptDismissed")) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 md:left-auto md:right-24 md:w-96 animate-in slide-in-from-bottom-5">
      <Card className="p-4 shadow-2xl border-2 border-primary/20 bg-card/95 backdrop-blur">
        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon name="Sparkles" size={24} className="text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base mb-1">Установить приложение</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Быстрый доступ к каталогу с экрана телефона
            </p>
            <div className="flex gap-2">
              <Button onClick={handleInstall} size="sm" className="flex-1">
                <Icon name="Download" size={16} className="mr-2" />
                Установить
              </Button>
              <Button onClick={handleDismiss} variant="ghost" size="sm">
                <Icon name="X" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InstallPrompt;

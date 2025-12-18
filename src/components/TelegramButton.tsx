import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const TelegramButton = () => {
  return (
    <a
      href="https://t.me/hamm0n"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <Button
        size="lg"
        className="rounded-full w-14 h-14 shadow-2xl bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 border-2 border-primary-foreground/20 transition-all duration-300 hover:scale-110 hover:shadow-primary/50"
      >
        <Icon name="MessageCircle" size={24} className="text-primary-foreground" />
      </Button>
      <div className="absolute bottom-16 right-0 bg-card border border-border/50 rounded-lg px-4 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        <p className="text-sm font-medium">Связаться с менеджером</p>
        <p className="text-xs text-muted-foreground">@hamm0n</p>
      </div>
    </a>
  );
};

export default TelegramButton;

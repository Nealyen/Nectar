import type { ReactNode } from "react";
import { Sparkles, SlidersHorizontal, PanelBottom, Settings2 } from "lucide-react";

interface Step {
  icon: ReactNode;
  title: string;
  text: string;
  action?: { label: string; id: "control-center" | "settings" };
}

const STEPS: Step[] = [
  {
    icon: <Sparkles size={18} />,
    title: "Nectar'a Hoş Geldiniz",
    text: "Açmak için çentiğin üzerine gelin. Müzik, durum, takvim ve Kontrol Merkezi arasında geçiş yapmak için üzerinde kaydırın.",
  },
  {
    icon: <SlidersHorizontal size={18} />,
    title: "Kontrol Merkezi",
    text: "Wi-Fi, Bluetooth, ses ve parlaklık burada. Ağları ve cihazları görmek için Wi-Fi veya Bluetooth kutucuğundaki › simgesine tıklayın.",
    action: { label: "Aç", id: "control-center" },
  },
  {
    icon: <PanelBottom size={18} />,
    title: "Dock",
    text: "Sıralamayı değiştirmek için simgeleri sürükleyin, seçenekler için sağ tıklayın, yeni pencere açmak için orta tıklayın. Ayarlar > Dock bölümünden Görev Görünümü, sürücüler veya Geri Dönüşüm Kutusu ekleyin.",
  },
  {
    icon: <Settings2 size={18} />,
    title: "Kendinize göre uyarlayın",
    text: "Temalar, çentik ve dock modları ile monitör başına seçenekler Ayarlar'da. Klasik görünümü mü tercih ediyorsunuz? Ayarlar > Genel bölümünden Eski Mod'u açın.",
    action: { label: "Ayarları Aç", id: "settings" },
  },
];

interface Props {
  step: number;
  onStep: (next: number) => void;
  onClose: () => void;
  onAction: (id: "control-center" | "settings") => void;
}

export function NotchTour({ step, onStep, onClose, onAction }: Props) {
  const current = STEPS[step];
  const last = step === STEPS.length - 1;

  return (
    <div className="tour-content" onClick={(e) => e.stopPropagation()}>
      <div className="tour-head">
        <span className="tour-icon">{current.icon}</span>
        <span className="tour-title">{current.title}</span>
        <button className="tour-skip" onClick={onClose}>Atla</button>
      </div>
      <p className="tour-text">{current.text}</p>
      <div className="tour-foot">
        <span className="tour-dots">
          {STEPS.map((_, i) => (
            <i key={i} className={i === step ? "on" : ""} />
          ))}
        </span>
        {current.action && (
          <button className="tour-btn ghost" onClick={() => onAction(current.action!.id)}>
            {current.action.label}
          </button>
        )}
        {step > 0 && (
          <button className="tour-btn ghost" onClick={() => onStep(step - 1)}>Geri</button>
        )}
        <button className="tour-btn" onClick={() => (last ? onClose() : onStep(step + 1))}>
          {last ? "Bitti" : "İleri"}
        </button>
      </div>
    </div>
  );
}
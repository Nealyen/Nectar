import { Power, Download, Clock, History, BatteryWarning, RefreshCw, LogOut } from "lucide-react";
import { SettingRow } from "./SettingRow";

interface GeneralTabProps {
  autostart: boolean;
  toggleAutostart: () => void;
  timeFormat24h: boolean;
  toggleTimeFormat24h: () => void;
  legacyMode: boolean;
  toggleLegacyMode: () => void;
  showUpdateIndicator: boolean;
  toggleUpdateIndicator: () => void;
  lowBatteryThreshold: number;
  handleThresholdChange: (val: number) => void;
  restartNectar: () => void;
  quitNectar: () => void;
}

export function GeneralTab({
  autostart,
  toggleAutostart,
  timeFormat24h,
  toggleTimeFormat24h,
  legacyMode,
  toggleLegacyMode,
  showUpdateIndicator,
  toggleUpdateIndicator,
  lowBatteryThreshold,
  handleThresholdChange,
  restartNectar,
  quitNectar,
}: GeneralTabProps) {
  return (
    <>
      <div className="setting-group-label">Sistem</div>
      <div className="setting-group">
        <SettingRow icon={Power} label="Girişte Başlat" desc="Nectar'ı otomatik olarak aç">
          <label className="toggle-switch">
            <input type="checkbox" checked={autostart} onChange={toggleAutostart} />
            <span className="slider"></span>
          </label>
        </SettingRow>

        <SettingRow icon={Download} label="Güncelleme Göstergesi" desc="Güncelleme mevcut olduğunda yeşil nokta göster">
          <label className="toggle-switch">
            <input type="checkbox" checked={showUpdateIndicator} onChange={toggleUpdateIndicator} />
            <span className="slider"></span>
          </label>
        </SettingRow>

        <SettingRow icon={Clock} label="24 Saat Formatı" desc="24 saatlik saat biçimini kullan">
          <label className="toggle-switch">
            <input type="checkbox" checked={timeFormat24h} onChange={toggleTimeFormat24h} />
            <span className="slider"></span>
          </label>
        </SettingRow>

        <SettingRow
          icon={History}
          label="Eski Mod"
          desc="Klasik çentik ve dock'u koru. 1.4 sürümünden bu yana eklenen özellikleri kapatır"
        >
          <label className="toggle-switch">
            <input type="checkbox" checked={legacyMode} onChange={toggleLegacyMode} />
            <span className="slider"></span>
          </label>
        </SettingRow>

        <SettingRow
          icon={BatteryWarning}
          label="Düşük Pil Uyarısı"
          desc={`%${lowBatteryThreshold} seviyesinde tetikle`}
          divider={false}
        >
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={lowBatteryThreshold}
            onChange={(e) => handleThresholdChange(parseInt(e.target.value))}
            className="settings-slider"
          />
        </SettingRow>
      </div>

      <div className="setting-group-label">Uygulama</div>
      <div className="setting-group">
        <SettingRow icon={RefreshCw} label="Nectar'ı Yeniden Başlat" desc="Tüm bileşenleri yeniden başlat" action onClick={restartNectar} />
        <SettingRow icon={LogOut} label="Nectar'dan Çık" desc="Uygulamadan tamamen çık" action danger onClick={quitNectar} divider={false} />
      </div>
    </>
  );
}

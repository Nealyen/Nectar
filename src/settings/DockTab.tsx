import { useEffect, useState } from "react";
import type { ChangeEvent, CSSProperties } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Monitor, Eye, EyeOff, Circle, Search, Shuffle, MonitorCheck, CalendarDays, Maximize2, Keyboard, Sparkles, RotateCcw, LayoutGrid, Trash2, HardDrive, ChevronUp } from "lucide-react";
import { SettingRow } from "./SettingRow";
import { Dropdown } from "./Dropdown";
import type { MonitorInfo, MonitorMode } from "./types";
import { usePerMonitor } from "./usePerMonitor";

const START_ICON_PRESETS = [
  { key: "default", src: "/nectar.png", label: "Nectar" },
  { key: "windows", src: "/windows.png", label: "Windows" },
];

const startIconTileStyle = (active: boolean): CSSProperties => ({
  width: "48px",
  height: "48px",
  borderRadius: "12px",
  border: active ? "2px solid var(--nectar-accent, #007aff)" : "2px solid rgba(255,255,255,0.1)",
  background: active ? "rgba(0,122,255,0.15)" : "rgba(255,255,255,0.05)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.15s ease",
  padding: "6px",
  color: "rgba(255,255,255,0.5)",
});

interface DriveInfo {
  letter: string;
  label: string;
  removable: boolean;
}

interface DockTabProps {
  dockEnabled: boolean;
  toggleDock: () => void;
  dockMode: string;
  setDockModeValue: (mode: string) => void;
  dockPreviewEnabled: boolean;
  toggleDockPreview: () => void;
  dockSearchEnabled: boolean;
  toggleDockSearch: () => void;
  dockCalendarEnabled: boolean;
  toggleDockCalendar: () => void;
  legacyMode: boolean;
  dockTray: boolean;
  toggleDockTray: () => void;
  dockTaskView: boolean;
  toggleDockTaskView: () => void;
  dockRecycle: boolean;
  toggleDockRecycle: () => void;
  dockDrives: string[];
  toggleDockDrive: (letter: string) => void;
  dockIconOnly: boolean;
  toggleDockIconOnly: () => void;
  dockAdaptive: boolean;
  toggleDockAdaptive: () => void;
  startIcon: string;
  handleStartIconChange: (icon: string) => void;
  dockWinNumberEnabled: boolean;
  toggleDockWinNumber: () => void;
  dockMixedReorder: boolean;
  toggleDockMixedReorder: () => void;
  monitors: MonitorInfo[];
  dockMonitorMode: MonitorMode;
  setDockMonitorModeValue: (mode: MonitorMode) => void;
  dockMonitorId: string;
  setDockMonitorIdValue: (id: string) => void;
  dockModeByMonitor: Record<string, string>;
  setDockModeForMonitor: (monitorId: string, mode: string | null) => void;
  replaceDockModes: (next: Record<string, string>) => void;
}

export function DockTab({
  dockEnabled,
  toggleDock,
  dockMode,
  setDockModeValue,
  dockPreviewEnabled,
  toggleDockPreview,
  dockSearchEnabled,
  toggleDockSearch,
  dockCalendarEnabled,
  toggleDockCalendar,
  legacyMode,
  dockTray,
  toggleDockTray,
  dockTaskView,
  toggleDockTaskView,
  dockRecycle,
  toggleDockRecycle,
  dockDrives,
  toggleDockDrive,
  dockIconOnly,
  toggleDockIconOnly,
  dockAdaptive,
  toggleDockAdaptive,
  startIcon,
  handleStartIconChange,
  dockWinNumberEnabled,
  toggleDockWinNumber,
  dockMixedReorder,
  toggleDockMixedReorder,
  monitors,
  dockMonitorMode,
  setDockMonitorModeValue,
  dockMonitorId,
  setDockMonitorIdValue,
  dockModeByMonitor,
  setDockModeForMonitor,
  replaceDockModes,
}: DockTabProps) {
  const perMonitor = usePerMonitor(dockMode, dockModeByMonitor, replaceDockModes, monitors);
  const multiMonitor = dockMonitorMode === "all" && monitors.length > 1;
  const showPerMonitor = multiMonitor && perMonitor.enabled;
  const [drives, setDrives] = useState<DriveInfo[]>([]);

  useEffect(() => {
    invoke<DriveInfo[]>("get_drives").then(setDrives).catch(() => {});
  }, []);

  const handleStartIconUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      handleStartIconChange(`custom:${reader.result as string}`);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <>
      <div className="setting-group-label">Dock</div>
      <div className="setting-group">
        <SettingRow icon={Monitor} label="Nectar Dock" desc="Windows görev çubuğunu değiştir">
          <label className="toggle-switch">
            <input type="checkbox" checked={dockEnabled} onChange={toggleDock} />
            <span className="slider"></span>
          </label>
        </SettingRow>

        {dockEnabled && (
          <>
            {!showPerMonitor && (
              <SettingRow icon={dockMode === "fixed" ? EyeOff : Eye} label="Davranış" desc="Dock'un nasıl görüneceğini seçin">
                <Dropdown
                  value={dockMode}
                  onChange={setDockModeValue}
                  options={[
                    { value: "fixed", label: "Sabit" },
                    { value: "smart", label: "Akıllı" },
                    { value: "peek", label: "Gözat" },
                  ]}
                />
              </SettingRow>
            )}

            <SettingRow icon={MonitorCheck} label="Şurada Göster" desc="Dock'un hangi monitör(ler)de görüntüleneceğini seçin">
              <Dropdown
                value={dockMonitorMode}
                onChange={(v) => setDockMonitorModeValue(v as MonitorMode)}
                options={[
                  { value: "primary", label: "Birincil Monitör" },
                  { value: "all", label: "Tüm Monitörler" },
                  { value: "specific", label: "Belirli Monitör" },
                ]}
              />
            </SettingRow>

            {dockMonitorMode === "specific" && (
              <SettingRow icon={Monitor} label="Monitör" desc="Dock'un hangi ekranda gösterileceği">
                <Dropdown
                  value={dockMonitorId}
                  onChange={setDockMonitorIdValue}
                  placeholder={monitors.length === 0 ? "Yükleniyor..." : undefined}
                  options={monitors.map((m) => ({
                    value: m.id,
                    label: `${m.label}${m.is_primary ? " (Birincil)" : ""}`,
                  }))}
                />
              </SettingRow>
            )}

            {multiMonitor && (
              <SettingRow icon={Monitor} label="Monitör Başına Davranış" desc="Her monitör için farklı bir davranış ayarlayın">
                <label className="toggle-switch">
                  <input type="checkbox" checked={perMonitor.enabled} onChange={perMonitor.toggle} />
                  <span className="slider"></span>
                </label>
              </SettingRow>
            )}

            {showPerMonitor && monitors.map((m) => (
              <SettingRow key={m.id} icon={Monitor} label={`${m.label} Davranışı`} desc={m.is_primary ? "Birincil monitör" : undefined}>
                <Dropdown
                  value={dockModeByMonitor[m.id] || dockMode}
                  onChange={(v) => setDockModeForMonitor(m.id, v)}
                  options={[
                    { value: "fixed", label: "Sabit" },
                    { value: "smart", label: "Akıllı" },
                    { value: "peek", label: "Gözat" },
                  ]}
                />
              </SettingRow>
            ))}

            <SettingRow icon={Eye} label="Uygulama Önizlemelerini Göster" desc="Üzerine gelindiğinde pencere küçük resimlerini göster">
              <label className="toggle-switch">
                <input type="checkbox" checked={dockPreviewEnabled} onChange={toggleDockPreview} />
                <span className="slider"></span>
              </label>
            </SettingRow>

            <SettingRow icon={Search} label="Arama Simgesi" desc="Başlat'ın yanında bir Windows Arama kısayolu göster">
              <label className="toggle-switch">
                <input type="checkbox" checked={dockSearchEnabled} onChange={toggleDockSearch} />
                <span className="slider"></span>
              </label>
            </SettingRow>

            <SettingRow icon={CalendarDays} label="Takvim Simgesi" desc="Takvim penceresini açan bir kısayol göster">
              <label className="toggle-switch">
                <input type="checkbox" checked={dockCalendarEnabled} onChange={toggleDockCalendar} />
                <span className="slider"></span>
              </label>
            </SettingRow>

            {!legacyMode && (
              <>
                <SettingRow icon={ChevronUp} label="Gizli Simgeler Düğmesi" desc="Sistem tepsisi simgeleri açılır penceresini açan ^ düğmesini göster">
                  <label className="toggle-switch">
                    <input type="checkbox" checked={dockTray} onChange={toggleDockTray} />
                    <span className="slider"></span>
                  </label>
                </SettingRow>

                <SettingRow icon={LayoutGrid} label="Görev Görünümü Simgesi" desc="Başlat'ın yanında bir Görev Görünümü düğmesi göster">
                  <label className="toggle-switch">
                    <input type="checkbox" checked={dockTaskView} onChange={toggleDockTaskView} />
                    <span className="slider"></span>
                  </label>
                </SettingRow>

                <SettingRow icon={Trash2} label="Geri Dönüşüm Kutusu" desc="Geri Dönüşüm Kutusu'nu dock'ta göster">
                  <label className="toggle-switch">
                    <input type="checkbox" checked={dockRecycle} onChange={toggleDockRecycle} />
                    <span className="slider"></span>
                  </label>
                </SettingRow>

                {drives.map((d) => (
                  <SettingRow
                    key={d.letter}
                    icon={HardDrive}
                    label={`Sürücü ${d.letter}:`}
                    desc={d.label ? `${d.label}${d.removable ? " (çıkarılabilir)" : ""}` : d.removable ? "Çıkarılabilir sürücü" : "Yerel disk"}
                  >
                    <label className="toggle-switch">
                      <input type="checkbox" checked={dockDrives.includes(d.letter)} onChange={() => toggleDockDrive(d.letter)} />
                      <span className="slider"></span>
                    </label>
                  </SettingRow>
                ))}
              </>
            )}

            <SettingRow icon={Circle} label="Yalnızca Simge" desc="Simge arka planını ve dolguyu kaldır">
              <label className="toggle-switch">
                <input type="checkbox" checked={dockIconOnly} onChange={toggleDockIconOnly} />
                <span className="slider"></span>
              </label>
            </SettingRow>

            <SettingRow icon={Keyboard} label="Win+Sayı Kısayolları" desc="Sabitlenmiş uygulamaları Win+1 ile Win+9 arası tuşlarla aç">
              <label className="toggle-switch">
                <input type="checkbox" checked={dockWinNumberEnabled} onChange={toggleDockWinNumber} />
                <span className="slider"></span>
              </label>
            </SettingRow>

            {dockMode === "fixed" && (
              <SettingRow icon={Maximize2} label="Uyarlanabilir Mod" desc="Bir pencere tam ekran yapıldığında tam genişliğe uzat">
                <label className="toggle-switch">
                  <input type="checkbox" checked={dockAdaptive} onChange={toggleDockAdaptive} />
                  <span className="slider"></span>
                </label>
              </SettingRow>
            )}

            <SettingRow
              icon={Shuffle}
              label="Sabitlenmiş ve Çalışanları Karıştır"
              desc={dockMixedReorder ? "Simgeleri sabitlenmiş olsun olmasın istediğiniz yere sürükleyin" : "Sabitlenmiş ve çalışan simgeler ayrı gruplarda kalır"}
            >
              <label className="toggle-switch">
                <input type="checkbox" checked={dockMixedReorder} onChange={toggleDockMixedReorder} />
                <span className="slider"></span>
              </label>
            </SettingRow>

            <div className="setting-item" style={{ flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
                <div className="setting-icon-bg">
                  <Sparkles size={14} strokeWidth={1.5} />
                </div>
                <div className="setting-info">
                  <span className="setting-label">Başlat Menüsü Simgesi</span>
                  <span className="setting-desc">Dock başlat düğmesi simgesini seçin</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", paddingLeft: "34px" }}>
                {START_ICON_PRESETS.map((icon) => (
                  <div
                    key={icon.key}
                    onClick={() => handleStartIconChange(icon.key)}
                    style={startIconTileStyle(startIcon === icon.key)}
                    title={icon.label}
                  >
                    <img src={icon.src} alt={icon.label} style={{ width: "100%", height: "100%", objectFit: "contain" }} draggable={false} />
                  </div>
                ))}
                <div
                  onClick={() => document.getElementById("start-icon-file-input")?.click()}
                  style={startIconTileStyle(startIcon.startsWith("custom:"))}
                  title="Özel simge"
                >
                  {startIcon.startsWith("custom:") ? (
                    <img
                      src={startIcon.replace("custom:", "")}
                      alt="Özel"
                      style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "8px" }}
                      draggable={false}
                    />
                  ) : (
                    <span style={{ fontSize: "20px" }}>+</span>
                  )}
                </div>
                {startIcon !== "default" && (
                  <div onClick={() => handleStartIconChange("default")} style={startIconTileStyle(false)} title="Varsayılana sıfırla">
                    <RotateCcw size={18} strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <input
                id="start-icon-file-input"
                type="file"
                accept=".png,.ico,.jpg,.jpeg,.svg,.bmp"
                style={{ display: "none" }}
                onChange={handleStartIconUpload}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { emit } from "@tauri-apps/api/event";
import { Compass, Download, RefreshCw, FileDown, Upload, RotateCcw, Trash2, ClipboardCopy, FolderOpen, Crosshair, Image as ImageIcon } from "lucide-react";
import { SettingRow } from "./SettingRow";

interface AboutTabProps {
  appVersion: string;
  autoUpdate: boolean;
  toggleAutoUpdate: () => void;
  updateStatus: string;
  updateVersion: string;
  checkForUpdates: () => void;
  installUpdate: () => void;
  exportStatus: string;
  importStatus: string;
  handleExportSettings: () => void;
  handleImportSettings: () => void;
  resetStatus: string;
  handleResetSettings: () => void;
  uninstallStatus: string;
  uninstallError?: string;
  handleUninstallNectar: () => void;
}

export function AboutTab({
  appVersion,
  autoUpdate,
  toggleAutoUpdate,
  updateStatus,
  updateVersion,
  checkForUpdates,
  installUpdate,
  exportStatus,
  importStatus,
  handleExportSettings,
  handleImportSettings,
  resetStatus,
  handleResetSettings,
  uninstallStatus,
  uninstallError,
  handleUninstallNectar,
}: AboutTabProps) {
  const [diagStatus, setDiagStatus] = useState<"idle" | "working" | "copied" | "error">("idle");
  const [hitboxLogging, setHitboxLogging] = useState(false);
  const [iconStatus, setIconStatus] = useState<"idle" | "working" | "done" | "error">("idle");

  useEffect(() => {
    invoke<boolean>("get_hitbox_logging").then(setHitboxLogging).catch(() => {});
  }, []);

  const copyDiagnostics = async () => {
    setDiagStatus("working");
    try {
      const report = await invoke<string>("get_diagnostics");
      await navigator.clipboard.writeText(report);
      setDiagStatus("copied");
    } catch {
      setDiagStatus("error");
    }
    setTimeout(() => setDiagStatus("idle"), 2500);
  };

  const refreshIconCache = async () => {
    setIconStatus("working");
    try {
      await invoke("clear_icon_cache");
      setIconStatus("done");
    } catch {
      setIconStatus("error");
    }
    setTimeout(() => setIconStatus("idle"), 2500);
  };

  const getIconCacheLabel = () => {
    if (iconStatus === "working") return "Yenileniyor...";
    if (iconStatus === "done") return "Simgeler yenilendi!";
    if (iconStatus === "error") return "Simgeler yenilenemedi";
    return "Uygulama Simgelerini Yenile";
  };

  const toggleHitboxLogging = () => {
    const next = !hitboxLogging;
    setHitboxLogging(next);
    invoke("set_hitbox_logging", { enabled: next }).catch(() => setHitboxLogging(!next));
  };

  const getDiagLabel = () => {
    if (diagStatus === "working") return "Toplanıyor...";
    if (diagStatus === "copied") return "Panoya kopyalandı!";
    if (diagStatus === "error") return "Kopyalanamadı — bunun yerine günlük klasörünü açın";
    return "Tanılama Bilgilerini Kopyala";
  };

  const getUpdateLabel = () => {
    switch (updateStatus) {
      case "checking":
        return "Denetleniyor...";
      case "available":
        return `Güncelleme Mevcut (v${updateVersion})`;
      case "uptodate":
        return "Nectar güncel";
      case "downloading":
        return "Güncelleme İndiriliyor...";
      case "installing":
        return "Yükleniyor...";
      case "error":
        return "Güncelleme bulunamadı";
      default:
        return "Güncellemeleri Denetle";
    }
  };

  const getUpdateDesc = () =>
    updateStatus === "available" ? "Yüklemek ve yeniden başlatmak için tıklayın" : `Şu anda v${appVersion} çalışıyor`;

  const getPillLabel = () => {
    switch (updateStatus) {
      case "checking":
        return "Denetleniyor...";
      case "available":
        return `v${updateVersion} sürümüne güncelle`;
      case "uptodate":
        return "Güncel";
      case "downloading":
        return "İndiriliyor...";
      case "installing":
        return "Yükleniyor...";
      case "error":
        return "Denetimi yeniden dene";
      default:
        return "Güncellemeleri denetle";
    }
  };

  const pillBusy = ["checking", "downloading", "installing"].includes(updateStatus);

  const getExportLabel = () => {
    if (exportStatus === "exporting") return "Dışa aktarılıyor...";
    if (exportStatus === "success") return "Dışa aktarıldı!";
    return "Ayarları Dışa Aktar";
  };

  const getImportLabel = () => {
    if (importStatus === "importing") return "İçe aktarılıyor...";
    if (importStatus === "success") return "İçe aktarıldı!";
    return "Ayarları İçe Aktar";
  };

  const getResetLabel = () => {
    if (resetStatus === "resetting") return "Sıfırlanıyor...";
    if (resetStatus === "confirm") return "Onaylamak için Tekrar Tıklayın";
    return "Varsayılanlara Sıfırla";
  };

  const getResetDesc = () =>
    resetStatus === "confirm" ? "Bu işlem tüm ayarları siler — geri alınamaz" : "Tüm ayarları varsayılan değerlere döndür";

  const getUninstallLabel = () => {
    if (uninstallStatus === "uninstalling") return "Kaldırılıyor...";
    if (uninstallStatus === "confirm") return "Onaylamak için Tekrar Tıklayın";
    if (uninstallStatus === "error") return "Kaldırıcı Başlatılamadı";
    return "Nectar'ı Kaldır";
  };

  const getUninstallDesc = () => {
    if (uninstallStatus === "confirm") return "Bu işlem Nectar'ı bilgisayarınızdan kaldırır";
    if (uninstallStatus === "error") return uninstallError || "Tekrar deneyin veya Windows Ayarlar > Uygulamalar'ı kullanın";
    return "Windows Ayarları'nın açık olmasını gerektirmez";
  };


  return (
    <div className="about-tab-container">
      <div className="about-header">
        <img src="/nectar.png" className="about-logo" alt="Nectar Logo" />
        <h1 className="about-title">Nectar</h1>
        <p className="about-version">Sürüm {appVersion || "—"}</p>
        <button
          className={`update-pill update-pill--${updateStatus || "idle"}`}
          disabled={pillBusy}
          onClick={() => (updateStatus === "available" ? installUpdate() : checkForUpdates())}
        >
          {getPillLabel()}
        </button>
      </div>

      <div className="setting-group-label">Yazılım Güncellemeleri</div>
      <div className="setting-group">
        <SettingRow icon={Download} label="Otomatik Güncelleme" desc="Başlangıçta otomatik olarak güncelle">
          <label className="toggle-switch">
            <input type="checkbox" checked={autoUpdate} onChange={toggleAutoUpdate} />
            <span className="slider"></span>
          </label>
        </SettingRow>

        <SettingRow
          icon={RefreshCw}
          label={getUpdateLabel()}
          desc={getUpdateDesc()}
          action
          divider={false}
          onClick={() => (updateStatus === "available" ? installUpdate() : checkForUpdates())}
        />
      </div>

      <div className="setting-group-label setting-group-label--spaced">
        Veriler
      </div>
      <div className="setting-group">
        <SettingRow icon={Compass} label="Turu Yeniden İzle" desc="Çentiği, Denetim Merkezi'ni ve dock'u yeniden keşfedin" action onClick={() => emit("start-tour")} />
        <SettingRow icon={FileDown} label={getExportLabel()} desc="Ayarları bir dosyaya kaydet" action onClick={handleExportSettings} />
        <SettingRow icon={Upload} label={getImportLabel()} desc="Ayarları bir dosyadan yükle" action onClick={handleImportSettings} />
        <SettingRow
          icon={ImageIcon}
          label={getIconCacheLabel()}
          desc="Bir uygulama simgesi yanlış veya eksik görünüyorsa yeniden oku"
          action
          onClick={refreshIconCache}
        />
        <SettingRow
          icon={RotateCcw}
          label={getResetLabel()}
          desc={getResetDesc()}
          action
          divider={false}
          danger={resetStatus === "confirm"}
          onClick={handleResetSettings}
        />
      </div>

      <div className="setting-group-label setting-group-label--spaced">
        Tanılama
      </div>
      <div className="setting-group">
        <SettingRow
          icon={ClipboardCopy}
          label={getDiagLabel()}
          desc="Hata raporuna yapıştırmak için sistem bilgileri ve son günlük kaydı"
          action
          onClick={copyDiagnostics}
        />
        <SettingRow icon={FolderOpen} label="Günlük Klasörünü Aç" desc="nectar.log ve diagnostics.txt" action onClick={() => invoke("open_log_folder").catch(() => {})} />
        <SettingRow
          icon={Crosshair}
          label="Dock ve Çentik Tıklamalarını Günlüğe Kaydet"
          desc="Açın, birkaç saniye boyunca dock ve çentiğin üzerine gelin, ardından tanılama bilgilerini kopyalayın. Yeniden başlatmada sıfırlanır"
          divider={false}
        >
          <label className="toggle-switch">
            <input type="checkbox" checked={hitboxLogging} onChange={toggleHitboxLogging} />
            <span className="slider"></span>
          </label>
        </SettingRow>
      </div>

      <div className="setting-group-label setting-group-label--spaced">
        Tehlikeli Bölge
      </div>
      <div className="setting-group">
        <SettingRow
          icon={Trash2}
          label={getUninstallLabel()}
          desc={getUninstallDesc()}
          action
          divider={false}
          danger={uninstallStatus === "confirm" || uninstallStatus === "error"}
          onClick={handleUninstallNectar}
        />
      </div>

      <div className="about-footer">
        <p>kua8 tarafından ❤️ ile yapıldı</p>
      </div>
    </div>
  );
}
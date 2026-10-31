import { Volume2, Sun, ArrowLeftToLine, ArrowRightToLine } from "lucide-react";
import { SettingRow } from "./SettingRow";

interface OverlaysTabProps {
  volumeOverlayEnabled: boolean;
  toggleVolumeOverlay: () => void;
  volumeEdgeEnabled: boolean;
  toggleVolumeEdge: () => void;
  brightnessOverlayEnabled: boolean;
  toggleBrightnessOverlay: () => void;
  brightnessEdgeEnabled: boolean;
  toggleBrightnessEdge: () => void;
}

export function OverlaysTab({
  volumeOverlayEnabled,
  toggleVolumeOverlay,
  volumeEdgeEnabled,
  toggleVolumeEdge,
  brightnessOverlayEnabled,
  toggleBrightnessOverlay,
  brightnessEdgeEnabled,
  toggleBrightnessEdge,
}: OverlaysTabProps) {
  return (
    <>
      <div className="setting-group-label">Kaplamalar</div>
      <div className="setting-group">
        <SettingRow icon={Volume2} label="Ses HUD" desc="Nectar ses kaplaması">
          <label className="toggle-switch">
            <input type="checkbox" checked={volumeOverlayEnabled} onChange={toggleVolumeOverlay} />
            <span className="slider"></span>
          </label>
        </SettingRow>

        {volumeOverlayEnabled && (
          <SettingRow icon={ArrowLeftToLine} label="Kenar Üzerine Gelince Göster" desc="Sol kenardan kayarak açılır">
            <label className="toggle-switch">
              <input type="checkbox" checked={volumeEdgeEnabled} onChange={toggleVolumeEdge} />
              <span className="slider"></span>
            </label>
          </SettingRow>
        )}

        <SettingRow icon={Sun} label="Parlaklık HUD" desc="Nectar parlaklık kaplaması">
          <label className="toggle-switch">
            <input type="checkbox" checked={brightnessOverlayEnabled} onChange={toggleBrightnessOverlay} />
            <span className="slider"></span>
          </label>
        </SettingRow>

        {brightnessOverlayEnabled && (
          <SettingRow icon={ArrowRightToLine} label="Kenar Üzerine Gelince Göster" desc="Sağ kenardan kayarak açılır" divider={false}>
            <label className="toggle-switch">
              <input type="checkbox" checked={brightnessEdgeEnabled} onChange={toggleBrightnessEdge} />
              <span className="slider"></span>
            </label>
          </SettingRow>
        )}
      </div>
    </>
  );
}
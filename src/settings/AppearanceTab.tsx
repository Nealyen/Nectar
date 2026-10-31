import { Palette, Droplet, Contrast, Droplets, Sun, Square, Maximize2 } from "lucide-react";
import { SettingRow } from "./SettingRow";
import { Dropdown } from "./Dropdown";

interface AppearanceTabProps {
  themeMode: string;
  handleThemeModeChange: (mode: string) => void;
  themeColor: string;
  handleThemeColorChange: (color: string) => void;
  themeOpacity: number;
  handleOpacityChange: (val: number) => void;
  themeSaturation: number;
  handleSaturationChange: (val: number) => void;
  themeBrightness: number;
  handleBrightnessChange: (val: number) => void;
  cornersEnabled: boolean;
  toggleCorners: () => void;
  scale: number;
  handleScaleChange: (val: number) => void;
}

export function AppearanceTab({
  themeMode,
  handleThemeModeChange,
  themeColor,
  handleThemeColorChange,
  themeOpacity,
  handleOpacityChange,
  themeSaturation,
  handleSaturationChange,
  themeBrightness,
  handleBrightnessChange,
  cornersEnabled,
  toggleCorners,
  scale,
  handleScaleChange,
}: AppearanceTabProps) {
  const showCustomColor = themeMode === "custom";
  const showAdvancedSliders = themeMode === "custom" || themeMode === "adaptive";

  return (
    <>
      <div className="setting-group-label">Tema</div>
      <div className="setting-group">
        <SettingRow icon={Palette} label="Tema Modu" desc="Görsel stili yapılandırın">
          <Dropdown
            value={themeMode}
            onChange={handleThemeModeChange}
            options={[
              { value: "dark", label: "Koyu (Yarı Saydam)" },
              { value: "light", label: "Açık (Yarı Saydam)" },
              { value: "custom", label: "Özel Renk" },
              { value: "adaptive", label: "Uyarlanabilir Vurgu" },
            ]}
          />
        </SettingRow>

        {showCustomColor && (
          <SettingRow icon={Droplet} label="Özel Tema Rengi" desc="Arayüz arka plan rengini seçin">
            <div className="color-picker-row">
              <input
                type="color"
                value={themeColor}
                onChange={(e) => handleThemeColorChange(e.target.value)}
                className="color-picker-input"
              />
              <span className="color-picker-label">{themeColor.toUpperCase()}</span>
            </div>
          </SettingRow>
        )}

        <SettingRow
          icon={Contrast}
          label="Arka Plan Opaklığı"
          desc={`Tema saydamlığını ayarlayın (${Math.round(themeOpacity * 100)}%)`}
          divider={showAdvancedSliders}
        >
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={themeOpacity}
            onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
            className="settings-slider"
          />
        </SettingRow>

        {showAdvancedSliders && (
          <>
            <SettingRow
              icon={Droplets}
              label="Renk Doygunluğu"
              desc={`Tema rengi canlılığını ayarlayın (${Math.round(themeSaturation * 100)}%)`}
            >
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.02"
                value={themeSaturation}
                onChange={(e) => handleSaturationChange(parseFloat(e.target.value))}
                className="settings-slider"
              />
            </SettingRow>

            <SettingRow
              icon={Sun}
              label="Arka Plan Parlaklığı"
              desc={`Arka plan açıklığını ayarlayın (${Math.round(themeBrightness * 100)}%)`}
              divider={false}
            >
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.02"
                value={themeBrightness}
                onChange={(e) => handleBrightnessChange(parseFloat(e.target.value))}
                className="settings-slider"
              />
            </SettingRow>
          </>
        )}
      </div>

      <div className="setting-group-label">Görünüm</div>
      <div className="setting-group">
        <SettingRow icon={Square} label="Ekran Köşeleri" desc="Yuvarlatılmış üst kenarlar">
          <label className="toggle-switch">
            <input type="checkbox" checked={cornersEnabled} onChange={toggleCorners} />
            <span className="slider"></span>
          </label>
        </SettingRow>

        <SettingRow
          icon={Maximize2}
          label="Arayüz ve Yazı Tipi Ölçeği"
          desc={`Masaüstü boyutunu ayarlayın (${Math.round(scale * 100)}%)`}
          divider={false}
        >
          <div className="scale-button-container">
            <button
              onClick={() => handleScaleChange(Math.max(0.8, parseFloat((scale - 0.1).toFixed(1))))}
              disabled={scale <= 0.8}
              className="scale-adjust-btn"
              title="Ölçeği Azalt"
            >
              —
            </button>
            <span className="scale-display-value">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => handleScaleChange(Math.min(1.3, parseFloat((scale + 0.1).toFixed(1))))}
              disabled={scale >= 1.3}
              className="scale-adjust-btn"
              title="Ölçeği Artır"
            >
              +
            </button>
          </div>
        </SettingRow>
      </div>
    </>
  );
}
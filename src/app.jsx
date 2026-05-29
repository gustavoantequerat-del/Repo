// Root app — composes shell + screens + tweaks
import { createRoot } from 'react-dom/client';

const { useState: useStateApp, useEffect: useEffectApp } = React;
const {
  useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect,
  Sidebar, Topbar, Foot,
  ScreenOverview, ScreenPlatforms, ScreenCryptos, ScreenBanks,
  ScreenIndices, ScreenMerchants, ScreenAlerts, ScreenReports,
} = window;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "density": "comfortable",
  "tierAtStart": 2,
  "displayFont": "manrope"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useStateApp("overview");
  const [tier, setTier]   = useStateApp(t.tierAtStart);
  const [metricRange, setMetricRange] = useStateApp("12m");

  // Persisted alert rules + queue (shared between screens + sidebar badge)
  const D = window.BP2_DATA;
  const [rules, setRules]   = useStateApp(D.alertRulesSeed);
  const [alerts, setAlerts] = useStateApp(D.alertsSeed);

  // Apply theme/density to document
  useEffectApp(() => {
    document.documentElement.dataset.theme = t.theme;
    document.documentElement.dataset.density = t.density;
  }, [t.theme, t.density]);

  // Display font override
  useEffectApp(() => {
    let style = document.getElementById("__display-rule");
    if (!style) {
      style = document.createElement("style");
      style.id = "__display-rule";
      document.head.appendChild(style);
    }
    const fonts = {
      manrope: "Manrope, Inter, sans-serif",
      inter:   "Inter, sans-serif",
      serif:   `"Source Serif 4", Georgia, serif`,
    };
    style.textContent = `:root { --font-display: ${fonts[t.displayFont] || fonts.manrope}; }`;
  }, [t.displayFont]);

  const crumbs = ({
    overview: "Descripción general",
    platforms: "Plataformas",
    cryptos: "Criptoactivos",
    banks: "Rieles bancarios",
    indices: "Índices",
    merchants: "Comerciantes",
    alerts: "Alertas",
    reports: "Reportes",
  })[route];

  const accessibleAlertCount = alerts.filter(a => a.tier <= tier).length;

  let Screen = null;
  const rangeProps = { range: metricRange, setRange: setMetricRange };
  switch (route) {
    case "overview":   Screen = <ScreenOverview tier={tier} {...rangeProps} />; break;
    case "platforms":  Screen = <ScreenPlatforms tier={tier} {...rangeProps} />; break;
    case "cryptos":    Screen = <ScreenCryptos tier={tier} {...rangeProps} />; break;
    case "banks":      Screen = <ScreenBanks tier={tier} {...rangeProps} />; break;
    case "indices":    Screen = <ScreenIndices tier={tier} {...rangeProps} />; break;
    case "merchants":  Screen = <ScreenMerchants tier={tier} {...rangeProps} />; break;
    case "alerts":     Screen = <ScreenAlerts tier={tier} rules={rules} setRules={setRules} alerts={alerts} setAlerts={setAlerts} {...rangeProps} />; break;
    case "reports":    Screen = <ScreenReports tier={tier} {...rangeProps} />; break;
    default: Screen = <ScreenOverview tier={tier} {...rangeProps} />;
  }

  return (
    <div className="app">
      <Sidebar active={route} onSelect={setRoute} tier={tier} alertCount={route === "alerts" ? 0 : accessibleAlertCount} />
      <div>
        <Topbar tier={tier} setTier={setTier} crumbs={crumbs} />
        <main className="main">{Screen}</main>
        <Foot />
      </div>

      <TweaksPanel title="Tweaks · BP2PIM">
        <TweakSection label="Acceso" />
        <TweakRadio label="Tier" value={tier} onChange={setTier} options={[
          { label: "T1", value: 1 }, { label: "T2", value: 2 }, { label: "T3", value: 3 },
        ]} />

        <TweakSection label="Apariencia" />
        <TweakRadio label="Tema" value={t.theme} onChange={v => setTweak('theme', v)} options={[
          { label: "Claro", value: "light" }, { label: "Oscuro", value: "dark" },
        ]} />
        <TweakRadio label="Densidad" value={t.density} onChange={v => setTweak('density', v)} options={[
          { label: "Cómoda", value: "comfortable" }, { label: "Compacta", value: "compact" },
        ]} />
        <TweakSelect label="Display font" value={t.displayFont} onChange={v => setTweak('displayFont', v)} options={[
          { label: "Manrope (Figma)", value: "manrope" },
          { label: "Inter", value: "inter" },
          { label: "Serif editorial", value: "serif" },
        ]} />
      </TweaksPanel>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);

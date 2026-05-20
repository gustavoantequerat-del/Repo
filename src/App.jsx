import { useState, useEffect } from 'react';
import { Sidebar, Topbar, Foot } from './components/Shell.jsx';
import { TweaksPanel, TweakSection, TweakRadio, TweakSelect, useTweaks } from './components/TweaksPanel.jsx';
import { ScreenOverview } from './screens/ScreenOverview.jsx';
import { ScreenPlatforms } from './screens/ScreenPlatforms.jsx';
import { ScreenCryptos } from './screens/ScreenCryptos.jsx';
import { ScreenBanks } from './screens/ScreenBanks.jsx';
import { ScreenIndices } from './screens/ScreenIndices.jsx';
import { ScreenMerchants } from './screens/ScreenMerchants.jsx';
import { ScreenAlerts } from './screens/ScreenAlerts.jsx';
import { ScreenReports } from './screens/ScreenReports.jsx';
import { alertRulesSeed, alertsSeed } from './data.js';

const TWEAK_DEFAULTS = {
  theme: 'light',
  density: 'comfortable',
  tierAtStart: 2,
  displayFont: 'manrope',
};

export default function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useState('overview');
  const [tier, setTier] = useState(t.tierAtStart);
  const [rules, setRules] = useState(alertRulesSeed);
  const [alerts, setAlerts] = useState(alertsSeed);

  useEffect(() => {
    document.documentElement.dataset.theme = t.theme;
    document.documentElement.dataset.density = t.density;
  }, [t.theme, t.density]);

  useEffect(() => {
    let style = document.getElementById('__display-rule');
    if (!style) {
      style = document.createElement('style');
      style.id = '__display-rule';
      document.head.appendChild(style);
    }
    const fonts = {
      manrope: 'Manrope, Inter, sans-serif',
      inter:   'Inter, sans-serif',
      serif:   '"Source Serif 4", Georgia, serif',
    };
    style.textContent = `:root { --font-display: ${fonts[t.displayFont] || fonts.manrope}; }`;
  }, [t.displayFont]);

  const crumbs = {
    overview:  'Descripción general',
    platforms: 'Plataformas',
    cryptos:   'Criptoactivos',
    banks:     'Rieles bancarios',
    indices:   'Índices',
    merchants: 'Comerciantes',
    alerts:    'Alertas',
    reports:   'Reportes',
  }[route];

  const accessibleAlertCount = alerts.filter(a => a.tier <= tier).length;

  let Screen;
  switch (route) {
    case 'overview':  Screen = <ScreenOverview tier={tier} />; break;
    case 'platforms': Screen = <ScreenPlatforms tier={tier} />; break;
    case 'cryptos':   Screen = <ScreenCryptos tier={tier} />; break;
    case 'banks':     Screen = <ScreenBanks tier={tier} />; break;
    case 'indices':   Screen = <ScreenIndices tier={tier} />; break;
    case 'merchants': Screen = <ScreenMerchants tier={tier} />; break;
    case 'alerts':    Screen = <ScreenAlerts tier={tier} rules={rules} setRules={setRules} alerts={alerts} setAlerts={setAlerts} />; break;
    case 'reports':   Screen = <ScreenReports tier={tier} />; break;
    default:          Screen = <ScreenOverview tier={tier} />;
  }

  return (
    <div className="app">
      <Sidebar active={route} onSelect={setRoute} tier={tier} alertCount={route === 'alerts' ? 0 : accessibleAlertCount} />
      <div>
        <Topbar tier={tier} setTier={setTier} crumbs={crumbs} />
        <main className="main">{Screen}</main>
        <Foot />
      </div>

      <TweaksPanel title="Tweaks · BP2PIM">
        <TweakSection label="Acceso" />
        <TweakRadio label="Tier" value={tier} onChange={setTier} options={[
          { label: 'T1', value: 1 }, { label: 'T2', value: 2 }, { label: 'T3', value: 3 },
        ]} />

        <TweakSection label="Apariencia" />
        <TweakRadio label="Tema" value={t.theme} onChange={v => setTweak('theme', v)} options={[
          { label: 'Claro', value: 'light' }, { label: 'Oscuro', value: 'dark' },
        ]} />
        <TweakRadio label="Densidad" value={t.density} onChange={v => setTweak('density', v)} options={[
          { label: 'Cómoda', value: 'comfortable' }, { label: 'Compacta', value: 'compact' },
        ]} />
        <TweakSelect label="Display font" value={t.displayFont} onChange={v => setTweak('displayFont', v)} options={[
          { label: 'Manrope (Figma)', value: 'manrope' },
          { label: 'Inter',           value: 'inter' },
          { label: 'Serif editorial', value: 'serif' },
        ]} />
      </TweaksPanel>
    </div>
  );
}

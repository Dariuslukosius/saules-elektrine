"use client";

import * as React from "react";
import { Cookie, Settings2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function CookieBanner() {
  const [open, setOpen] = React.useState(false);
  const [settings, setSettings] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(false);
  const [marketing, setMarketing] = React.useState(false);

  React.useEffect(() => setOpen(!localStorage.getItem("ev-cookie-consent")), []);

  function save(value: { analytics: boolean; marketing: boolean }) {
    localStorage.setItem("ev-cookie-consent", JSON.stringify({ necessary: true, ...value, savedAt: new Date().toISOString() }));
    setOpen(false);
  }

  if (!open) return <button className="cookie-reopen" onClick={() => setOpen(true)} aria-label="Keisti slapukų nustatymus"><Cookie /></button>;
  return (
    <aside className="cookie-banner" aria-label="Slapukų pasirinkimas">
      <button className="cookie-close" onClick={() => save({ analytics: false, marketing: false })} aria-label="Uždaryti ir palikti tik būtinus slapukus"><X /></button>
      <div className="cookie-icon"><Cookie /></div>
      <div><h2>Jūsų privatumas – jūsų pasirinkimas</h2><p>Būtinus slapukus naudojame svetainės veikimui. Analitikos ir rinkodaros slapukai įjungiami tik gavus jūsų sutikimą.</p>
        {settings && <div className="cookie-settings"><label><Checkbox checked disabled /> <span><strong>Būtini</strong><small>Reikalingi krepšeliui, saugai ir pagrindinėms funkcijoms.</small></span></label><label><Checkbox checked={analytics} onCheckedChange={(value) => setAnalytics(Boolean(value))} /> <span><strong>Analitika</strong><small>Padeda suprasti svetainės naudojimą.</small></span></label><label><Checkbox checked={marketing} onCheckedChange={(value) => setMarketing(Boolean(value))} /> <span><strong>Rinkodara</strong><small>Leidžia matuoti kampanijų rezultatus.</small></span></label></div>}
        <div className="cookie-actions"><Button onClick={() => save({ analytics: true, marketing: true })}>Sutikti su visais</Button><Button variant="outline" onClick={() => save({ analytics: false, marketing: false })}>Tik būtini</Button><Button variant="ghost" onClick={() => setSettings((value) => !value)}><Settings2 /> Nustatymai</Button>{settings && <Button variant="outline" onClick={() => save({ analytics, marketing })}>Išsaugoti pasirinkimą</Button>}</div>
      </div>
    </aside>
  );
}

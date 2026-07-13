import { CircleMarker, MapContainer, Polyline, TileLayer, Tooltip } from "react-leaflet";
import type { ReportMapBlock, ReportMapLayer } from "../types";

interface Props {
  map: ReportMapBlock;
}

interface AlertFeature {
  country: string;
  lat: number;
  lon: number;
  alert_level: number;
  alert_label: string;
  partial: boolean;
}

interface OdaSummaryFeature {
  country: string;
  lat: number;
  lon: number;
  cumulative_usd_million: number;
}

interface KoreaOrgsFeature {
  country: string;
  lat: number;
  lon: number;
  count: number;
  orgs: { name: string; org_type: string | null }[];
}

interface ArcFeature {
  from: [number, number];
  to: [number, number];
  label: string;
  value_usd_million: number;
}

interface SimilarityLineFeature {
  from: [number, number];
  to: [number, number];
  label: string;
  similarity: number;
  target_country: string;
}

const ALERT_STYLE: Record<number, string> = {
  0: "#78909c",
  1: "#1e88e5",
  2: "#fbc02d",
  3: "#e53935",
  4: "#212121",
};

function AlertMarkersLayer({ layer }: { layer: ReportMapLayer }) {
  const features = layer.features as unknown as AlertFeature[];
  return (
    <>
      {features.map((f, i) => (
        <CircleMarker
          key={i}
          center={[f.lat, f.lon]}
          radius={10 + f.alert_level * 2}
          pathOptions={{ color: ALERT_STYLE[f.alert_level] ?? ALERT_STYLE[0], fillColor: ALERT_STYLE[f.alert_level] ?? ALERT_STYLE[0], fillOpacity: 0.5 }}
        >
          <Tooltip>
            {f.country} — {f.alert_level}단계 {f.alert_label}
            {f.partial ? " · 일부지역" : ""}
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
}

function AggMarkersLayer({ layer }: { layer: ReportMapLayer }) {
  const isOda = layer.id === "oda_summary";
  return (
    <>
      {isOda
        ? (layer.features as unknown as OdaSummaryFeature[]).map((f, i) => (
            <CircleMarker key={i} center={[f.lat, f.lon]} radius={12} pathOptions={{ color: "#1e88e5", fillColor: "#1e88e5", fillOpacity: 0.5 }}>
              <Tooltip>
                {f.country} ODA 누적 {f.cumulative_usd_million.toLocaleString()}백만$
              </Tooltip>
            </CircleMarker>
          ))
        : (layer.features as unknown as KoreaOrgsFeature[]).map((f, i) => (
            <CircleMarker key={i} center={[f.lat, f.lon]} radius={12} pathOptions={{ color: "#546e7a", fillColor: "#546e7a", fillOpacity: 0.5 }}>
              <Tooltip>
                <div>
                  <b>
                    {f.country} 한국기관 {f.count}곳
                  </b>
                  <ul className="mt-1 pl-3 list-disc">
                    {f.orgs.map((o, oi) => (
                      <li key={oi}>
                        {o.name}
                        {o.org_type ? ` (${o.org_type})` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
    </>
  );
}

function ArcLayer({ layer }: { layer: ReportMapLayer }) {
  const features = layer.features as unknown as ArcFeature[];
  return (
    <>
      {features.map((f, i) => (
        <Polyline
          key={i}
          positions={[f.from, f.to]}
          pathOptions={{ color: "#1a2980", weight: Math.max(2, Math.min(10, f.value_usd_million / 15000)), opacity: 0.7 }}
        >
          <Tooltip>
            {f.label}: {f.value_usd_million.toLocaleString()}백만$
          </Tooltip>
        </Polyline>
      ))}
    </>
  );
}

function SimilarityLinesLayer({ layer }: { layer: ReportMapLayer }) {
  const features = layer.features as unknown as SimilarityLineFeature[];
  return (
    <>
      {features.map((f, i) => (
        <Polyline
          key={i}
          positions={[f.from, f.to]}
          pathOptions={{ color: "#6a1b9a", weight: Math.max(1, f.similarity * 5), opacity: 0.6, dashArray: "8" }}
        >
          <Tooltip>
            {f.label} 유사도 {f.similarity}
          </Tooltip>
        </Polyline>
      ))}
    </>
  );
}

export default function ReportMap({ map }: Props) {
  return (
    <div className="relative isolate z-0 h-[420px] w-full rounded-xl overflow-hidden border border-navy-100">
      <MapContainer key={`${map.center.join(",")}-${map.zoom}`} center={map.center} zoom={map.zoom} className="h-full w-full" scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {map.layers.map((layer) => {
          if (layer.type === "alert_markers") return <AlertMarkersLayer key={layer.id} layer={layer} />;
          if (layer.type === "agg_markers") return <AggMarkersLayer key={layer.id} layer={layer} />;
          if (layer.type === "arc") return <ArcLayer key={layer.id} layer={layer} />;
          if (layer.type === "similarity_lines") return <SimilarityLinesLayer key={layer.id} layer={layer} />;
          return null;
        })}
      </MapContainer>
    </div>
  );
}

import { MapPin } from "lucide-react";

interface Props {
  country: string;
  isoCode: string;
}

export default function CountryMapPlaceholder({ country, isoCode }: Props) {
  return (
    <div className="relative h-40 rounded-xl border border-navy-100 bg-gradient-to-br from-navy-900 to-navy-700 overflow-hidden flex items-center justify-center">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="relative flex flex-col items-center text-white">
        <MapPin size={22} className="text-gold-400 mb-1.5" />
        <p className="text-sm font-semibold">{country}</p>
        <p className="text-[11px] text-navy-100/50 tracking-wider">{isoCode}</p>
      </div>
    </div>
  );
}

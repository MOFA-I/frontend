export interface CountryInfo {
  name: string;
  iso: string;
}

// 자연어 질문에서 국가명을 추출하기 위한 참조 목록 (데모용 주요국)
export const COUNTRIES: CountryInfo[] = [
  { name: "일본", iso: "JP" },
  { name: "중국", iso: "CN" },
  { name: "미국", iso: "US" },
  { name: "베트남", iso: "VN" },
  { name: "태국", iso: "TH" },
  { name: "필리핀", iso: "PH" },
  { name: "말레이시아", iso: "MY" },
  { name: "인도네시아", iso: "ID" },
  { name: "싱가포르", iso: "SG" },
  { name: "인도", iso: "IN" },
  { name: "독일", iso: "DE" },
  { name: "프랑스", iso: "FR" },
  { name: "영국", iso: "GB" },
  { name: "이탈리아", iso: "IT" },
  { name: "스페인", iso: "ES" },
  { name: "러시아", iso: "RU" },
  { name: "우크라이나", iso: "UA" },
  { name: "이스라엘", iso: "IL" },
  { name: "이집트", iso: "EG" },
  { name: "튀르키예", iso: "TR" },
  { name: "브라질", iso: "BR" },
  { name: "멕시코", iso: "MX" },
  { name: "캐나다", iso: "CA" },
  { name: "호주", iso: "AU" },
  { name: "뉴질랜드", iso: "NZ" },
  { name: "몽골", iso: "MN" },
  { name: "카자흐스탄", iso: "KZ" },
  { name: "아랍에미리트", iso: "AE" },
  { name: "사우디아라비아", iso: "SA" },
  { name: "미얀마", iso: "MM" },
  { name: "캄보디아", iso: "KH" },
  { name: "라오스", iso: "LA" },
];

export function extractCountry(text: string): CountryInfo | null {
  const found = COUNTRIES.find((c) => text.includes(c.name));
  return found ?? null;
}

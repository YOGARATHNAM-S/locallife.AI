
export enum AppMode {
  FOOD = 'FOOD',
  SLANG = 'SLANG',
  TRAFFIC = 'TRAFFIC',
  CULTURE = 'CULTURE'
}

export enum City {
  CHENNAI = 'chennai',
  BANGALORE = 'bangalore',
  DELHI = 'delhi',
  MUMBAI = 'mumbai',
  KOLKATA = 'kolkata',
  HYDERABAD = 'hyderabad',
  PUNE = 'pune',
  JAIPUR = 'jaipur',
  SHILLONG = 'shillong',
  KOCHI = 'kochi',
  AHMEDABAD = 'ahmedabad',
  LUCKNOW = 'lucknow',
  AMRITSAR = 'amritsar',
  VARANASI = 'varanasi',
  GOA = 'goa',
  PATNA = 'patna',
  INDORE = 'indore',
  CHANDIGARH = 'chandigarh',
  SRINAGAR = 'srinagar',
  GUWAHATI = 'guwahati',
  BHUBANESWAR = 'bhubaneswar',
  BHOPAL = 'bhopal',
  RAIPUR = 'raipur',
  RANCHI = 'ranchi',
  DEHRADUN = 'dehradun',
  SHIMLA = 'shimla',
  MYSORE = 'mysore',
  MADURAI = 'madurai',
  COIMBATORE = 'coimbatore',
  VIZAG = 'vizag',
  NAGPUR = 'nagpur',
  SURAT = 'surat',
  KANPUR = 'kanpur',
  AGRA = 'agra',
  RAJKOT = 'rajkot'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  city: City;
  mode: AppMode;
}

export interface CityContext {
  id: City;
  name: string;
  context: string;
  nativeGreeting: string;
  recommendedVoice: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
}

export interface VoiceSessionState {
  isActive: boolean;
  isConnecting: boolean;
  error: string | null;
}

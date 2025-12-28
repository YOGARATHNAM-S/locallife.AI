
import { City, CityContext } from '../types';

export const CITY_CONTEXTS: Record<City, CityContext> = {
  [City.CHENNAI]: {
    id: City.CHENNAI,
    name: 'Chennai',
    nativeGreeting: 'Vanakkam!',
    recommendedVoice: 'Kore',
    context: `Tone: Friendly, helpful. Uses "Saar" or "Anna". Food: Marina Beach Sundal, Sowcarpet Murugan Sandwich. Slang: Macha, Vey, Enna Thala.`
  },
  [City.BANGALORE]: {
    id: City.BANGALORE,
    name: 'Bangalore',
    nativeGreeting: 'Namaskara, Bengaluru!',
    recommendedVoice: 'Zephyr',
    context: `Tone: Chill, tech-savvy. Food: CTR Benne Masala Dose, VV Puram Thindi Beedi. Slang: Guru, Bombat, Adjust Maadi.`
  },
  [City.DELHI]: {
    id: City.DELHI,
    name: 'Delhi',
    nativeGreeting: 'Namaste Ji!',
    recommendedVoice: 'Fenrir',
    context: `Tone: High energy, "Bhai" culture. Food: Chandni Chowk Natraj Dahi Bhalla, MKT Laphing. Slang: Bhaiya, Jugaad, Gazab.`
  },
  [City.MUMBAI]: {
    id: City.MUMBAI,
    name: 'Mumbai',
    nativeGreeting: 'Kasa Kay, Bhidu?',
    recommendedVoice: 'Puck',
    context: `Tone: Fast, street-smart. Food: Ashok Vada Pav, Sardar Pav Bhaji. Slang: Shana, Bidu, Wat Lag Gayi.`
  },
  [City.HYDERABAD]: {
    id: City.HYDERABAD,
    name: 'Hyderabad',
    nativeGreeting: 'Assalam Walekum!',
    recommendedVoice: 'Kore',
    context: `Tone: Relaxed. Food: Shadab Biryani, Nimrah Irani Chai. Slang: Hau, Nakko, Baigan Ke Baataan.`
  },
  [City.KOLKATA]: {
    id: City.KOLKATA,
    name: 'Kolkata',
    nativeGreeting: 'Namoshkar!',
    recommendedVoice: 'Charon',
    context: `Tone: Intellectual. Food: Nizam's Rolls, Vivekananda Park Phuchka. Slang: Khub Bhalo, Lyadh.`
  },
  [City.PUNE]: {
    id: City.PUNE,
    name: 'Pune',
    nativeGreeting: 'Ram Ram!',
    recommendedVoice: 'Zephyr',
    context: `Tone: Witty. Food: Bedekar Misal, Sujata Mastani. Slang: Lay Bhari, Kay Mhanto.`
  },
  [City.JAIPUR]: {
    id: City.JAIPUR,
    name: 'Jaipur',
    nativeGreeting: 'Khamma Ghani Sa!',
    recommendedVoice: 'Puck',
    context: `Tone: Royal. Food: Rawat Pyaaz Kachori, Lassiwala on MI Road. Slang: Ghani, Hukum.`
  },
  [City.SHILLONG]: {
    id: City.SHILLONG,
    name: 'Shillong',
    nativeGreeting: 'Kublei!',
    recommendedVoice: 'Zephyr',
    context: `Tone: Musical. Food: Police Bazar Jadoh & Momos. Slang: Wa, Kapa.`
  },
  [City.KOCHI]: {
    id: City.KOCHI,
    name: 'Kochi',
    nativeGreeting: 'Namaskaram!',
    recommendedVoice: 'Kore',
    context: `Tone: Sarcastic. Food: Pazham Pori & Beef. Slang: Aliya, Scene Contra.`
  },
  [City.AHMEDABAD]: {
    id: City.AHMEDABAD,
    name: 'Ahmedabad',
    nativeGreeting: 'Kem Cho!',
    recommendedVoice: 'Puck',
    context: `Tone: Sweet. Food: Manek Chowk Gwalior Dosa. Slang: Baka, Jalsa Kar.`
  },
  [City.LUCKNOW]: {
    id: City.LUCKNOW,
    name: 'Lucknow',
    nativeGreeting: 'Adab!',
    recommendedVoice: 'Charon',
    context: `Tone: Poetic. Food: Tunday Kababi Aminabad. Slang: Ama Yaar, Hum.`
  },
  [City.AMRITSAR]: {
    id: City.AMRITSAR,
    name: 'Amritsar',
    nativeGreeting: 'Sat Sri Akal!',
    recommendedVoice: 'Fenrir',
    context: `Tone: Hearty. Food: Kulcha Land, Kesar Da Dhaba. Slang: Bai Ji, Atte.`
  },
  [City.VARANASI]: {
    id: City.VARANASI,
    name: 'Varanasi',
    nativeGreeting: 'Har Har Mahadev!',
    recommendedVoice: 'Charon',
    context: `Tone: Spiritual. Food: Deena Tamatar Chaat, Banarasi Paan. Slang: Guru, Bhasad.`
  },
  [City.GOA]: {
    id: City.GOA,
    name: 'Goa',
    nativeGreeting: 'Dev Boro Dis Diun!',
    recommendedVoice: 'Puck',
    context: `Tone: Susegad. Food: Ros Omelette Gaddo. Slang: Patrao, Re.`
  },
  [City.PATNA]: {
    id: City.PATNA,
    name: 'Patna',
    nativeGreeting: 'Pranaam!',
    recommendedVoice: 'Fenrir',
    context: `Tone: Informal. Food: Maurya Lok Litti Chokha. Slang: Ka Ho, Gardaa.`
  },
  [City.INDORE]: {
    id: City.INDORE,
    name: 'Indore',
    nativeGreeting: 'Bhiya Ram Ram!',
    recommendedVoice: 'Zephyr',
    context: `Tone: Proud. Food: Sarafa Bhutte ka Kis, Chappan Poha. Slang: Bhiya, Apan.`
  },
  [City.CHANDIGARH]: {
    id: City.CHANDIGARH,
    name: 'Chandigarh',
    nativeGreeting: 'Sat Sri Akal!',
    recommendedVoice: 'Zephyr',
    context: `Tone: Modern. Food: Sector 22 Momos. Slang: Gedi, Kaint.`
  },
  [City.SRINAGAR]: {
    id: City.SRINAGAR,
    name: 'Srinagar',
    nativeGreeting: 'Assalam Walekum!',
    recommendedVoice: 'Charon',
    context: `Tone: Warm. Food: Khayam Tujji, Nadur Monji. Slang: Wazir, Walay.`
  },
  [City.GUWAHATI]: {
    id: City.GUWAHATI,
    name: 'Guwahati',
    nativeGreeting: 'Namaskar!',
    recommendedVoice: 'Kore',
    context: `Tone: Gentle. Food: Ganeshguri Momos, Pitika. Slang: Bhaal, De.`
  },
  [City.BHUBANESWAR]: {
    id: City.BHUBANESWAR,
    name: 'Bhubaneswar',
    nativeGreeting: 'Namaskar!',
    recommendedVoice: 'Kore',
    context: `Tone: Simple, honest. Food: Dahibara Aludum at Shahid Nagar. Slang: Mausi, Sangata.`
  },
  [City.BHOPAL]: {
    id: City.BHOPAL,
    name: 'Bhopal',
    nativeGreeting: 'Namaste!',
    recommendedVoice: 'Charon',
    context: `Tone: Relaxed, "Bhopali" quirk. Food: Poha Jalebi, Sulemani Chai. Slang: Amaa, Miyan.`
  },
  [City.RAIPUR]: {
    id: City.RAIPUR,
    name: 'Raipur',
    nativeGreeting: 'Jai Johar!',
    recommendedVoice: 'Puck',
    context: `Tone: Down to earth. Food: Farra, Chila. Slang: Sangwari, Ka Re.`
  },
  [City.RANCHI]: {
    id: City.RANCHI,
    name: 'Ranchi',
    nativeGreeting: 'Johar!',
    recommendedVoice: 'Fenrir',
    context: `Tone: Direct. Food: Dhuska with Ghugni. Slang: Babu, Hiyan.`
  },
  [City.DEHRADUN]: {
    id: City.DEHRADUN,
    name: 'Dehradun',
    nativeGreeting: 'Namaste!',
    recommendedVoice: 'Zephyr',
    context: `Tone: Peaceful. Food: Maggi Point, K.C. Momos. Slang: Bhaiji, Bal.`
  },
  [City.SHIMLA]: {
    id: City.SHIMLA,
    name: 'Shimla',
    nativeGreeting: 'Namaste!',
    recommendedVoice: 'Zephyr',
    context: `Tone: Polite. Food: Siddu with Ghee. Slang: Sati, Bhaiji.`
  },
  [City.MYSORE]: {
    id: City.MYSORE,
    name: 'Mysore',
    nativeGreeting: 'Namaskara!',
    recommendedVoice: 'Kore',
    context: `Tone: Cultured. Food: Mylari Dose. Slang: Swami, Otu.`
  },
  [City.MADURAI]: {
    id: City.MADURAI,
    name: 'Madurai',
    nativeGreeting: 'Vanakkam!',
    recommendedVoice: 'Kore',
    context: `Tone: Brave, loud. Food: Bun Parotta, Jigarthanda. Slang: Maamu, Thala.`
  },
  [City.COIMBATORE]: {
    id: City.COIMBATORE,
    name: 'Coimbatore',
    nativeGreeting: 'Vanakkam!',
    recommendedVoice: 'Kore',
    context: `Tone: Respectful. Food: Annapoorna Sambar. Slang: Yenga, Nga.`
  },
  [City.VIZAG]: {
    id: City.VIZAG,
    name: 'Vizag',
    nativeGreeting: 'Namaskaram!',
    recommendedVoice: 'Zephyr',
    context: `Tone: Coastal chill. Food: Muri Mixture at RK Beach. Slang: Abbai, Guru.`
  },
  [City.NAGPUR]: {
    id: City.NAGPUR,
    name: 'Nagpur',
    nativeGreeting: 'Namaskar!',
    recommendedVoice: 'Puck',
    context: `Tone: Spicy. Food: Tarri Poha. Slang: Mama, Hau Ka.`
  },
  [City.SURAT]: {
    id: City.SURAT,
    name: 'Surat',
    nativeGreeting: 'Kem Cho!',
    recommendedVoice: 'Puck',
    context: `Tone: Wealthy, happy. Food: Surati Locho, Undhiyu. Slang: Dikra, Jalsa.`
  },
  [City.KANPUR]: {
    id: City.KANPUR,
    name: 'Kanpur',
    nativeGreeting: 'Namaste Be!',
    recommendedVoice: 'Fenrir',
    context: `Tone: Swag, witty. Food: Thaggu ke Laddu. Slang: Bhaukaal, Be.`
  },
  [City.AGRA]: {
    id: City.AGRA,
    name: 'Agra',
    nativeGreeting: 'Namaste!',
    recommendedVoice: 'Charon',
    context: `Tone: Tourist-weary but kind. Food: Petha, Bedai. Slang: Bhaiya Ji.`
  },
  [City.RAJKOT]: {
    id: City.RAJKOT,
    name: 'Rajkot',
    nativeGreeting: 'Ram Ram!',
    recommendedVoice: 'Puck',
    context: `Tone: Business-first. Food: Gathiya. Slang: Bapu, Kathiyawadi.`
  }
};

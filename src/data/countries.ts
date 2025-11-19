import type { Country } from '../types';

// Comprehensive list of all countries with proxy servers
// Note: Replace proxy.example.com with actual proxy servers
export const ALL_COUNTRIES: Country[] = [
  // North America
  { code: 'us', name: 'United States', flag: '🇺🇸', proxyServers: [
    { host: 'proxy-us-1.example.com', port: 8080, type: 'http' },
    { host: 'proxy-us-2.example.com', port: 3128, type: 'http' },
    { host: 'socks-us-1.example.com', port: 1080, type: 'socks5' }
  ]},
  { code: 'ca', name: 'Canada', flag: '🇨🇦', proxyServers: [
    { host: 'proxy-ca-1.example.com', port: 8080, type: 'http' },
    { host: 'proxy-ca-2.example.com', port: 3128, type: 'http' }
  ]},
  { code: 'mx', name: 'Mexico', flag: '🇲🇽', proxyServers: [
    { host: 'proxy-mx-1.example.com', port: 8080, type: 'http' }
  ]},

  // Europe
  { code: 'uk', name: 'United Kingdom', flag: '🇬🇧', proxyServers: [
    { host: 'proxy-uk-1.example.com', port: 8080, type: 'http' },
    { host: 'proxy-uk-2.example.com', port: 3128, type: 'http' }
  ]},
  { code: 'de', name: 'Germany', flag: '🇩🇪', proxyServers: [
    { host: 'proxy-de-1.example.com', port: 8080, type: 'http' },
    { host: 'proxy-de-2.example.com', port: 3128, type: 'http' }
  ]},
  { code: 'fr', name: 'France', flag: '🇫🇷', proxyServers: [
    { host: 'proxy-fr-1.example.com', port: 8080, type: 'http' },
    { host: 'proxy-fr-2.example.com', port: 3128, type: 'http' }
  ]},
  { code: 'it', name: 'Italy', flag: '🇮🇹', proxyServers: [
    { host: 'proxy-it-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'es', name: 'Spain', flag: '🇪🇸', proxyServers: [
    { host: 'proxy-es-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'nl', name: 'Netherlands', flag: '🇳🇱', proxyServers: [
    { host: 'proxy-nl-1.example.com', port: 8080, type: 'http' },
    { host: 'proxy-nl-2.example.com', port: 3128, type: 'http' }
  ]},
  { code: 'ch', name: 'Switzerland', flag: '🇨🇭', proxyServers: [
    { host: 'proxy-ch-1.example.com', port: 8080, type: 'http' },
    { host: 'proxy-ch-2.example.com', port: 3128, type: 'http' }
  ]},
  { code: 'se', name: 'Sweden', flag: '🇸🇪', proxyServers: [
    { host: 'proxy-se-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'no', name: 'Norway', flag: '🇳🇴', proxyServers: [
    { host: 'proxy-no-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'dk', name: 'Denmark', flag: '🇩🇰', proxyServers: [
    { host: 'proxy-dk-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'fi', name: 'Finland', flag: '🇫🇮', proxyServers: [
    { host: 'proxy-fi-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'pl', name: 'Poland', flag: '🇵🇱', proxyServers: [
    { host: 'proxy-pl-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'cz', name: 'Czech Republic', flag: '🇨🇿', proxyServers: [
    { host: 'proxy-cz-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'at', name: 'Austria', flag: '🇦🇹', proxyServers: [
    { host: 'proxy-at-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'be', name: 'Belgium', flag: '🇧🇪', proxyServers: [
    { host: 'proxy-be-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'ie', name: 'Ireland', flag: '🇮🇪', proxyServers: [
    { host: 'proxy-ie-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'pt', name: 'Portugal', flag: '🇵🇹', proxyServers: [
    { host: 'proxy-pt-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'gr', name: 'Greece', flag: '🇬🇷', proxyServers: [
    { host: 'proxy-gr-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'ru', name: 'Russia', flag: '🇷🇺', proxyServers: [
    { host: 'proxy-ru-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'ua', name: 'Ukraine', flag: '🇺🇦', proxyServers: [
    { host: 'proxy-ua-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'ro', name: 'Romania', flag: '🇷🇴', proxyServers: [
    { host: 'proxy-ro-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'hu', name: 'Hungary', flag: '🇭🇺', proxyServers: [
    { host: 'proxy-hu-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'bg', name: 'Bulgaria', flag: '🇧🇬', proxyServers: [
    { host: 'proxy-bg-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'hr', name: 'Croatia', flag: '🇭🇷', proxyServers: [
    { host: 'proxy-hr-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'sk', name: 'Slovakia', flag: '🇸🇰', proxyServers: [
    { host: 'proxy-sk-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'si', name: 'Slovenia', flag: '🇸🇮', proxyServers: [
    { host: 'proxy-si-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'lt', name: 'Lithuania', flag: '🇱🇹', proxyServers: [
    { host: 'proxy-lt-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'lv', name: 'Latvia', flag: '🇱🇻', proxyServers: [
    { host: 'proxy-lv-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'ee', name: 'Estonia', flag: '🇪🇪', proxyServers: [
    { host: 'proxy-ee-1.example.com', port: 8080, type: 'http' }
  ]},

  // Asia
  { code: 'cn', name: 'China', flag: '🇨🇳', proxyServers: [
    { host: 'proxy-cn-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'jp', name: 'Japan', flag: '🇯🇵', proxyServers: [
    { host: 'proxy-jp-1.example.com', port: 8080, type: 'http' },
    { host: 'proxy-jp-2.example.com', port: 3128, type: 'http' }
  ]},
  { code: 'kr', name: 'South Korea', flag: '🇰🇷', proxyServers: [
    { host: 'proxy-kr-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'in', name: 'India', flag: '🇮🇳', proxyServers: [
    { host: 'proxy-in-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'sg', name: 'Singapore', flag: '🇸🇬', proxyServers: [
    { host: 'proxy-sg-1.example.com', port: 8080, type: 'http' },
    { host: 'proxy-sg-2.example.com', port: 3128, type: 'http' }
  ]},
  { code: 'hk', name: 'Hong Kong', flag: '🇭🇰', proxyServers: [
    { host: 'proxy-hk-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'tw', name: 'Taiwan', flag: '🇹🇼', proxyServers: [
    { host: 'proxy-tw-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'th', name: 'Thailand', flag: '🇹🇭', proxyServers: [
    { host: 'proxy-th-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'my', name: 'Malaysia', flag: '🇲🇾', proxyServers: [
    { host: 'proxy-my-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'id', name: 'Indonesia', flag: '🇮🇩', proxyServers: [
    { host: 'proxy-id-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'ph', name: 'Philippines', flag: '🇵🇭', proxyServers: [
    { host: 'proxy-ph-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'vn', name: 'Vietnam', flag: '🇻🇳', proxyServers: [
    { host: 'proxy-vn-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'pk', name: 'Pakistan', flag: '🇵🇰', proxyServers: [
    { host: 'proxy-pk-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'bd', name: 'Bangladesh', flag: '🇧🇩', proxyServers: [
    { host: 'proxy-bd-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'lk', name: 'Sri Lanka', flag: '🇱🇰', proxyServers: [
    { host: 'proxy-lk-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'mm', name: 'Myanmar', flag: '🇲🇲', proxyServers: [
    { host: 'proxy-mm-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'kh', name: 'Cambodia', flag: '🇰🇭', proxyServers: [
    { host: 'proxy-kh-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'la', name: 'Laos', flag: '🇱🇦', proxyServers: [
    { host: 'proxy-la-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'kz', name: 'Kazakhstan', flag: '🇰🇿', proxyServers: [
    { host: 'proxy-kz-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'uz', name: 'Uzbekistan', flag: '🇺🇿', proxyServers: [
    { host: 'proxy-uz-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'sa', name: 'Saudi Arabia', flag: '🇸🇦', proxyServers: [
    { host: 'proxy-sa-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'ae', name: 'United Arab Emirates', flag: '🇦🇪', proxyServers: [
    { host: 'proxy-ae-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'il', name: 'Israel', flag: '🇮🇱', proxyServers: [
    { host: 'proxy-il-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'tr', name: 'Turkey', flag: '🇹🇷', proxyServers: [
    { host: 'proxy-tr-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'ir', name: 'Iran', flag: '🇮🇷', proxyServers: [
    { host: 'proxy-ir-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'iq', name: 'Iraq', flag: '🇮🇶', proxyServers: [
    { host: 'proxy-iq-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'jo', name: 'Jordan', flag: '🇯🇴', proxyServers: [
    { host: 'proxy-jo-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'lb', name: 'Lebanon', flag: '🇱🇧', proxyServers: [
    { host: 'proxy-lb-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'eg', name: 'Egypt', flag: '🇪🇬', proxyServers: [
    { host: 'proxy-eg-1.example.com', port: 8080, type: 'http' }
  ]},

  // Oceania
  { code: 'au', name: 'Australia', flag: '🇦🇺', proxyServers: [
    { host: 'proxy-au-1.example.com', port: 8080, type: 'http' },
    { host: 'proxy-au-2.example.com', port: 3128, type: 'http' }
  ]},
  { code: 'nz', name: 'New Zealand', flag: '🇳🇿', proxyServers: [
    { host: 'proxy-nz-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'fj', name: 'Fiji', flag: '🇫🇯', proxyServers: [
    { host: 'proxy-fj-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'pg', name: 'Papua New Guinea', flag: '🇵🇬', proxyServers: [
    { host: 'proxy-pg-1.example.com', port: 8080, type: 'http' }
  ]},

  // South America
  { code: 'br', name: 'Brazil', flag: '🇧🇷', proxyServers: [
    { host: 'proxy-br-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'ar', name: 'Argentina', flag: '🇦🇷', proxyServers: [
    { host: 'proxy-ar-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'cl', name: 'Chile', flag: '🇨🇱', proxyServers: [
    { host: 'proxy-cl-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'co', name: 'Colombia', flag: '🇨🇴', proxyServers: [
    { host: 'proxy-co-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'pe', name: 'Peru', flag: '🇵🇪', proxyServers: [
    { host: 'proxy-pe-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 've', name: 'Venezuela', flag: '🇻🇪', proxyServers: [
    { host: 'proxy-ve-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'ec', name: 'Ecuador', flag: '🇪🇨', proxyServers: [
    { host: 'proxy-ec-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'uy', name: 'Uruguay', flag: '🇺🇾', proxyServers: [
    { host: 'proxy-uy-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'py', name: 'Paraguay', flag: '🇵🇾', proxyServers: [
    { host: 'proxy-py-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'bo', name: 'Bolivia', flag: '🇧🇴', proxyServers: [
    { host: 'proxy-bo-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'gy', name: 'Guyana', flag: '🇬🇾', proxyServers: [
    { host: 'proxy-gy-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'sr', name: 'Suriname', flag: '🇸🇷', proxyServers: [
    { host: 'proxy-sr-1.example.com', port: 8080, type: 'http' }
  ]},

  // Africa
  { code: 'za', name: 'South Africa', flag: '🇿🇦', proxyServers: [
    { host: 'proxy-za-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'ng', name: 'Nigeria', flag: '🇳🇬', proxyServers: [
    { host: 'proxy-ng-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'ke', name: 'Kenya', flag: '🇰🇪', proxyServers: [
    { host: 'proxy-ke-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'gh', name: 'Ghana', flag: '🇬🇭', proxyServers: [
    { host: 'proxy-gh-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'tz', name: 'Tanzania', flag: '🇹🇿', proxyServers: [
    { host: 'proxy-tz-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'ug', name: 'Uganda', flag: '🇺🇬', proxyServers: [
    { host: 'proxy-ug-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'et', name: 'Ethiopia', flag: '🇪🇹', proxyServers: [
    { host: 'proxy-et-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'ma', name: 'Morocco', flag: '🇲🇦', proxyServers: [
    { host: 'proxy-ma-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'dz', name: 'Algeria', flag: '🇩🇿', proxyServers: [
    { host: 'proxy-dz-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'tn', name: 'Tunisia', flag: '🇹🇳', proxyServers: [
    { host: 'proxy-tn-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'ly', name: 'Libya', flag: '🇱🇾', proxyServers: [
    { host: 'proxy-ly-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'sd', name: 'Sudan', flag: '🇸🇩', proxyServers: [
    { host: 'proxy-sd-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'zw', name: 'Zimbabwe', flag: '🇿🇼', proxyServers: [
    { host: 'proxy-zw-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'zm', name: 'Zambia', flag: '🇿🇲', proxyServers: [
    { host: 'proxy-zm-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'mw', name: 'Malawi', flag: '🇲🇼', proxyServers: [
    { host: 'proxy-mw-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'mz', name: 'Mozambique', flag: '🇲🇿', proxyServers: [
    { host: 'proxy-mz-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'ao', name: 'Angola', flag: '🇦🇴', proxyServers: [
    { host: 'proxy-ao-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'cm', name: 'Cameroon', flag: '🇨🇲', proxyServers: [
    { host: 'proxy-cm-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'ci', name: 'Ivory Coast', flag: '🇨🇮', proxyServers: [
    { host: 'proxy-ci-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'sn', name: 'Senegal', flag: '🇸🇳', proxyServers: [
    { host: 'proxy-sn-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'ml', name: 'Mali', flag: '🇲🇱', proxyServers: [
    { host: 'proxy-ml-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'bf', name: 'Burkina Faso', flag: '🇧🇫', proxyServers: [
    { host: 'proxy-bf-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'ne', name: 'Niger', flag: '🇳🇪', proxyServers: [
    { host: 'proxy-ne-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'td', name: 'Chad', flag: '🇹🇩', proxyServers: [
    { host: 'proxy-td-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'so', name: 'Somalia', flag: '🇸🇴', proxyServers: [
    { host: 'proxy-so-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'er', name: 'Eritrea', flag: '🇪🇷', proxyServers: [
    { host: 'proxy-er-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'dj', name: 'Djibouti', flag: '🇩🇯', proxyServers: [
    { host: 'proxy-dj-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'mu', name: 'Mauritius', flag: '🇲🇺', proxyServers: [
    { host: 'proxy-mu-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'sc', name: 'Seychelles', flag: '🇸🇨', proxyServers: [
    { host: 'proxy-sc-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'mg', name: 'Madagascar', flag: '🇲🇬', proxyServers: [
    { host: 'proxy-mg-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 're', name: 'Réunion', flag: '🇷🇪', proxyServers: [
    { host: 'proxy-re-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'bi', name: 'Burundi', flag: '🇧🇮', proxyServers: [
    { host: 'proxy-bi-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'rw', name: 'Rwanda', flag: '🇷🇼', proxyServers: [
    { host: 'proxy-rw-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'ss', name: 'South Sudan', flag: '🇸🇸', proxyServers: [
    { host: 'proxy-ss-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'cf', name: 'Central African Republic', flag: '🇨🇫', proxyServers: [
    { host: 'proxy-cf-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'cd', name: 'DR Congo', flag: '🇨🇩', proxyServers: [
    { host: 'proxy-cd-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'cg', name: 'Republic of the Congo', flag: '🇨🇬', proxyServers: [
    { host: 'proxy-cg-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'ga', name: 'Gabon', flag: '🇬🇦', proxyServers: [
    { host: 'proxy-ga-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'gq', name: 'Equatorial Guinea', flag: '🇬🇶', proxyServers: [
    { host: 'proxy-gq-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'st', name: 'São Tomé and Príncipe', flag: '🇸🇹', proxyServers: [
    { host: 'proxy-st-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'gw', name: 'Guinea-Bissau', flag: '🇬🇼', proxyServers: [
    { host: 'proxy-gw-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'gn', name: 'Guinea', flag: '🇬🇳', proxyServers: [
    { host: 'proxy-gn-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'sl', name: 'Sierra Leone', flag: '🇸🇱', proxyServers: [
    { host: 'proxy-sl-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'lr', name: 'Liberia', flag: '🇱🇷', proxyServers: [
    { host: 'proxy-lr-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'cv', name: 'Cape Verde', flag: '🇨🇻', proxyServers: [
    { host: 'proxy-cv-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'gm', name: 'Gambia', flag: '🇬🇲', proxyServers: [
    { host: 'proxy-gm-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'mr', name: 'Mauritania', flag: '🇲🇷', proxyServers: [
    { host: 'proxy-mr-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'eh', name: 'Western Sahara', flag: '🇪🇭', proxyServers: [
    { host: 'proxy-eh-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'bj', name: 'Benin', flag: '🇧🇯', proxyServers: [
    { host: 'proxy-bj-1.example.com', port: 8080, type: 'http' }
  ]},
  { code: 'tg', name: 'Togo', flag: '🇹🇬', proxyServers: [
    { host: 'proxy-tg-1.example.com', port: 8080, type: 'http' }
  ]},
];


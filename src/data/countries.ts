import type { Country } from '../types';

// Comprehensive list of all countries with proxy servers
// Note: These are example proxy IPs. In production, replace with reliable proxy services.
// Free proxies may be unreliable - consider using paid proxy services for production use.
export const ALL_COUNTRIES: Country[] = [
  // North America
  { code: 'us', name: 'United States', flag: '🇺🇸', proxyServers: [
    { host: '185.199.108.153', port: 8080, type: 'http' },
    { host: '185.199.109.153', port: 8080, type: 'http' },
    { host: '185.199.110.153', port: 8080, type: 'http' }
  ]},
  { code: 'ca', name: 'Canada', flag: '🇨🇦', proxyServers: [
    { host: '185.199.111.153', port: 8080, type: 'http' },
    { host: '185.199.112.153', port: 8080, type: 'http' }
  ]},
  { code: 'mx', name: 'Mexico', flag: '🇲🇽', proxyServers: [
    { host: '185.199.113.153', port: 8080, type: 'http' }
  ]},

  // Europe
  { code: 'uk', name: 'United Kingdom', flag: '🇬🇧', proxyServers: [
    { host: '185.199.114.153', port: 8080, type: 'http' },
    { host: '185.199.115.153', port: 3128, type: 'http' }
  ]},
  { code: 'de', name: 'Germany', flag: '🇩🇪', proxyServers: [
    { host: '185.199.116.153', port: 8080, type: 'http' },
    { host: '185.199.117.153', port: 3128, type: 'http' }
  ]},
  { code: 'fr', name: 'France', flag: '🇫🇷', proxyServers: [
    { host: '185.199.118.153', port: 8080, type: 'http' },
    { host: '185.199.119.153', port: 3128, type: 'http' }
  ]},
  { code: 'it', name: 'Italy', flag: '🇮🇹', proxyServers: [
    { host: '185.199.120.153', port: 8080, type: 'http' }
  ]},
  { code: 'es', name: 'Spain', flag: '🇪🇸', proxyServers: [
    { host: '185.199.121.153', port: 8080, type: 'http' }
  ]},
  { code: 'nl', name: 'Netherlands', flag: '🇳🇱', proxyServers: [
    { host: '185.199.122.153', port: 8080, type: 'http' },
    { host: '185.199.123.153', port: 3128, type: 'http' }
  ]},
  { code: 'ch', name: 'Switzerland', flag: '🇨🇭', proxyServers: [
    { host: '185.199.124.153', port: 8080, type: 'http' },
    { host: '185.199.125.153', port: 3128, type: 'http' }
  ]},
  { code: 'se', name: 'Sweden', flag: '🇸🇪', proxyServers: [
    { host: '185.199.126.153', port: 8080, type: 'http' }
  ]},
  { code: 'no', name: 'Norway', flag: '🇳🇴', proxyServers: [
    { host: '185.199.127.153', port: 8080, type: 'http' }
  ]},
  { code: 'dk', name: 'Denmark', flag: '🇩🇰', proxyServers: [
    { host: '185.199.128.153', port: 8080, type: 'http' }
  ]},
  { code: 'fi', name: 'Finland', flag: '🇫🇮', proxyServers: [
    { host: '185.199.129.153', port: 8080, type: 'http' }
  ]},
  { code: 'pl', name: 'Poland', flag: '🇵🇱', proxyServers: [
    { host: '185.199.0.140', port: 8080, type: 'http' }
  ]},
  { code: 'cz', name: 'Czech Republic', flag: '🇨🇿', proxyServers: [
    { host: '185.199.0.141', port: 8080, type: 'http' }
  ]},
  { code: 'at', name: 'Austria', flag: '🇦🇹', proxyServers: [
    { host: '185.199.0.142', port: 8080, type: 'http' }
  ]},
  { code: 'be', name: 'Belgium', flag: '🇧🇪', proxyServers: [
    { host: '185.199.0.143', port: 8080, type: 'http' }
  ]},
  { code: 'ie', name: 'Ireland', flag: '🇮🇪', proxyServers: [
    { host: '185.199.0.144', port: 8080, type: 'http' }
  ]},
  { code: 'pt', name: 'Portugal', flag: '🇵🇹', proxyServers: [
    { host: '185.199.0.145', port: 8080, type: 'http' }
  ]},
  { code: 'gr', name: 'Greece', flag: '🇬🇷', proxyServers: [
    { host: '185.199.0.146', port: 8080, type: 'http' }
  ]},
  { code: 'ru', name: 'Russia', flag: '🇷🇺', proxyServers: [
    { host: '185.199.0.147', port: 8080, type: 'http' }
  ]},
  { code: 'ua', name: 'Ukraine', flag: '🇺🇦', proxyServers: [
    { host: '185.199.0.148', port: 8080, type: 'http' }
  ]},
  { code: 'ro', name: 'Romania', flag: '🇷🇴', proxyServers: [
    { host: '185.199.0.149', port: 8080, type: 'http' }
  ]},
  { code: 'hu', name: 'Hungary', flag: '🇭🇺', proxyServers: [
    { host: '185.199.0.150', port: 8080, type: 'http' }
  ]},
  { code: 'bg', name: 'Bulgaria', flag: '🇧🇬', proxyServers: [
    { host: '185.199.0.151', port: 8080, type: 'http' }
  ]},
  { code: 'hr', name: 'Croatia', flag: '🇭🇷', proxyServers: [
    { host: '185.199.0.152', port: 8080, type: 'http' }
  ]},
  { code: 'sk', name: 'Slovakia', flag: '🇸🇰', proxyServers: [
    { host: '185.199.0.153', port: 8080, type: 'http' }
  ]},
  { code: 'si', name: 'Slovenia', flag: '🇸🇮', proxyServers: [
    { host: '185.199.0.154', port: 8080, type: 'http' }
  ]},
  { code: 'lt', name: 'Lithuania', flag: '🇱🇹', proxyServers: [
    { host: '185.199.0.155', port: 8080, type: 'http' }
  ]},
  { code: 'lv', name: 'Latvia', flag: '🇱🇻', proxyServers: [
    { host: '185.199.0.156', port: 8080, type: 'http' }
  ]},
  { code: 'ee', name: 'Estonia', flag: '🇪🇪', proxyServers: [
    { host: '185.199.0.157', port: 8080, type: 'http' }
  ]},

  // Asia
  { code: 'cn', name: 'China', flag: '🇨🇳', proxyServers: [
    { host: '185.199.130.153', port: 8080, type: 'http' }
  ]},
  { code: 'jp', name: 'Japan', flag: '🇯🇵', proxyServers: [
    { host: '185.199.131.153', port: 8080, type: 'http' },
    { host: '185.199.132.153', port: 3128, type: 'http' }
  ]},
  { code: 'kr', name: 'South Korea', flag: '🇰🇷', proxyServers: [
    { host: '185.199.133.153', port: 8080, type: 'http' }
  ]},
  { code: 'in', name: 'India', flag: '🇮🇳', proxyServers: [
    { host: '185.199.134.153', port: 8080, type: 'http' }
  ]},
  { code: 'sg', name: 'Singapore', flag: '🇸🇬', proxyServers: [
    { host: '185.199.135.153', port: 8080, type: 'http' },
    { host: '185.199.136.153', port: 3128, type: 'http' }
  ]},
  { code: 'hk', name: 'Hong Kong', flag: '🇭🇰', proxyServers: [
    { host: '185.199.0.158', port: 8080, type: 'http' }
  ]},
  { code: 'tw', name: 'Taiwan', flag: '🇹🇼', proxyServers: [
    { host: '185.199.0.159', port: 8080, type: 'http' }
  ]},
  { code: 'th', name: 'Thailand', flag: '🇹🇭', proxyServers: [
    { host: '185.199.0.160', port: 8080, type: 'http' }
  ]},
  { code: 'my', name: 'Malaysia', flag: '🇲🇾', proxyServers: [
    { host: '185.199.0.161', port: 8080, type: 'http' }
  ]},
  { code: 'id', name: 'Indonesia', flag: '🇮🇩', proxyServers: [
    { host: '185.199.0.162', port: 8080, type: 'http' }
  ]},
  { code: 'ph', name: 'Philippines', flag: '🇵🇭', proxyServers: [
    { host: '185.199.0.163', port: 8080, type: 'http' }
  ]},
  { code: 'vn', name: 'Vietnam', flag: '🇻🇳', proxyServers: [
    { host: '185.199.0.164', port: 8080, type: 'http' }
  ]},
  { code: 'pk', name: 'Pakistan', flag: '🇵🇰', proxyServers: [
    { host: '185.199.0.165', port: 8080, type: 'http' }
  ]},
  { code: 'bd', name: 'Bangladesh', flag: '🇧🇩', proxyServers: [
    { host: '185.199.0.166', port: 8080, type: 'http' }
  ]},
  { code: 'lk', name: 'Sri Lanka', flag: '🇱🇰', proxyServers: [
    { host: '185.199.0.167', port: 8080, type: 'http' }
  ]},
  { code: 'mm', name: 'Myanmar', flag: '🇲🇲', proxyServers: [
    { host: '185.199.0.168', port: 8080, type: 'http' }
  ]},
  { code: 'kh', name: 'Cambodia', flag: '🇰🇭', proxyServers: [
    { host: '185.199.0.169', port: 8080, type: 'http' }
  ]},
  { code: 'la', name: 'Laos', flag: '🇱🇦', proxyServers: [
    { host: '185.199.0.170', port: 8080, type: 'http' }
  ]},
  { code: 'kz', name: 'Kazakhstan', flag: '🇰🇿', proxyServers: [
    { host: '185.199.0.171', port: 8080, type: 'http' }
  ]},
  { code: 'uz', name: 'Uzbekistan', flag: '🇺🇿', proxyServers: [
    { host: '185.199.0.172', port: 8080, type: 'http' }
  ]},
  { code: 'sa', name: 'Saudi Arabia', flag: '🇸🇦', proxyServers: [
    { host: '185.199.0.173', port: 8080, type: 'http' }
  ]},
  { code: 'ae', name: 'United Arab Emirates', flag: '🇦🇪', proxyServers: [
    { host: '185.199.0.174', port: 8080, type: 'http' }
  ]},
  { code: 'il', name: 'Israel', flag: '🇮🇱', proxyServers: [
    { host: '185.199.0.175', port: 8080, type: 'http' }
  ]},
  { code: 'tr', name: 'Turkey', flag: '🇹🇷', proxyServers: [
    { host: '185.199.0.176', port: 8080, type: 'http' }
  ]},
  { code: 'ir', name: 'Iran', flag: '🇮🇷', proxyServers: [
    { host: '185.199.0.177', port: 8080, type: 'http' }
  ]},
  { code: 'iq', name: 'Iraq', flag: '🇮🇶', proxyServers: [
    { host: '185.199.0.178', port: 8080, type: 'http' }
  ]},
  { code: 'jo', name: 'Jordan', flag: '🇯🇴', proxyServers: [
    { host: '185.199.0.179', port: 8080, type: 'http' }
  ]},
  { code: 'lb', name: 'Lebanon', flag: '🇱🇧', proxyServers: [
    { host: '185.199.0.180', port: 8080, type: 'http' }
  ]},
  { code: 'eg', name: 'Egypt', flag: '🇪🇬', proxyServers: [
    { host: '185.199.0.181', port: 8080, type: 'http' }
  ]},

  // Oceania
  { code: 'au', name: 'Australia', flag: '🇦🇺', proxyServers: [
    { host: '185.199.137.153', port: 8080, type: 'http' },
    { host: '185.199.138.153', port: 3128, type: 'http' }
  ]},
  { code: 'nz', name: 'New Zealand', flag: '🇳🇿', proxyServers: [
    { host: '185.199.0.182', port: 8080, type: 'http' }
  ]},
  { code: 'fj', name: 'Fiji', flag: '🇫🇯', proxyServers: [
    { host: '185.199.0.183', port: 8080, type: 'http' }
  ]},
  { code: 'pg', name: 'Papua New Guinea', flag: '🇵🇬', proxyServers: [
    { host: '185.199.0.184', port: 8080, type: 'http' }
  ]},

  // South America
  { code: 'br', name: 'Brazil', flag: '🇧🇷', proxyServers: [
    { host: '185.199.0.185', port: 8080, type: 'http' }
  ]},
  { code: 'ar', name: 'Argentina', flag: '🇦🇷', proxyServers: [
    { host: '185.199.0.186', port: 8080, type: 'http' }
  ]},
  { code: 'cl', name: 'Chile', flag: '🇨🇱', proxyServers: [
    { host: '185.199.0.187', port: 8080, type: 'http' }
  ]},
  { code: 'co', name: 'Colombia', flag: '🇨🇴', proxyServers: [
    { host: '185.199.0.188', port: 8080, type: 'http' }
  ]},
  { code: 'pe', name: 'Peru', flag: '🇵🇪', proxyServers: [
    { host: '185.199.0.189', port: 8080, type: 'http' }
  ]},
  { code: 've', name: 'Venezuela', flag: '🇻🇪', proxyServers: [
    { host: '185.199.0.190', port: 8080, type: 'http' }
  ]},
  { code: 'ec', name: 'Ecuador', flag: '🇪🇨', proxyServers: [
    { host: '185.199.0.191', port: 8080, type: 'http' }
  ]},
  { code: 'uy', name: 'Uruguay', flag: '🇺🇾', proxyServers: [
    { host: '185.199.0.192', port: 8080, type: 'http' }
  ]},
  { code: 'py', name: 'Paraguay', flag: '🇵🇾', proxyServers: [
    { host: '185.199.0.193', port: 8080, type: 'http' }
  ]},
  { code: 'bo', name: 'Bolivia', flag: '🇧🇴', proxyServers: [
    { host: '185.199.0.194', port: 8080, type: 'http' }
  ]},
  { code: 'gy', name: 'Guyana', flag: '🇬🇾', proxyServers: [
    { host: '185.199.0.195', port: 8080, type: 'http' }
  ]},
  { code: 'sr', name: 'Suriname', flag: '🇸🇷', proxyServers: [
    { host: '185.199.0.196', port: 8080, type: 'http' }
  ]},

  // Africa
  { code: 'za', name: 'South Africa', flag: '🇿🇦', proxyServers: [
    { host: '185.199.0.197', port: 8080, type: 'http' }
  ]},
  { code: 'ng', name: 'Nigeria', flag: '🇳🇬', proxyServers: [
    { host: '185.199.0.198', port: 8080, type: 'http' }
  ]},
  { code: 'ke', name: 'Kenya', flag: '🇰🇪', proxyServers: [
    { host: '185.199.0.199', port: 8080, type: 'http' }
  ]},
  { code: 'gh', name: 'Ghana', flag: '🇬🇭', proxyServers: [
    { host: '185.199.0.200', port: 8080, type: 'http' }
  ]},
  { code: 'tz', name: 'Tanzania', flag: '🇹🇿', proxyServers: [
    { host: '185.199.0.201', port: 8080, type: 'http' }
  ]},
  { code: 'ug', name: 'Uganda', flag: '🇺🇬', proxyServers: [
    { host: '185.199.0.202', port: 8080, type: 'http' }
  ]},
  { code: 'et', name: 'Ethiopia', flag: '🇪🇹', proxyServers: [
    { host: '185.199.0.203', port: 8080, type: 'http' }
  ]},
  { code: 'ma', name: 'Morocco', flag: '🇲🇦', proxyServers: [
    { host: '185.199.0.204', port: 8080, type: 'http' }
  ]},
  { code: 'dz', name: 'Algeria', flag: '🇩🇿', proxyServers: [
    { host: '185.199.0.205', port: 8080, type: 'http' }
  ]},
  { code: 'tn', name: 'Tunisia', flag: '🇹🇳', proxyServers: [
    { host: '185.199.0.206', port: 8080, type: 'http' }
  ]},
  { code: 'ly', name: 'Libya', flag: '🇱🇾', proxyServers: [
    { host: '185.199.0.207', port: 8080, type: 'http' }
  ]},
  { code: 'sd', name: 'Sudan', flag: '🇸🇩', proxyServers: [
    { host: '185.199.0.208', port: 8080, type: 'http' }
  ]},
  { code: 'zw', name: 'Zimbabwe', flag: '🇿🇼', proxyServers: [
    { host: '185.199.0.209', port: 8080, type: 'http' }
  ]},
  { code: 'zm', name: 'Zambia', flag: '🇿🇲', proxyServers: [
    { host: '185.199.0.210', port: 8080, type: 'http' }
  ]},
  { code: 'mw', name: 'Malawi', flag: '🇲🇼', proxyServers: [
    { host: '185.199.0.211', port: 8080, type: 'http' }
  ]},
  { code: 'mz', name: 'Mozambique', flag: '🇲🇿', proxyServers: [
    { host: '185.199.0.212', port: 8080, type: 'http' }
  ]},
  { code: 'ao', name: 'Angola', flag: '🇦🇴', proxyServers: [
    { host: '185.199.0.213', port: 8080, type: 'http' }
  ]},
  { code: 'cm', name: 'Cameroon', flag: '🇨🇲', proxyServers: [
    { host: '185.199.0.214', port: 8080, type: 'http' }
  ]},
  { code: 'ci', name: 'Ivory Coast', flag: '🇨🇮', proxyServers: [
    { host: '185.199.0.215', port: 8080, type: 'http' }
  ]},
  { code: 'sn', name: 'Senegal', flag: '🇸🇳', proxyServers: [
    { host: '185.199.0.216', port: 8080, type: 'http' }
  ]},
  { code: 'ml', name: 'Mali', flag: '🇲🇱', proxyServers: [
    { host: '185.199.0.217', port: 8080, type: 'http' }
  ]},
  { code: 'bf', name: 'Burkina Faso', flag: '🇧🇫', proxyServers: [
    { host: '185.199.0.218', port: 8080, type: 'http' }
  ]},
  { code: 'ne', name: 'Niger', flag: '🇳🇪', proxyServers: [
    { host: '185.199.0.219', port: 8080, type: 'http' }
  ]},
  { code: 'td', name: 'Chad', flag: '🇹🇩', proxyServers: [
    { host: '185.199.0.220', port: 8080, type: 'http' }
  ]},
  { code: 'so', name: 'Somalia', flag: '🇸🇴', proxyServers: [
    { host: '185.199.0.221', port: 8080, type: 'http' }
  ]},
  { code: 'er', name: 'Eritrea', flag: '🇪🇷', proxyServers: [
    { host: '185.199.0.222', port: 8080, type: 'http' }
  ]},
  { code: 'dj', name: 'Djibouti', flag: '🇩🇯', proxyServers: [
    { host: '185.199.0.223', port: 8080, type: 'http' }
  ]},
  { code: 'mu', name: 'Mauritius', flag: '🇲🇺', proxyServers: [
    { host: '185.199.0.224', port: 8080, type: 'http' }
  ]},
  { code: 'sc', name: 'Seychelles', flag: '🇸🇨', proxyServers: [
    { host: '185.199.0.225', port: 8080, type: 'http' }
  ]},
  { code: 'mg', name: 'Madagascar', flag: '🇲🇬', proxyServers: [
    { host: '185.199.0.226', port: 8080, type: 'http' }
  ]},
  { code: 're', name: 'Réunion', flag: '🇷🇪', proxyServers: [
    { host: '185.199.0.227', port: 8080, type: 'http' }
  ]},
  { code: 'bi', name: 'Burundi', flag: '🇧🇮', proxyServers: [
    { host: '185.199.0.228', port: 8080, type: 'http' }
  ]},
  { code: 'rw', name: 'Rwanda', flag: '🇷🇼', proxyServers: [
    { host: '185.199.0.229', port: 8080, type: 'http' }
  ]},
  { code: 'ss', name: 'South Sudan', flag: '🇸🇸', proxyServers: [
    { host: '185.199.0.230', port: 8080, type: 'http' }
  ]},
  { code: 'cf', name: 'Central African Republic', flag: '🇨🇫', proxyServers: [
    { host: '185.199.0.231', port: 8080, type: 'http' }
  ]},
  { code: 'cd', name: 'DR Congo', flag: '🇨🇩', proxyServers: [
    { host: '185.199.0.232', port: 8080, type: 'http' }
  ]},
  { code: 'cg', name: 'Republic of the Congo', flag: '🇨🇬', proxyServers: [
    { host: '185.199.0.233', port: 8080, type: 'http' }
  ]},
  { code: 'ga', name: 'Gabon', flag: '🇬🇦', proxyServers: [
    { host: '185.199.0.234', port: 8080, type: 'http' }
  ]},
  { code: 'gq', name: 'Equatorial Guinea', flag: '🇬🇶', proxyServers: [
    { host: '185.199.0.235', port: 8080, type: 'http' }
  ]},
  { code: 'st', name: 'São Tomé and Príncipe', flag: '🇸🇹', proxyServers: [
    { host: '185.199.0.236', port: 8080, type: 'http' }
  ]},
  { code: 'gw', name: 'Guinea-Bissau', flag: '🇬🇼', proxyServers: [
    { host: '185.199.0.237', port: 8080, type: 'http' }
  ]},
  { code: 'gn', name: 'Guinea', flag: '🇬🇳', proxyServers: [
    { host: '185.199.0.238', port: 8080, type: 'http' }
  ]},
  { code: 'sl', name: 'Sierra Leone', flag: '🇸🇱', proxyServers: [
    { host: '185.199.0.239', port: 8080, type: 'http' }
  ]},
  { code: 'lr', name: 'Liberia', flag: '🇱🇷', proxyServers: [
    { host: '185.199.0.240', port: 8080, type: 'http' }
  ]},
  { code: 'cv', name: 'Cape Verde', flag: '🇨🇻', proxyServers: [
    { host: '185.199.0.241', port: 8080, type: 'http' }
  ]},
  { code: 'gm', name: 'Gambia', flag: '🇬🇲', proxyServers: [
    { host: '185.199.0.242', port: 8080, type: 'http' }
  ]},
  { code: 'mr', name: 'Mauritania', flag: '🇲🇷', proxyServers: [
    { host: '185.199.0.243', port: 8080, type: 'http' }
  ]},
  { code: 'eh', name: 'Western Sahara', flag: '🇪🇭', proxyServers: [
    { host: '185.199.0.244', port: 8080, type: 'http' }
  ]},
  { code: 'bj', name: 'Benin', flag: '🇧🇯', proxyServers: [
    { host: '185.199.0.245', port: 8080, type: 'http' }
  ]},
  { code: 'tg', name: 'Togo', flag: '🇹🇬', proxyServers: [
    { host: '185.199.0.246', port: 8080, type: 'http' }
  ]},
];


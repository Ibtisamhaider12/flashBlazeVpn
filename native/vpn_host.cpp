#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <map>
#include <random>
#include <chrono>
#include <cstdlib>
#include <cstring>
#include <sstream>
#include <algorithm>

#ifdef _WIN32
#include <windows.h>
#else
#include <unistd.h>
#include <sys/stat.h>
#endif

// JSON parsing (simple implementation)
class SimpleJSON {
public:
    static std::string escape(const std::string& str) {
        std::string result;
        for (char c : str) {
            if (c == '"' || c == '\\') {
                result += '\\';
            }
            result += c;
        }
        return result;
    }

    static std::string stringify(const std::map<std::string, std::string>& obj) {
        std::string result = "{";
        bool first = true;
        for (const auto& pair : obj) {
            if (!first) result += ",";
            result += "\"" + escape(pair.first) + "\":\"" + escape(pair.second) + "\"";
            first = false;
        }
        result += "}";
        return result;
    }

    static std::string stringifyArray(const std::vector<std::map<std::string, std::string>>& arr) {
        std::string result = "[";
        bool first = true;
        for (const auto& obj : arr) {
            if (!first) result += ",";
            result += stringify(obj);
            first = false;
        }
        result += "]";
        return result;
    }
};

// Proxy server structure
struct ProxyServer {
    std::string host;
    int port;
    std::string type;
    std::string username;
    std::string password;
};

// Country proxy database
class ProxyDatabase {
private:
    std::map<std::string, std::vector<ProxyServer>> countryProxies;

public:
    ProxyDatabase() {
        loadDefaultProxies();
    }

    void loadDefaultProxies() {
        // Load comprehensive proxy list for all countries
        // In production, this would load from a file or API
        
        // United States
        countryProxies["us"] = {
            {"proxy-us-1.example.com", 8080, "http", "", ""},
            {"proxy-us-2.example.com", 3128, "http", "", ""},
            {"socks-us-1.example.com", 1080, "socks5", "", ""}
        };

        // United Kingdom
        countryProxies["uk"] = {
            {"proxy-uk-1.example.com", 8080, "http", "", ""},
            {"proxy-uk-2.example.com", 3128, "http", "", ""}
        };

        // Germany
        countryProxies["de"] = {
            {"proxy-de-1.example.com", 8080, "http", "", ""},
            {"proxy-de-2.example.com", 3128, "http", "", ""}
        };

        // France
        countryProxies["fr"] = {
            {"proxy-fr-1.example.com", 8080, "http", "", ""},
            {"proxy-fr-2.example.com", 3128, "http", "", ""}
        };

        // Japan
        countryProxies["jp"] = {
            {"proxy-jp-1.example.com", 8080, "http", "", ""},
            {"proxy-jp-2.example.com", 3128, "http", "", ""}
        };

        // Canada
        countryProxies["ca"] = {
            {"proxy-ca-1.example.com", 8080, "http", "", ""},
            {"proxy-ca-2.example.com", 3128, "http", "", ""}
        };

        // Australia
        countryProxies["au"] = {
            {"proxy-au-1.example.com", 8080, "http", "", ""},
            {"proxy-au-2.example.com", 3128, "http", "", ""}
        };

        // Netherlands
        countryProxies["nl"] = {
            {"proxy-nl-1.example.com", 8080, "http", "", ""},
            {"proxy-nl-2.example.com", 3128, "http", "", ""}
        };

        // Singapore
        countryProxies["sg"] = {
            {"proxy-sg-1.example.com", 8080, "http", "", ""},
            {"proxy-sg-2.example.com", 3128, "http", "", ""}
        };

        // Switzerland
        countryProxies["ch"] = {
            {"proxy-ch-1.example.com", 8080, "http", "", ""},
            {"proxy-ch-2.example.com", 3128, "http", "", ""}
        };

        // Add more countries...
        countryProxies["in"] = {{"proxy-in-1.example.com", 8080, "http", "", ""}};
        countryProxies["br"] = {{"proxy-br-1.example.com", 8080, "http", "", ""}};
        countryProxies["mx"] = {{"proxy-mx-1.example.com", 8080, "http", "", ""}};
        countryProxies["it"] = {{"proxy-it-1.example.com", 8080, "http", "", ""}};
        countryProxies["es"] = {{"proxy-es-1.example.com", 8080, "http", "", ""}};
        countryProxies["se"] = {{"proxy-se-1.example.com", 8080, "http", "", ""}};
        countryProxies["no"] = {{"proxy-no-1.example.com", 8080, "http", "", ""}};
        countryProxies["dk"] = {{"proxy-dk-1.example.com", 8080, "http", "", ""}};
        countryProxies["fi"] = {{"proxy-fi-1.example.com", 8080, "http", "", ""}};
        countryProxies["pl"] = {{"proxy-pl-1.example.com", 8080, "http", "", ""}};
        countryProxies["cz"] = {{"proxy-cz-1.example.com", 8080, "http", "", ""}};
        countryProxies["at"] = {{"proxy-at-1.example.com", 8080, "http", "", ""}};
        countryProxies["be"] = {{"proxy-be-1.example.com", 8080, "http", "", ""}};
        countryProxies["ie"] = {{"proxy-ie-1.example.com", 8080, "http", "", ""}};
        countryProxies["pt"] = {{"proxy-pt-1.example.com", 8080, "http", "", ""}};
        countryProxies["gr"] = {{"proxy-gr-1.example.com", 8080, "http", "", ""}};
        countryProxies["ru"] = {{"proxy-ru-1.example.com", 8080, "http", "", ""}};
        countryProxies["cn"] = {{"proxy-cn-1.example.com", 8080, "http", "", ""}};
        countryProxies["kr"] = {{"proxy-kr-1.example.com", 8080, "http", "", ""}};
        countryProxies["tw"] = {{"proxy-tw-1.example.com", 8080, "http", "", ""}};
        countryProxies["hk"] = {{"proxy-hk-1.example.com", 8080, "http", "", ""}};
        countryProxies["nz"] = {{"proxy-nz-1.example.com", 8080, "http", "", ""}};
        countryProxies["za"] = {{"proxy-za-1.example.com", 8080, "http", "", ""}};
        countryProxies["ae"] = {{"proxy-ae-1.example.com", 8080, "http", "", ""}};
        countryProxies["sa"] = {{"proxy-sa-1.example.com", 8080, "http", "", ""}};
        countryProxies["tr"] = {{"proxy-tr-1.example.com", 8080, "http", "", ""}};
        countryProxies["il"] = {{"proxy-il-1.example.com", 8080, "http", "", ""}};
        countryProxies["eg"] = {{"proxy-eg-1.example.com", 8080, "http", "", ""}};
        countryProxies["th"] = {{"proxy-th-1.example.com", 8080, "http", "", ""}};
        countryProxies["my"] = {{"proxy-my-1.example.com", 8080, "http", "", ""}};
        countryProxies["id"] = {{"proxy-id-1.example.com", 8080, "http", "", ""}};
        countryProxies["ph"] = {{"proxy-ph-1.example.com", 8080, "http", "", ""}};
        countryProxies["vn"] = {{"proxy-vn-1.example.com", 8080, "http", "", ""}};
        countryProxies["ar"] = {{"proxy-ar-1.example.com", 8080, "http", "", ""}};
        countryProxies["cl"] = {{"proxy-cl-1.example.com", 8080, "http", "", ""}};
        countryProxies["co"] = {{"proxy-co-1.example.com", 8080, "http", "", ""}};
        countryProxies["pe"] = {{"proxy-pe-1.example.com", 8080, "http", "", ""}};
    }

    ProxyServer getRandomProxy(const std::string& countryCode) {
        std::string lowerCode = countryCode;
        std::transform(lowerCode.begin(), lowerCode.end(), lowerCode.begin(), ::tolower);

        if (countryProxies.find(lowerCode) == countryProxies.end() || 
            countryProxies[lowerCode].empty()) {
            // Return default proxy if country not found
            return {"proxy-default.example.com", 8080, "http", "", ""};
        }

        auto& proxies = countryProxies[lowerCode];
        std::random_device rd;
        std::mt19937 gen(rd());
        std::uniform_int_distribution<> dis(0, proxies.size() - 1);
        
        return proxies[dis(gen)];
    }

    std::vector<std::string> getAvailableCountries() {
        std::vector<std::string> countries;
        for (const auto& pair : countryProxies) {
            countries.push_back(pair.first);
        }
        return countries;
    }
};

// Message handler
class MessageHandler {
private:
    ProxyDatabase db;

    std::string handleGetProxy(const std::string& countryCode) {
        ProxyServer proxy = db.getRandomProxy(countryCode);
        
        std::map<std::string, std::string> response;
        response["success"] = "true";
        response["host"] = proxy.host;
        response["port"] = std::to_string(proxy.port);
        response["type"] = proxy.type;
        
        std::map<std::string, std::string> proxyObj;
        proxyObj["host"] = proxy.host;
        proxyObj["port"] = std::to_string(proxy.port);
        proxyObj["type"] = proxy.type;
        
        std::map<std::string, std::string> result;
        result["success"] = "true";
        result["proxy"] = SimpleJSON::stringify(proxyObj);
        
        return SimpleJSON::stringify(result);
    }

public:
    std::string processMessage(const std::string& message) {
        // Simple JSON parsing (in production, use a proper JSON library)
        std::string action;
        std::string country;
        
        // Extract action and country from message
        size_t actionPos = message.find("\"action\"");
        if (actionPos != std::string::npos) {
            size_t colonPos = message.find(":", actionPos);
            size_t quoteStart = message.find("\"", colonPos) + 1;
            size_t quoteEnd = message.find("\"", quoteStart);
            action = message.substr(quoteStart, quoteEnd - quoteStart);
        }
        
        size_t countryPos = message.find("\"country\"");
        if (countryPos != std::string::npos) {
            size_t colonPos = message.find(":", countryPos);
            size_t quoteStart = message.find("\"", colonPos) + 1;
            size_t quoteEnd = message.find("\"", quoteStart);
            country = message.substr(quoteStart, quoteEnd - quoteStart);
        }

        if (action == "getProxy") {
            return handleGetProxy(country);
        }

        std::map<std::string, std::string> error;
        error["success"] = "false";
        error["error"] = "Unknown action";
        return SimpleJSON::stringify(error);
    }
};

// Read message from stdin (Chrome Native Messaging protocol)
std::string readMessage() {
    uint32_t length = 0;
    std::cin.read(reinterpret_cast<char*>(&length), sizeof(length));
    
    if (std::cin.eof() || length == 0) {
        return "";
    }
    
    if (length > 1024 * 1024) { // Max 1MB
        return "";
    }
    
    std::vector<char> buffer(length);
    std::cin.read(buffer.data(), length);
    
    return std::string(buffer.data(), length);
}

// Write message to stdout
void writeMessage(const std::string& message) {
    uint32_t length = message.length();
    std::cout.write(reinterpret_cast<const char*>(&length), sizeof(length));
    std::cout.write(message.c_str(), length);
    std::cout.flush();
}

int main() {
    MessageHandler handler;
    
    // Main message loop
    while (true) {
        std::string message = readMessage();
        if (message.empty()) {
            break;
        }
        
        std::string response = handler.processMessage(message);
        writeMessage(response);
    }
    
    return 0;
}


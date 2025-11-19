CXX = g++
CXXFLAGS = -std=c++11 -Wall -O2
TARGET = vpn_host
SRC = vpn_host.cpp

# Platform-specific settings
UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Linux)
    TARGET_EXT = 
    INSTALL_DIR = ~/.config/google-chrome/NativeMessagingHosts
    CHROME_DIR = ~/.config/google-chrome
endif
ifeq ($(UNAME_S),Darwin)
    TARGET_EXT = 
    INSTALL_DIR = ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts
    CHROME_DIR = ~/Library/Application\ Support/Google/Chrome
endif

all: $(TARGET)

$(TARGET): $(SRC)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(SRC)

clean:
	rm -f $(TARGET)

install: $(TARGET)
	@echo "Installing native host..."
	@mkdir -p $(INSTALL_DIR)
	@cp $(TARGET) $(INSTALL_DIR)/$(TARGET)
	@chmod +x $(INSTALL_DIR)/$(TARGET)
	@echo "Native host installed to $(INSTALL_DIR)"

.PHONY: all clean install


#!/usr/bin/env python3
"""Create icon files for the Chrome extension by downloading from internet."""

import sys
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.error import URLError

try:
    from PIL import Image
except ImportError:
    print("ERROR: PIL/Pillow is not installed.")
    print("Please install it with: pip3 install Pillow")
    sys.exit(1)

def download_icon_from_internet():
    """Download VPN icon from internet."""
    # Using a free VPN icon from a public source
    # This is a simple shield/lock icon that represents VPN/security
    # You can replace this URL with any VPN icon you prefer
    
    icon_urls = [
        # Try multiple sources in case one fails
        "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/vpn.svg",
        # Fallback: Create a simple VPN icon programmatically
    ]
    
    icons_dir = Path(__file__).parent.parent / "dist" / "icons"
    icons_dir.mkdir(parents=True, exist_ok=True)
    
    # Try to download from internet
    icon_downloaded = False
    for url in icon_urls:
        try:
            print(f"Attempting to download icon from {url}...")
            req = Request(url)
            req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
            
            with urlopen(req, timeout=10) as response:
                icon_data = response.read()
                
                # If it's SVG, we need to convert it
                if url.endswith('.svg'):
                    # For SVG, we'll create a PNG from it using PIL
                    # But PIL doesn't support SVG directly, so we'll create a VPN-themed icon
                    print("SVG detected, creating VPN-themed icon...")
                    icon_downloaded = False  # Will create programmatically
                    break
                else:
                    # Save the downloaded icon
                    temp_icon = icons_dir / "temp_icon.png"
                    temp_icon.write_bytes(icon_data)
                    icon_downloaded = True
                    break
        except Exception as e:
            print(f"Could not download from {url}: {e}")
            continue
    
    # If download failed, create a VPN-themed icon programmatically
    if not icon_downloaded:
        print("Creating VPN-themed icon programmatically...")
        create_vpn_icon(icons_dir)
    else:
        # Resize the downloaded icon to required sizes
        temp_icon_path = icons_dir / "temp_icon.png"
        if temp_icon_path.exists():
            base_icon = Image.open(temp_icon_path)
            for size in [16, 48, 128]:
                resized = base_icon.resize((size, size), Image.Resampling.LANCZOS)
                icon_path = icons_dir / f"icon{size}.png"
                resized.save(icon_path, 'PNG')
                print(f"Created {icon_path} ({size}x{size})")
            temp_icon_path.unlink()  # Remove temp file

def create_vpn_icon(icons_dir):
    """Create a VPN-themed icon (shield with lock)."""
    from PIL import Image, ImageDraw, ImageFont
    
    # VPN theme color: Blue (#4A90E2) with security/shield theme
    primary_color = (74, 144, 226)  # Blue
    secondary_color = (255, 255, 255)  # White
    accent_color = (46, 204, 113)  # Green for security
    
    for size in [16, 48, 128]:
        # Create image with transparent background
        img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Draw a shield shape (simplified as rounded rectangle with triangle top)
        shield_padding = size // 8
        shield_width = size - (shield_padding * 2)
        shield_height = size - (shield_padding * 2)
        shield_x = shield_padding
        shield_y = shield_padding
        
        # Draw shield body (rounded rectangle)
        corner_radius = size // 6
        draw.rounded_rectangle(
            [shield_x, shield_y + shield_height // 3, 
             shield_x + shield_width, shield_y + shield_height],
            radius=corner_radius,
            fill=primary_color
        )
        
        # Draw shield top (triangle/arch)
        points = [
            (shield_x, shield_y + shield_height // 3),
            (shield_x + shield_width // 2, shield_y),
            (shield_x + shield_width, shield_y + shield_height // 3)
        ]
        draw.polygon(points, fill=primary_color)
        
        # Draw a lock symbol in the center
        lock_size = size // 3
        lock_x = size // 2 - lock_size // 2
        lock_y = size // 2 - lock_size // 4
        
        # Lock body (rectangle)
        lock_body_height = lock_size // 2
        draw.rectangle(
            [lock_x, lock_y + lock_size // 4,
             lock_x + lock_size, lock_y + lock_size // 4 + lock_body_height],
            fill=secondary_color,
            outline=secondary_color,
            width=max(1, size // 32)
        )
        
        # Lock shackle (semi-circle on top)
        shackle_radius = lock_size // 4
        shackle_center_x = lock_x + lock_size // 2
        shackle_center_y = lock_y + lock_size // 4
        draw.arc(
            [shackle_center_x - shackle_radius, shackle_center_y - shackle_radius,
             shackle_center_x + shackle_radius, shackle_center_y + shackle_radius],
            start=180,
            end=0,
            fill=secondary_color,
            width=max(2, size // 16)
        )
        
        icon_path = icons_dir / f"icon{size}.png"
        img.save(icon_path, 'PNG')
        print(f"Created {icon_path} ({size}x{size})")

if __name__ == '__main__':
    download_icon_from_internet()
    print("All icons created successfully!")

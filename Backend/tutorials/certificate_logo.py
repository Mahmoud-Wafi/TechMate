"""Generate TechMate logo and certificate graphics"""
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import os

def create_techmate_logo(size=200):
    """Create professional TechMate logo"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Colors
    dark_bg = (15, 23, 42)  # Dark blue
    accent_green = (16, 185, 129)  # Green accent
    white = (255, 255, 255)
    
    # Draw hexagon background
    center_x, center_y = size // 2, size // 2
    radius = size // 2.5
    
    points = []
    for i in range(6):
        angle = i * 60
        import math
        x = center_x + radius * math.cos(math.radians(angle))
        y = center_y + radius * math.sin(math.radians(angle))
        points.append((x, y))
    
    # Fill hexagon
    draw.polygon(points, fill=dark_bg, outline=accent_green, width=3)
    
    # Draw stylized "T" and "M" symbolizing tech
    # Vertical line (T)
    draw.line([(center_x - 20, center_y - 30), (center_x - 20, center_y + 30)], 
              fill=accent_green, width=5)
    draw.line([(center_x - 35, center_y - 30), (center_x - 5, center_y - 30)], 
              fill=accent_green, width=5)
    
    # Right vertical line (M)
    draw.line([(center_x + 20, center_y - 30), (center_x + 20, center_y + 30)], 
              fill=accent_green, width=5)
    
    return img

def create_watermark_text(width, height, opacity=30):
    """Create watermark with TechMate text repeated across background"""
    watermark = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(watermark)
    
    # Light gray color with low opacity
    text_color = (200, 200, 200, opacity)
    
    # Draw diagonal repeated text
    text = "TECHMATE"
    spacing = 200
    
    import math
    angle = 45
    
    # Create a temporary image to rotate
    temp_img = Image.new('RGBA', (width * 2, height * 2), (0, 0, 0, 0))
    temp_draw = ImageDraw.Draw(temp_img)
    
    # Draw watermark text across the image
    for y in range(-height, height * 2, spacing):
        for x in range(-width, width * 2, spacing):
            temp_draw.text((x, y), text, fill=text_color, font=None)
    
    # Rotate the watermark
    temp_img = temp_img.rotate(-angle, expand=False)
    
    # Paste onto final watermark
    watermark.paste(temp_img, (0, 0), temp_img)
    
    return watermark

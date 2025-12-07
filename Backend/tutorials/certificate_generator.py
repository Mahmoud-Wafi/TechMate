from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from datetime import datetime
from io import BytesIO
import math

def create_wave_path(y_offset, width, amplitude, frequency):
    """Create wave points for path drawing"""
    points = []
    for x in range(0, int(width) + 1, 10):
        y = y_offset + amplitude * math.sin((x / width) * frequency * math.pi)
        points.append((x, y))
    return points

def generate_certificate_pdf(user, tutorial, certificate_number):
    """Generate modern professional certificate PDF with wave design"""
    
    buffer = BytesIO()
    page_width, page_height = landscape(A4)
    
    # Create canvas
    c = canvas.Canvas(buffer, pagesize=landscape(A4))
    
    # Colors
    blue_dark = colors.HexColor('#006699')
    orange = colors.HexColor('#FF7F00')
    dark_gray = colors.HexColor('#505050')
    text_gray = colors.HexColor('#333333')
    red_seal = colors.HexColor('#DC143C')
    
    # ===== BACKGROUND DESIGN =====
    
    # Top blue wave
    wave_points = create_wave_path(130, page_width, 60, 1)
    wave_poly = [wave_points[0]]
    wave_poly.extend(wave_points)
    wave_poly.append((page_width, 0))
    wave_poly.append((0, 0))
    
    c.setFillColor(blue_dark)
    c.drawPolygon(wave_poly, fill=True, stroke=False)
    
    # Bottom dark section
    bottom_height = page_height * 0.12
    c.setFillColor(colors.HexColor('#505050'))
    c.rect(0, 0, page_width, bottom_height, fill=True, stroke=False)
    
    # ===== LOGO (Top Left) =====
    logo_x = 50
    logo_y = page_height - 100
    logo_size = 60
    
    # Vertical bar (dark blue)
    c.setFillColor(blue_dark)
    c.rect(logo_x + 15, logo_y - 45, 12, 50, fill=True)
    
    # Horizontal bar
    c.rect(logo_x, logo_y - 35, 45, 12, fill=True)
    
    # Orange accent square
    c.setFillColor(orange)
    c.rect(logo_x + 35, logo_y - 35, 25, 25, fill=True)
    
    # ===== MAIN CONTENT =====
    
    # CERTIFICATE title
    c.setFont("Helvetica-Bold", 70)
    c.setFillColor(dark_gray)
    title_x = page_width / 2
    title_y = page_height - 200
    c.drawCentredString(title_x, title_y, "CERTIFICATE")
    
    # Subtitle
    c.setFont("Helvetica", 16)
    c.setFillColor(text_gray)
    c.drawCentredString(title_x, title_y - 35, "Course Completion")
    
    # Decorative line under subtitle
    c.setStrokeColor(blue_dark)
    c.setLineWidth(2)
    c.line(title_x - 150, title_y - 50, title_x + 150, title_y - 50)
    
    # Intro text
    c.setFont("Helvetica", 13)
    c.setFillColor(text_gray)
    c.drawCentredString(title_x, title_y - 90, "This is to certify that")
    
    # User name (large, blue)
    user_name = user.get_full_name() or user.username
    c.setFont("Helvetica-Bold", 52)
    c.setFillColor(blue_dark)
    c.drawCentredString(title_x, title_y - 150, user_name)
    
    # Details section (left aligned)
    detail_y = title_y - 220
    label_x = 80
    value_x = 280
    
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(dark_gray)
    
    # Course Name
    c.drawString(label_x, detail_y, "Course Name :")
    c.setFont("Helvetica", 12)
    c.setFillColor(text_gray)
    c.drawString(value_x, detail_y, tutorial.title)
    
    # Date
    issue_date = datetime.now().strftime("%B %d, %Y")
    detail_y -= 40
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(dark_gray)
    c.drawString(label_x, detail_y, "Date :")
    c.setFont("Helvetica", 12)
    c.setFillColor(text_gray)
    c.drawString(value_x, detail_y, issue_date)
    
    # Signature
    detail_y -= 40
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(dark_gray)
    c.drawString(label_x, detail_y, "Signature :")
    c.setFont("Helvetica", 12)
    c.setFillColor(text_gray)
    c.drawString(value_x, detail_y, "TechMate Team")
    
    # ===== RED SEAL BADGE =====
    seal_x = title_x
    seal_y = detail_y - 100
    seal_radius = 35
    
    # Draw circles for seal
    c.setFillColor(red_seal)
    c.circle(seal_x, seal_y, seal_radius, fill=True, stroke=False)
    
    # Inner circle outline
    c.setStrokeColor(colors.HexColor('#B4082A'))
    c.setLineWidth(2)
    c.setFillColor(None)
    c.circle(seal_x, seal_y, seal_radius - 8, fill=False, stroke=True)
    
    # Star points around seal
    c.setStrokeColor(red_seal)
    c.setLineWidth(2)
    for i in range(12):
        angle = i * 30
        rad = math.radians(angle)
        
        x1 = seal_x + seal_radius * 1.15 * math.cos(rad)
        y1 = seal_y + seal_radius * 1.15 * math.sin(rad)
        x2 = seal_x + (seal_radius + 12) * math.cos(rad)
        y2 = seal_y + (seal_radius + 12) * math.sin(rad)
        
        c.line(x1, y1, x2, y2)
    
    # Save to buffer
    c.save()
    buffer.seek(0)
    return buffer

def generate_certificate_filename(user, tutorial):
    """Generate certificate filename"""
    user_name = (user.get_full_name() or user.username).replace(" ", "_")
    tutorial_title = tutorial.title.replace(" ", "_")[:20]
    return f"Certificate_{user_name}_{tutorial_title}.pdf"

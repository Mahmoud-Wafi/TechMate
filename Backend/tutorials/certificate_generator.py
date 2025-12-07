from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from datetime import datetime
from io import BytesIO
import math

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
    
    # Top blue section (simulating wave)
    c.setFillColor(blue_dark)
    c.rect(0, page_height - 130, page_width, 130, fill=True, stroke=False)
    
    # Add curved wave effect with path
    c.setStrokeColor(blue_dark)
    c.setLineWidth(1)
    

    
    # ===== WATERMARK =====
    # Add semi-transparent watermark text
    c.setFont("Helvetica-Bold", 100)
    c.setFillAlpha(0.05)  # 5% opacity - very transparent
    c.setFillColor(colors.HexColor('#FF7F00'))  # Orange color
    c.saveState()
    c.translate(page_width / 2, page_height / 2)
    c.rotate(45)
    c.drawCentredString(0, 0, "TechMate")
    c.restoreState()
    c.setFillAlpha(1.0)  # Reset to full opacity
    
    # ===== LOGO (Top Left) =====
    logo_x = 50
    logo_y = page_height - 90
    
    # Logo colors - Orange and Blue (swapped)
    logo_color1 = orange  # Orange for main
    logo_color2 = colors.HexColor('#FF7F00')  # Orange for details
    
    # Orange vertical bar
    c.setFillColor(logo_color1)
    c.rect(logo_x + 15, logo_y - 45, 12, 50, fill=True)
    
    # Orange horizontal bar
    c.rect(logo_x, logo_y - 35, 45, 12, fill=True)
    
    # Dark blue accent square
    c.setFillColor(blue_dark)
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
    c.drawCentredString(title_x, title_y - 40, "Course Completion")
    
    # Decorative line under subtitle
    c.setStrokeColor(blue_dark)
    c.setLineWidth(2)
    c.line(title_x - 150, title_y - 55, title_x + 150, title_y - 55)
    
    # Intro text
    c.setFont("Helvetica", 13)
    c.setFillColor(text_gray)
    c.drawCentredString(title_x, title_y - 90, "This is to certify that")
    
    # User name (large, blue) - always use full name
    user_name = user.get_full_name()
    if not user_name or user_name.strip() == '':
        user_name = user.username
    c.setFont("Helvetica-Bold", 52)
    c.setFillColor(blue_dark)
    c.drawCentredString(title_x, title_y - 155, user_name)
    
    # Details section (left aligned)
    detail_y = title_y - 230
    label_x = 100
    value_x = 300
    
    # Course Name
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(dark_gray)
    c.drawString(label_x, detail_y, "Course Name :")
    c.setFont("Helvetica-Bold", 16)
    c.setFillColor(blue_dark)
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
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(blue_dark)
    c.drawString(value_x, detail_y, "TechMate Team")
    

    
    # Save to buffer
    c.save()
    buffer.seek(0)
    return buffer

def generate_certificate_filename(user, tutorial):
    """Generate certificate filename"""
    user_name = (user.get_full_name() or user.username).replace(" ", "_")
    tutorial_title = tutorial.title.replace(" ", "_")[:20]
    return f"Certificate_{user_name}_{tutorial_title}.pdf"

from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageTemplate, Frame, Image as RLImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from reportlab.pdfgen import canvas
from io import BytesIO
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
import math

def create_modern_background(width_px, height_px):
    """Create modern certificate background with gradient, decorative elements, and watermark"""
    img = Image.new('RGB', (width_px, height_px), color=(255, 255, 255))
    draw = ImageDraw.Draw(img, 'RGBA')
    
    # Create subtle gradient background
    for y in range(height_px):
        # Gradient from light blue at top to white at bottom
        ratio = y / height_px
        r = int(248 + (15 - 248) * ratio * 0.05)
        g = int(250 + (23 - 250) * ratio * 0.05)
        b = int(252 + (42 - 252) * ratio * 0.1)
        draw.line([(0, y), (width_px, y)], fill=(r, g, b))
    
    # Gold accent borders
    gold = (212, 175, 55)
    border_width = 12
    
    # Outer border
    draw.rectangle([(0, 0), (width_px, height_px)], outline=gold, width=border_width)
    
    # Inner decorative border
    inner_margin = 30
    draw.rectangle(
        [(inner_margin, inner_margin), 
         (width_px - inner_margin, height_px - inner_margin)],
        outline=gold, width=2
    )
    
    # Decorative corner elements
    corner_size = 30
    corner_offset = 40
    
    corners = [
        (corner_offset, corner_offset),  # Top-left
        (width_px - corner_offset - corner_size, corner_offset),  # Top-right
        (corner_offset, height_px - corner_offset - corner_size),  # Bottom-left
        (width_px - corner_offset - corner_size, height_px - corner_offset - corner_size)  # Bottom-right
    ]
    
    for x, y in corners:
        # Outer square
        draw.rectangle([(x, y), (x + corner_size, y + corner_size)], outline=gold, width=3)
        # Inner square
        draw.rectangle(
            [(x + 8, y + 8), (x + corner_size - 8, y + corner_size - 8)],
            outline=gold, width=1
        )
    
    # Watermark - semi-transparent TechMate text
    watermark_text = "TECHMATE"
    opacity = 40
    text_color = (200, 200, 200, opacity)
    
    # Create watermark by drawing diagonal text
    font_size = 120
    try:
        # Try to use a better font if available
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()
    
    # Draw watermark text diagonally across the entire certificate
    spacing = 350
    for offset_y in range(-height_px, height_px * 2, spacing):
        for offset_x in range(-width_px, width_px * 2, spacing):
            draw.text((offset_x, offset_y), watermark_text, fill=text_color, font=font)
    
    # Decorative line elements
    line_color = (200, 160, 40)
    # Top decorative line
    draw.line([(100, 80), (width_px - 100, 80)], fill=line_color, width=2)
    # Bottom decorative line
    draw.line([(100, height_px - 80), (width_px - 100, height_px - 80)], fill=line_color, width=2)
    
    # Add accent circles
    accent_color = (30, 144, 255)  # Dodger blue
    circle_radius = 8
    
    # Top circles
    draw.ellipse([(80, 70), (80 + circle_radius * 2, 70 + circle_radius * 2)], 
                 fill=accent_color, outline=gold, width=2)
    draw.ellipse([(width_px - 80 - circle_radius * 2, 70), 
                  (width_px - 80, 70 + circle_radius * 2)], 
                 fill=accent_color, outline=gold, width=2)
    
    # Convert to bytes
    img_bytes = BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    return img_bytes

def create_techmate_logo_image(size=300):
    """Create professional TechMate logo"""
    logo = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(logo)
    
    dark_bg = (15, 23, 42)
    accent_green = (16, 185, 129)
    gold = (212, 175, 55)
    
    center = size // 2
    radius = size // 3
    
    # Draw hexagon
    points = []
    for i in range(6):
        angle = i * 60
        x = center + radius * math.cos(math.radians(angle))
        y = center + radius * math.sin(math.radians(angle))
        points.append((x, y))
    
    draw.polygon(points, fill=dark_bg, outline=gold, width=4)
    
    # Draw tech symbol (stylized T and M)
    line_width = 6
    # Vertical line
    draw.line([(center - 40, center - 50), (center - 40, center + 50)], 
              fill=accent_green, width=line_width)
    # Horizontal line
    draw.line([(center - 70, center - 50), (center - 10, center - 50)], 
              fill=accent_green, width=line_width)
    
    # M shape
    draw.line([(center + 10, center - 50), (center + 10, center + 50)], 
              fill=accent_green, width=line_width)
    draw.line([(center + 10, center - 50), (center + 35, center)], 
              fill=accent_green, width=line_width)
    draw.line([(center + 35, center), (center + 60, center - 50)], 
              fill=accent_green, width=line_width)
    draw.line([(center + 60, center - 50), (center + 60, center + 50)], 
              fill=accent_green, width=line_width)
    
    return logo

def generate_certificate_pdf(user, tutorial, certificate_number):
    """Generate modern, professional certificate PDF with logo and watermark"""
    
    buffer = BytesIO()
    page_size = landscape(A4)
    
    doc = SimpleDocTemplate(
        buffer,
        pagesize=page_size,
        rightMargin=0.5*inch,
        leftMargin=0.5*inch,
        topMargin=0.4*inch,
        bottomMargin=0.4*inch
    )
    
    # Create background
    bg_width = int(page_size[0] * 72 / 2.54)
    bg_height = int(page_size[1] * 72 / 2.54)
    bg_image = create_modern_background(bg_width, bg_height)
    
    # Save background temporarily
    bg_path = '/tmp/cert_bg.png'
    bg_image.save(bg_path)
    
    styles = getSampleStyleSheet()
    
    # Modern color scheme
    primary_blue = colors.HexColor('#1e3a8a')
    secondary_blue = colors.HexColor('#2563eb')
    accent_green = colors.HexColor('#10b981')
    text_gray = colors.HexColor('#334155')
    
    # Define styles
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontSize=60,
        textColor=primary_blue,
        spaceAfter=8,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        leading=65
    )
    
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Normal'],
        fontSize=15,
        textColor=text_gray,
        spaceAfter=12,
        alignment=TA_CENTER,
        fontName='Helvetica'
    )
    
    name_style = ParagraphStyle(
        'Name',
        parent=styles['Normal'],
        fontSize=36,
        textColor=secondary_blue,
        spaceAfter=10,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        leading=40
    )
    
    course_style = ParagraphStyle(
        'Course',
        parent=styles['Normal'],
        fontSize=22,
        textColor=accent_green,
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica-BoldOblique',
        leading=26
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=11,
        textColor=text_gray,
        spaceAfter=8,
        alignment=TA_CENTER,
        fontName='Helvetica'
    )
    
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.HexColor('#64748b'),
        spaceAfter=3,
        alignment=TA_CENTER,
        fontName='Helvetica-Oblique'
    )
    
    details_style = ParagraphStyle(
        'Details',
        parent=styles['Normal'],
        fontSize=10,
        textColor=text_gray,
        spaceAfter=4,
        alignment=TA_CENTER,
        fontName='Helvetica'
    )
    
    content = []
    
    # Top spacing
    content.append(Spacer(1, 0.25*inch))
    
    # Logo
    try:
        logo_img = create_techmate_logo_image(size=150)
        logo_path = '/tmp/techmate_logo.png'
        logo_img.save(logo_path)
        logo = RLImage(logo_path, width=0.8*inch, height=0.8*inch)
        logo.hAlign = 'CENTER'
        content.append(logo)
        content.append(Spacer(1, 0.15*inch))
    except:
        pass
    
    # Title
    content.append(Paragraph("Certificate of Completion", title_style))
    content.append(Spacer(1, 0.12*inch))
    
    # Subtitle
    content.append(Paragraph("This is to certify that", subtitle_style))
    content.append(Spacer(1, 0.08*inch))
    
    # User name
    user_name = user.get_full_name() or user.username
    content.append(Paragraph(user_name, name_style))
    content.append(Spacer(1, 0.12*inch))
    
    # Achievement text
    content.append(Paragraph("has successfully completed", subtitle_style))
    content.append(Spacer(1, 0.05*inch))
    
    # Course title
    content.append(Paragraph(tutorial.title, course_style))
    content.append(Spacer(1, 0.18*inch))
    
    # Certificate details in a professional table
    issue_date = datetime.now().strftime("%B %d, %Y")
    
    details_data = [
        [
            f"<b>Certificate Number</b><br/>{certificate_number}",
            f"<b>Issued Date</b><br/>{issue_date}"
        ]
    ]
    
    details_table = Table(
        details_data,
        colWidths=[3.2*inch, 3.2*inch],
        hAlign='CENTER'
    )
    
    details_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('TEXTCOLOR', (0, 0), (-1, -1), text_gray),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 15),
        ('RIGHTPADDING', (0, 0), (-1, -1), 15),
        ('BORDER', (0, 0), (-1, -1), 1),
        ('BORDERCOLOR', (0, 0), (-1, -1), colors.HexColor('#d4af37')),
    ]))
    
    content.append(details_table)
    content.append(Spacer(1, 0.25*inch))
    
    # Platform branding with TechMate emphasis
    content.append(Paragraph("<b style='color: #1e3a8a'>TechMate Learning Platform</b>", body_style))
    content.append(Paragraph("<i>Empowering Learners Worldwide</i>", footer_style))
    
    # Build PDF
    doc.build(content)
    buffer.seek(0)
    
    # Cleanup
    import os
    try:
        os.remove(bg_path)
        os.remove(logo_path)
    except:
        pass
    
    return buffer

def generate_certificate_filename(user, tutorial):
    """Generate certificate filename"""
    user_name = (user.get_full_name() or user.username).replace(" ", "_")
    tutorial_title = tutorial.title.replace(" ", "_")[:20]
    return f"Certificate_{user_name}_{tutorial_title}.pdf"

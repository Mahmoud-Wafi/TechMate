from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageTemplate, Frame, Image as RLImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.pdfgen import canvas
from io import BytesIO
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
import math
import os

def create_certificate_background():
    """Create modern certificate background with curved wave design"""
    # Landscape A4 dimensions in pixels (300 DPI)
    width_px = 3508
    height_px = 2480
    
    img = Image.new('RGB', (width_px, height_px), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # Top wave design with gradient
    wave_height = int(height_px * 0.15)
    
    # Draw blue curved wave at top
    blue_dark = (0, 102, 204)  # Blue
    
    # Create curved path using polygon
    points = [(0, 0)]
    for x in range(0, width_px + 100, 100):
        y = int(wave_height * 0.5 * math.sin((x / width_px) * math.pi) + wave_height * 0.5)
        points.append((x, y))
    points.append((width_px, 0))
    points.append((0, 0))
    
    draw.polygon(points, fill=blue_dark)
    
    # Bottom dark gray section
    bottom_section_height = int(height_px * 0.12)
    draw.rectangle(
        [(0, height_px - bottom_section_height), (width_px, height_px)],
        fill=(80, 80, 80)
    )
    
    # Horizontal line separator
    draw.line(
        [(0, height_px - bottom_section_height), (width_px, height_px - bottom_section_height)],
        fill=(200, 200, 200),
        width=3
    )
    
    # Convert to bytes
    img_bytes = BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    return img_bytes

def create_seal_badge(size=200):
    """Create circular seal badge"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Red seal
    red_color = (220, 20, 60)  # Crimson red
    center = size // 2
    radius = size // 2 - 5
    
    # Outer circle
    draw.ellipse(
        [(center - radius, center - radius),
         (center + radius, center + radius)],
        fill=red_color
    )
    
    # Inner circle (darker red for depth)
    inner_radius = radius - 8
    draw.ellipse(
        [(center - inner_radius, center - inner_radius),
         (center + inner_radius, center + inner_radius)],
        outline=(180, 10, 40),
        width=2
    )
    
    # Star points around seal
    for i in range(12):
        angle = i * 30
        rad = math.radians(angle)
        
        x1 = center + radius * 1.1 * math.cos(rad)
        y1 = center + radius * 1.1 * math.sin(rad)
        x2 = center + (radius + 10) * math.cos(rad)
        y2 = center + (radius + 10) * math.sin(rad)
        
        draw.line([(x1, y1), (x2, y2)], fill=red_color, width=3)
    
    img_bytes = BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    return img_bytes

def create_techmate_logo(size=180):
    """Create TechMate logo - stylized T with orange accent"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # TechMate brand colors
    primary_blue = (0, 51, 102)       # Dark blue #003366
    orange = (255, 127, 0)             # Orange #FF7F00
    
    # Logo proportions
    padding = size // 10
    logo_size = size - (padding * 2)
    start_x = padding
    start_y = padding
    
    # Vertical bar (with rounded corners)
    stem_width = logo_size // 5
    stem_height = logo_size * 0.75
    
    draw.rounded_rectangle(
        [(start_x + logo_size // 3 - stem_width // 2, 
          start_y + logo_size * 0.15),
         (start_x + logo_size // 3 + stem_width // 2, 
          start_y + logo_size * 0.15 + stem_height)],
        radius=int(stem_width // 4),
        fill=primary_blue
    )
    
    # Horizontal bar of T (top)
    bar_width = logo_size * 0.55
    bar_height = logo_size // 6
    
    draw.rounded_rectangle(
        [(start_x + logo_size // 3 - bar_width // 2, 
          start_y + logo_size * 0.15),
         (start_x + logo_size // 3 + bar_width // 2, 
          start_y + logo_size * 0.15 + bar_height)],
        radius=int(bar_height // 3),
        fill=primary_blue
    )
    
    # Orange accent square (top right)
    accent_size = logo_size // 4
    accent_radius = accent_size // 6
    
    draw.rounded_rectangle(
        [(start_x + logo_size * 0.55, 
          start_y + logo_size * 0.15),
         (start_x + logo_size * 0.55 + accent_size, 
          start_y + logo_size * 0.15 + accent_size)],
        radius=int(accent_radius),
        fill=orange
    )
    
    img_bytes = BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    return img_bytes

def generate_certificate_pdf(user, tutorial, certificate_number):
    """Generate modern professional certificate PDF"""
    
    buffer = BytesIO()
    page_size = landscape(A4)
    
    doc = SimpleDocTemplate(
        buffer,
        pagesize=page_size,
        rightMargin=0.5*inch,
        leftMargin=0.5*inch,
        topMargin=0.3*inch,
        bottomMargin=0.3*inch
    )
    
    styles = getSampleStyleSheet()
    
    # Color scheme
    primary_blue = colors.HexColor('#006699')
    dark_gray = colors.HexColor('#505050')
    light_gray = colors.HexColor('#e8e8e8')
    text_color = colors.HexColor('#333333')
    
    # Define styles
    certificate_title_style = ParagraphStyle(
        'CertificateTitle',
        parent=styles['Normal'],
        fontSize=48,
        textColor=dark_gray,
        spaceAfter=3,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Normal'],
        fontSize=14,
        textColor=text_color,
        spaceAfter=15,
        alignment=TA_CENTER,
        fontName='Helvetica'
    )
    
    intro_style = ParagraphStyle(
        'Intro',
        parent=styles['Normal'],
        fontSize=12,
        textColor=text_color,
        spaceAfter=8,
        alignment=TA_CENTER,
        fontName='Helvetica'
    )
    
    name_style = ParagraphStyle(
        'Name',
        parent=styles['Normal'],
        fontSize=42,
        textColor=primary_blue,
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        leading=46
    )
    
    detail_label_style = ParagraphStyle(
        'DetailLabel',
        parent=styles['Normal'],
        fontSize=10,
        textColor=dark_gray,
        spaceAfter=2,
        alignment=TA_LEFT,
        fontName='Helvetica-Bold'
    )
    
    detail_value_style = ParagraphStyle(
        'DetailValue',
        parent=styles['Normal'],
        fontSize=11,
        textColor=text_color,
        spaceAfter=12,
        alignment=TA_LEFT,
        fontName='Helvetica'
    )
    
    signature_style = ParagraphStyle(
        'Signature',
        parent=styles['Normal'],
        fontSize=9,
        textColor=dark_gray,
        spaceAfter=4,
        alignment=TA_CENTER,
        fontName='Helvetica'
    )
    
    content = []
    
    # Top spacing for wave
    content.append(Spacer(1, 0.35*inch))
    
    # Logo - top left
    logo_bytes = create_techmate_logo(size=140)
    logo_path = '/tmp/tm_logo_cert.png'
    try:
        with open(logo_path, 'wb') as f:
            f.write(logo_bytes.getvalue())
        
        logo_img = RLImage(logo_path, width=0.6*inch, height=0.6*inch)
        logo_table = Table(
            [[logo_img, '', '']],
            colWidths=[0.8*inch, 2.5*inch, 3.2*inch]
        )
        logo_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        content.append(logo_table)
    except:
        pass
    
    content.append(Spacer(1, 0.15*inch))
    
    # Certificate title
    content.append(Paragraph("CERTIFICATE", certificate_title_style))
    content.append(Paragraph("Course Completion", subtitle_style))
    
    # Decorative line
    line_table = Table([['']], colWidths=[3.5*inch])
    line_table.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (-1, -1), 2, primary_blue),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    content.append(line_table)
    
    content.append(Spacer(1, 0.15*inch))
    
    # Intro text
    content.append(Paragraph("This is to certify that", intro_style))
    
    content.append(Spacer(1, 0.08*inch))
    
    # User name
    user_name = user.get_full_name() or user.username
    content.append(Paragraph(user_name, name_style))
    
    content.append(Spacer(1, 0.05*inch))
    
    # Details section
    issue_date = datetime.now().strftime("%B %d, %Y")
    
    details_table = Table([
        [
            Paragraph("<b>Course Name :</b>", detail_label_style),
            Paragraph(tutorial.title, detail_value_style)
        ],
        [
            Paragraph("<b>Date :</b>", detail_label_style),
            Paragraph(issue_date, detail_value_style)
        ],
        [
            Paragraph("<b>Signature :</b>", detail_label_style),
            Paragraph("TechMate Team", detail_value_style)
        ]
    ], colWidths=[1.5*inch, 5*inch])
    
    details_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    
    content.append(details_table)
    
    content.append(Spacer(1, 0.15*inch))
    
    # Seal badge - centered
    seal_bytes = create_seal_badge(size=150)
    seal_path = '/tmp/seal_badge.png'
    try:
        with open(seal_path, 'wb') as f:
            f.write(seal_bytes.getvalue())
        
        seal_img = RLImage(seal_path, width=0.8*inch, height=0.8*inch)
        seal_table = Table([[seal_img]], colWidths=[7*inch])
        seal_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ]))
        content.append(seal_table)
    except:
        pass
    
    # Build PDF
    try:
        doc.build(content)
    except Exception as e:
        print(f"Error building PDF: {e}")
        raise
    finally:
        # Cleanup
        try:
            if os.path.exists(logo_path):
                os.remove(logo_path)
            if os.path.exists(seal_path):
                os.remove(seal_path)
        except:
            pass
    
    buffer.seek(0)
    return buffer

def generate_certificate_filename(user, tutorial):
    """Generate certificate filename"""
    user_name = (user.get_full_name() or user.username).replace(" ", "_")
    tutorial_title = tutorial.title.replace(" ", "_")[:20]
    return f"Certificate_{user_name}_{tutorial_title}.pdf"

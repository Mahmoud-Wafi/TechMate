from reportlab.lib.pagesizes import landscape, A4
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

class CertificateCanvas(canvas.Canvas):
    """Custom canvas to add watermark and background"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.width, self.height = landscape(A4)
    
    def draw_watermark(self):
        """Draw watermark text"""
        self.setFont("Helvetica", 72)
        self.setFillAlpha(0.08)
        self.setFillColor(colors.HexColor('#1e3a8a'))
        
        # Rotate and write watermark
        self.saveState()
        self.translate(self.width / 2, self.height / 2)
        self.rotate(45)
        self.drawString(-2 * inch, 0, "TechMate")
        self.restoreState()

def create_premium_logo(size=200):
    """Create a premium TechMate logo"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Color scheme
    primary_blue = (30, 58, 138)      # #1e3a8a
    secondary_blue = (37, 99, 235)    # #2563eb
    accent_green = (16, 185, 129)     # #10b981
    gold = (212, 175, 55)             # #d4af37
    
    center = size // 2
    
    # Draw outer circle (medal-like)
    circle_radius = size // 2 - 10
    draw.ellipse(
        [(center - circle_radius, center - circle_radius),
         (center + circle_radius, center + circle_radius)],
        fill=primary_blue,
        outline=gold,
        width=4
    )
    
    # Draw inner circle
    inner_radius = circle_radius - 12
    draw.ellipse(
        [(center - inner_radius, center - inner_radius),
         (center + inner_radius, center + inner_radius)],
        outline=gold,
        width=2
    )
    
    # Draw stylized "T" shape (like a tech tower)
    line_width = 6
    
    # Vertical stem
    draw.rectangle(
        [(center - 15, center - 50), (center + 15, center + 30)],
        fill=accent_green,
        outline=None
    )
    
    # Top horizontal bar
    draw.rectangle(
        [(center - 40, center - 50), (center + 40, center - 35)],
        fill=accent_green,
        outline=None
    )
    
    # Add circuit-like lines for tech feel
    line_color = gold
    draw.line([(center - 35, center - 30), (center - 50, center - 30)], fill=line_color, width=2)
    draw.line([(center - 50, center - 30), (center - 50, center)], fill=line_color, width=2)
    
    draw.line([(center + 35, center - 30), (center + 50, center - 30)], fill=line_color, width=2)
    draw.line([(center + 50, center - 30), (center + 50, center)], fill=line_color, width=2)
    
    # Small circles for circuit nodes
    node_radius = 4
    draw.ellipse([(center - 50 - node_radius, center - 30 - node_radius),
                  (center - 50 + node_radius, center - 30 + node_radius)],
                 fill=accent_green)
    draw.ellipse([(center + 50 - node_radius, center - 30 - node_radius),
                  (center + 50 + node_radius, center - 30 + node_radius)],
                 fill=accent_green)
    
    # Convert to bytes
    img_bytes = BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    return img_bytes

def create_seal_badge(size=120):
    """Create a decorative seal badge"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    gold = (212, 175, 55)
    primary_blue = (30, 58, 138)
    
    center = size // 2
    radius = size // 2 - 8
    
    # Draw main circle
    draw.ellipse(
        [(center - radius, center - radius),
         (center + radius, center + radius)],
        fill=gold,
        outline=primary_blue,
        width=3
    )
    
    # Draw inner circle
    inner_radius = radius - 10
    draw.ellipse(
        [(center - inner_radius, center - inner_radius),
         (center + inner_radius, center + inner_radius)],
        fill=None,
        outline=primary_blue,
        width=2
    )
    
    # Add star points
    for i in range(8):
        angle = i * 45
        rad = math.radians(angle)
        x1 = center + radius * 0.9 * math.cos(rad)
        y1 = center + radius * 0.9 * math.sin(rad)
        x2 = center + (radius - 5) * math.cos(rad)
        y2 = center + (radius - 5) * math.sin(rad)
        draw.line([(x1, y1), (x2, y2)], fill=primary_blue, width=2)
    
    img_bytes = BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    return img_bytes

def generate_certificate_pdf(user, tutorial, certificate_number):
    """Generate premium professional certificate PDF"""
    
    buffer = BytesIO()
    page_size = landscape(A4)
    
    # Create document with custom canvas
    doc = SimpleDocTemplate(
        buffer,
        pagesize=page_size,
        rightMargin=0.5*inch,
        leftMargin=0.5*inch,
        topMargin=0.4*inch,
        bottomMargin=0.4*inch
    )
    
    styles = getSampleStyleSheet()
    
    # Premium color scheme
    primary_blue = colors.HexColor('#1e3a8a')
    secondary_blue = colors.HexColor('#2563eb')
    accent_green = colors.HexColor('#10b981')
    text_dark = colors.HexColor('#0f172a')
    text_gray = colors.HexColor('#475569')
    gold = colors.HexColor('#d4af37')
    light_bg = colors.HexColor('#f8fafc')
    
    # Define premium styles
    title_style = ParagraphStyle(
        'CertTitle',
        parent=styles['Heading1'],
        fontSize=66,
        textColor=primary_blue,
        spaceAfter=5,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        leading=72
    )
    
    subtitle_text_style = ParagraphStyle(
        'SubtitleText',
        parent=styles['Normal'],
        fontSize=16,
        textColor=text_gray,
        spaceAfter=15,
        alignment=TA_CENTER,
        fontName='Helvetica'
    )
    
    name_style = ParagraphStyle(
        'Name',
        parent=styles['Normal'],
        fontSize=40,
        textColor=secondary_blue,
        spaceAfter=8,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        leading=44
    )
    
    course_style = ParagraphStyle(
        'Course',
        parent=styles['Normal'],
        fontSize=24,
        textColor=accent_green,
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica-BoldOblique',
        leading=28
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=12,
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
        fontName='Helvetica'
    )
    
    details_label_style = ParagraphStyle(
        'DetailsLabel',
        parent=styles['Normal'],
        fontSize=9,
        textColor=text_dark,
        spaceAfter=2,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    details_value_style = ParagraphStyle(
        'DetailsValue',
        parent=styles['Normal'],
        fontSize=11,
        textColor=secondary_blue,
        spaceAfter=6,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    content = []
    
    # Top decorative border
    top_border = Table([['']], colWidths=[7.5*inch])
    top_border.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (-1, -1), 4, gold),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    content.append(top_border)
    content.append(Spacer(1, 0.25*inch))
    
    # Logo
    logo_bytes = create_premium_logo(size=160)
    logo_path = '/tmp/tm_logo.png'
    try:
        with open(logo_path, 'wb') as f:
            f.write(logo_bytes.getvalue())
        
        logo_img = RLImage(logo_path, width=0.9*inch, height=0.9*inch)
        logo_table = Table([[logo_img]], colWidths=[7.5*inch])
        logo_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ]))
        content.append(logo_table)
        content.append(Spacer(1, 0.12*inch))
    except:
        pass
    
    # Main title
    content.append(Paragraph("Certificate of Completion", title_style))
    content.append(Spacer(1, 0.08*inch))
    
    # Decorative line under title
    title_line = Table([['']], colWidths=[4*inch])
    title_line.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (-1, -1), 2, gold),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    content.append(title_line)
    content.append(Spacer(1, 0.12*inch))
    
    # Certification text
    content.append(Paragraph("This is to certify that", subtitle_text_style))
    content.append(Spacer(1, 0.1*inch))
    
    # User name
    user_name = user.get_full_name() or user.username
    content.append(Paragraph(user_name, name_style))
    content.append(Spacer(1, 0.15*inch))
    
    # Achievement text
    content.append(Paragraph("has successfully completed the course", subtitle_text_style))
    content.append(Spacer(1, 0.08*inch))
    
    # Course/Tutorial title
    content.append(Paragraph(tutorial.title, course_style))
    content.append(Spacer(1, 0.18*inch))
    
    # Certificate details section
    issue_date = datetime.now().strftime("%B %d, %Y")
    
    details_data = [
        [
            Paragraph("Certificate Number", details_label_style),
            Paragraph("Date of Issue", details_label_style)
        ],
        [
            Paragraph(certificate_number, details_value_style),
            Paragraph(issue_date, details_value_style)
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
        ('BACKGROUND', (0, 0), (-1, 0), light_bg),
        ('BORDER', (0, 0), (-1, -1), 1, gold),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 15),
        ('RIGHTPADDING', (0, 0), (-1, -1), 15),
    ]))
    
    content.append(details_table)
    content.append(Spacer(1, 0.2*inch))
    
    # Decorative line before footer
    footer_line = Table([['']], colWidths=[4*inch])
    footer_line.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (-1, -1), 2, gold),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    content.append(footer_line)
    content.append(Spacer(1, 0.1*inch))
    
    # Footer branding
    content.append(Paragraph("<b>TechMate Learning Platform</b>", body_style))
    content.append(Paragraph("<i>Empowering Learners Worldwide</i>", footer_style))
    content.append(Spacer(1, 0.08*inch))
    
    # Bottom decorative border
    bottom_border = Table([['']], colWidths=[7.5*inch])
    bottom_border.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (-1, -1), 4, gold),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    content.append(bottom_border)
    
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
        except:
            pass
    
    buffer.seek(0)
    return buffer

def generate_certificate_filename(user, tutorial):
    """Generate certificate filename"""
    user_name = (user.get_full_name() or user.username).replace(" ", "_")
    tutorial_title = tutorial.title.replace(" ", "_")[:20]
    return f"Certificate_{user_name}_{tutorial_title}.pdf"

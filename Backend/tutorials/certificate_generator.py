from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from io import BytesIO
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
import math
import os

def create_techmate_logo_bytes(size=150):
    """Create professional TechMate logo as PNG bytes"""
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
    
    draw.polygon(points, fill=dark_bg, outline=gold, width=3)
    
    # Draw tech symbol (T and M)
    line_width = 5
    # Vertical line for T
    draw.line([(center - 35, center - 40), (center - 35, center + 40)], 
              fill=accent_green, width=line_width)
    # Horizontal line for T
    draw.line([(center - 55, center - 40), (center - 15, center - 40)], 
              fill=accent_green, width=line_width)
    
    # M shape
    draw.line([(center + 5, center - 40), (center + 5, center + 40)], 
              fill=accent_green, width=line_width)
    draw.line([(center + 5, center - 40), (center + 30, center)], 
              fill=accent_green, width=line_width)
    draw.line([(center + 30, center), (center + 55, center - 40)], 
              fill=accent_green, width=line_width)
    draw.line([(center + 55, center - 40), (center + 55, center + 40)], 
              fill=accent_green, width=line_width)
    
    # Convert to bytes
    img_bytes = BytesIO()
    logo.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    return img_bytes

def generate_certificate_pdf(user, tutorial, certificate_number):
    """Generate modern, professional certificate PDF with TechMate branding"""
    
    buffer = BytesIO()
    page_size = landscape(A4)
    
    doc = SimpleDocTemplate(
        buffer,
        pagesize=page_size,
        rightMargin=0.6*inch,
        leftMargin=0.6*inch,
        topMargin=0.5*inch,
        bottomMargin=0.5*inch
    )
    
    styles = getSampleStyleSheet()
    
    # Modern color scheme
    primary_blue = colors.HexColor('#1e3a8a')
    secondary_blue = colors.HexColor('#2563eb')
    accent_green = colors.HexColor('#10b981')
    text_gray = colors.HexColor('#334155')
    gold = colors.HexColor('#d4af37')
    light_gray = colors.HexColor('#f1f5f9')
    
    # Define styles
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontSize=58,
        textColor=primary_blue,
        spaceAfter=8,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        leading=62
    )
    
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Normal'],
        fontSize=14,
        textColor=text_gray,
        spaceAfter=10,
        alignment=TA_CENTER,
        fontName='Helvetica'
    )
    
    name_style = ParagraphStyle(
        'Name',
        parent=styles['Normal'],
        fontSize=34,
        textColor=secondary_blue,
        spaceAfter=10,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        leading=38
    )
    
    course_style = ParagraphStyle(
        'Course',
        parent=styles['Normal'],
        fontSize=20,
        textColor=accent_green,
        spaceAfter=18,
        alignment=TA_CENTER,
        fontName='Helvetica-BoldOblique',
        leading=24
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=10,
        textColor=text_gray,
        spaceAfter=6,
        alignment=TA_CENTER,
        fontName='Helvetica'
    )
    
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.HexColor('#64748b'),
        spaceAfter=2,
        alignment=TA_CENTER,
        fontName='Helvetica-Oblique'
    )
    
    content = []
    
    # Top border line
    border_table = Table([['']], colWidths=[7*inch])
    border_table.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (-1, -1), 3, gold),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    content.append(border_table)
    content.append(Spacer(1, 0.2*inch))
    
    # Logo with TechMate text
    logo_bytes = create_techmate_logo_bytes(size=120)
    logo_path = '/tmp/techmate_cert_logo.png'
    try:
        with open(logo_path, 'wb') as f:
            f.write(logo_bytes.getvalue())
        
        from reportlab.platypus import Image as RLImage
        logo_img = RLImage(logo_path, width=0.7*inch, height=0.7*inch)
        
        # Create a table for logo and text
        logo_table = Table([[logo_img]], colWidths=[7*inch])
        logo_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        content.append(logo_table)
    except Exception as e:
        print(f"Logo error: {e}")
    
    content.append(Spacer(1, 0.15*inch))
    
    # Title
    content.append(Paragraph("Certificate of Completion", title_style))
    content.append(Spacer(1, 0.1*inch))
    
    # Decorative line
    line_table = Table([['']], colWidths=[5*inch])
    line_table.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (-1, -1), 1, gold),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    content.append(line_table)
    content.append(Spacer(1, 0.08*inch))
    
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
    
    # Course title with watermark-like styling
    content.append(Paragraph(tutorial.title, course_style))
    content.append(Spacer(1, 0.16*inch))
    
    # Certificate details
    issue_date = datetime.now().strftime("%B %d, %Y")
    
    details_data = [
        [
            f"<b>Certificate Number</b><br/>{certificate_number}",
            f"<b>Issued Date</b><br/>{issue_date}"
        ]
    ]
    
    details_table = Table(
        details_data,
        colWidths=[3*inch, 3*inch],
        hAlign='CENTER'
    )
    
    details_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('TEXTCOLOR', (0, 0), (-1, -1), text_gray),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 15),
        ('RIGHTPADDING', (0, 0), (-1, -1), 15),
        ('BORDER', (0, 0), (-1, -1), 1),
        ('BORDERCOLOR', (0, 0), (-1, -1), gold),
        ('BACKGROUND', (0, 0), (-1, -1), light_gray),
    ]))
    
    content.append(details_table)
    content.append(Spacer(1, 0.2*inch))
    
    # Decorative line
    line_table2 = Table([['']], colWidths=[5*inch])
    line_table2.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (-1, -1), 1, gold),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    content.append(line_table2)
    content.append(Spacer(1, 0.1*inch))
    
    # Platform branding with TechMate emphasis
    content.append(Paragraph("<b>TechMate Learning Platform</b>", body_style))
    content.append(Paragraph("<i>Empowering Learners Worldwide</i>", footer_style))
    content.append(Spacer(1, 0.08*inch))
    
    # Watermark-like text at bottom
    content.append(Paragraph("<i style='color: #cbd5e1'>This certificate acknowledges the completion of learning objectives</i>", footer_style))
    
    # Bottom border
    border_table2 = Table([['']], colWidths=[7*inch])
    border_table2.setStyle(TableStyle([
        ('LINEBELOW', (0, 0), (-1, -1), 3, gold),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    content.append(Spacer(1, 0.1*inch))
    content.append(border_table2)
    
    # Build PDF
    try:
        doc.build(content)
    except Exception as e:
        print(f"PDF build error: {e}")
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

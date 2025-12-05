from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageTemplate, Frame, Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from io import BytesIO
from datetime import datetime
import os
from PIL import Image as PILImage, ImageDraw, ImageFont

def create_certificate_background(width, height):
    """Create a modern certificate background with gradient and design elements"""
    # Create image
    img = PILImage.new('RGB', (width, height), color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    
    # Create gradient-like effect with subtle colors
    # Top blue gradient
    for i in range(height // 3):
        shade = int(79 + (74 - 79) * (i / (height // 3)))  # 4f to 4a
        draw.rectangle([(0, i), (width, i + 1)], fill=(shade, 70 + int(10 * (i / (height // 3))), 229))
    
    # Light background for content
    draw.rectangle([(0, height // 3), (width, height)], fill=(248, 249, 250))
    
    # Decorative corners - gold borders
    border_width = 8
    gold_color = (212, 175, 55)  # Gold
    
    # Top border
    draw.rectangle([(0, 0), (width, border_width)], fill=gold_color)
    # Bottom border
    draw.rectangle([(0, height - border_width), (width, height)], fill=gold_color)
    # Left border
    draw.rectangle([(0, 0), (border_width, height)], fill=gold_color)
    # Right border
    draw.rectangle([(width - border_width, 0), (width, height)], fill=gold_color)
    
    # Decorative corner elements (small squares)
    corner_size = 20
    corner_offset = 30
    draw.rectangle([
        (corner_offset, corner_offset),
        (corner_offset + corner_size, corner_offset + corner_size)
    ], outline=gold_color, width=3)
    
    draw.rectangle([
        (width - corner_offset - corner_size, corner_offset),
        (width - corner_offset, corner_offset + corner_size)
    ], outline=gold_color, width=3)
    
    draw.rectangle([
        (corner_offset, height - corner_offset - corner_size),
        (corner_offset + corner_size, height - corner_offset)
    ], outline=gold_color, width=3)
    
    draw.rectangle([
        (width - corner_offset - corner_size, height - corner_offset - corner_size),
        (width - corner_offset, height - corner_offset)
    ], outline=gold_color, width=3)
    
    # Add decorative line elements
    line_color = (200, 160, 40)
    draw.line([(50, height // 3 + 40), (width - 50, height // 3 + 40)], fill=line_color, width=2)
    draw.line([(50, height - 120), (width - 50, height - 120)], fill=line_color, width=2)
    
    # Convert to bytes
    img_bytes = BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    return img_bytes

def generate_certificate_pdf(user, tutorial, certificate_number):
    """Generate professional modern certificate PDF"""
    
    buffer = BytesIO()
    # Use landscape orientation for a more traditional certificate look
    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.5*inch,
        bottomMargin=0.5*inch
    )
    
    # Create background
    bg_width = int(landscape(A4)[0] * 72 / 2.54)  # Convert to pixels
    bg_height = int(landscape(A4)[1] * 72 / 2.54)
    bg_image = create_certificate_background(bg_width, bg_height)
    
    styles = getSampleStyleSheet()
    
    # Define modern styles
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontSize=56,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=10,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        leading=60
    )
    
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Normal'],
        fontSize=16,
        textColor=colors.HexColor('#475569'),
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica'
    )
    
    name_style = ParagraphStyle(
        'Name',
        parent=styles['Normal'],
        fontSize=32,
        textColor=colors.HexColor('#1e3a8a'),
        spaceAfter=15,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        leading=36
    )
    
    course_style = ParagraphStyle(
        'Course',
        parent=styles['Normal'],
        fontSize=20,
        textColor=colors.HexColor('#2563eb'),
        spaceAfter=25,
        alignment=TA_CENTER,
        fontName='Helvetica-BoldOblique',
        leading=24
    )
    
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=12,
        textColor=colors.HexColor('#334155'),
        spaceAfter=10,
        alignment=TA_CENTER,
        fontName='Helvetica'
    )
    
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#64748b'),
        spaceAfter=5,
        alignment=TA_CENTER,
        fontName='Helvetica-Oblique'
    )
    
    details_style = ParagraphStyle(
        'Details',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#475569'),
        spaceAfter=5,
        alignment=TA_CENTER,
        fontName='Helvetica'
    )
    
    content = []
    
    # Top spacing
    content.append(Spacer(1, 0.3*inch))
    
    # Title
    content.append(Paragraph("Certificate of Completion", title_style))
    content.append(Spacer(1, 0.15*inch))
    
    # Subtitle
    content.append(Paragraph("This is to certify that", subtitle_style))
    content.append(Spacer(1, 0.1*inch))
    
    # User name (highlight)
    user_name = user.get_full_name() or user.username
    content.append(Paragraph(user_name, name_style))
    content.append(Spacer(1, 0.15*inch))
    
    # Achievement text
    content.append(Paragraph("has successfully completed the course", subtitle_style))
    content.append(Spacer(1, 0.08*inch))
    
    # Course/Tutorial title
    content.append(Paragraph(tutorial.title, course_style))
    content.append(Spacer(1, 0.25*inch))
    
    # Certificate details
    issue_date = datetime.now().strftime("%B %d, %Y")
    
    # Create a table for details
    details_data = [
        [
            f"<b>Certificate Number:</b><br/>{certificate_number}",
            f"<b>Issued Date:</b><br/>{issue_date}"
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
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#334155')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
    ]))
    
    content.append(details_table)
    content.append(Spacer(1, 0.3*inch))
    
    # Platform branding
    content.append(Paragraph("<b>TechMate Learning Platform</b>", body_style))
    content.append(Paragraph("Empowering Learners Worldwide", footer_style))
    
    # Build PDF
    doc.build(content)
    buffer.seek(0)
    return buffer

def generate_certificate_filename(user, tutorial):
    """Generate certificate filename"""
    user_name = (user.get_full_name() or user.username).replace(" ", "_")
    tutorial_title = tutorial.title.replace(" ", "_")[:20]
    return f"Certificate_{user_name}_{tutorial_title}.pdf"

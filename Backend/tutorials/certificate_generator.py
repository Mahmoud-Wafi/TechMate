from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageTemplate, Frame
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from io import BytesIO
from datetime import datetime

def generate_certificate_pdf(user, tutorial, certificate_number):
    """Generate professional certificate PDF"""
    
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=0.5*inch, leftMargin=0.5*inch,
                            topMargin=0.5*inch, bottomMargin=0.5*inch)
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('Title', parent=styles['Heading1'], fontSize=48, textColor=colors.HexColor('#4f46e5'),
                                  spaceAfter=20, alignment=TA_CENTER, fontName='Helvetica-Bold')
    subtitle_style = ParagraphStyle('Subtitle', parent=styles['Normal'], fontSize=16, textColor=colors.HexColor('#6b7280'),
                                     spaceAfter=30, alignment=TA_CENTER)
    name_style = ParagraphStyle('Name', parent=styles['Normal'], fontSize=18, textColor=colors.HexColor('#a855f7'),
                                 spaceAfter=15, alignment=TA_CENTER, fontName='Helvetica-Bold')
    body_style = ParagraphStyle('Body', parent=styles['Normal'], fontSize=13, textColor=colors.HexColor('#374151'),
                                 spaceAfter=12, alignment=TA_CENTER)
    
    content = []
    content.append(Spacer(1, 1*inch))
    content.append(Paragraph("Certificate of Completion", title_style))
    content.append(Spacer(1, 0.3*inch))
    content.append(Paragraph("This is to certify that", subtitle_style))
    
    user_name = user.get_full_name() or user.username
    content.append(Paragraph(user_name, name_style))
    content.append(Spacer(1, 0.2*inch))
    content.append(Paragraph("has successfully completed the course", body_style))
    content.append(Paragraph(tutorial.title, name_style))
    content.append(Spacer(1, 0.4*inch))
    
    issue_date = datetime.now().strftime("%B %d, %Y")
    details = f"<b>Certificate Number:</b> {certificate_number}<br/><b>Issued Date:</b> {issue_date}"
    content.append(Paragraph(details, body_style))
    content.append(Spacer(1, 0.5*inch))
    content.append(Paragraph("<b>TechMate Learning Platform</b><br/>Empowering learners worldwide", body_style))
    
    doc.build(content)
    buffer.seek(0)
    return buffer

def generate_certificate_filename(user, tutorial):
    """Generate certificate filename"""
    user_name = (user.get_full_name() or user.username).replace(" ", "_")
    tutorial_title = tutorial.title.replace(" ", "_")[:20]
    return f"Certificate_{user_name}_{tutorial_title}.pdf"

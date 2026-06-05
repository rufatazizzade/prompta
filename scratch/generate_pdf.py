import os
import markdown
from xhtml2pdf import pisa

def convert_md_to_pdf():
    # File paths
    md_path = r"C:\Users\Admin\.gemini\antigravity\brain\1482f7bb-1bea-4196-a2d7-44d82c2d8406\project_report.md"
    pdf_path = r"C:\Users\Admin\.gemini\antigravity\brain\1482f7bb-1bea-4196-a2d7-44d82c2d8406\project_report.pdf"
    
    # Read Markdown
    with open(md_path, 'r', encoding='utf-8') as f:
        md_content = f.read()
        
    # Convert MD to HTML with tables & code formatting extensions
    html_content = markdown.markdown(md_content, extensions=['tables', 'fenced_code'])
    
    # CSS styling tailored for xhtml2pdf (simplified page rules)
    css = """
    @page {
        size: A4;
        margin: 2.5cm 2cm 2.5cm 2cm;
    }
    body {
        font-family: Helvetica, Arial, sans-serif;
        font-size: 10pt;
        line-height: 1.5;
        color: #2d3748;
    }
    h1 {
        font-size: 20pt;
        color: #4f46e5;
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 8px;
        margin-top: 30px;
        margin-bottom: 15px;
    }
    h2 {
        font-size: 14pt;
        color: #312e81;
        border-bottom: 0.5px solid #edf2f7;
        padding-bottom: 4px;
        margin-top: 24px;
        margin-bottom: 10px;
    }
    h3 {
        font-size: 11pt;
        color: #1a1b4b;
        margin-top: 16px;
        margin-bottom: 6px;
    }
    p {
        margin-top: 0;
        margin-bottom: 10px;
        text-align: justify;
    }
    a {
        color: #4f46e5;
        text-decoration: none;
    }
    ul, ol {
        margin-top: 0;
        margin-bottom: 12px;
        padding-left: 20px;
    }
    li {
        margin-bottom: 4px;
    }
    code {
        font-family: Courier, monospace;
        font-size: 8.5pt;
        background-color: #f7fafc;
        color: #e53e3e;
        padding: 2px 4px;
    }
    pre {
        font-family: Courier, monospace;
        font-size: 8.5pt;
        background-color: #f7fafc;
        border: 1px solid #e2e8f0;
        padding: 10px;
        margin-top: 0;
        margin-bottom: 15px;
    }
    pre code {
        color: #2d3748;
        background-color: transparent;
        padding: 0;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
        margin-bottom: 20px;
    }
    th, td {
        border: 1px solid #cbd5e0;
        padding: 8px 10px;
        font-size: 9pt;
    }
    th {
        background-color: #f7fafc;
        font-weight: bold;
        color: #2d3748;
        text-align: left;
    }
    tr:nth-child(even) {
        background-color: #fdfdfd;
    }
    blockquote {
        border-left: 3px solid #4f46e5;
        background-color: #f7fafc;
        padding: 8px 12px;
        margin: 0 0 15px 0;
        color: #4a5568;
    }
    hr {
        border: 0;
        border-top: 1px solid #e2e8f0;
        margin: 24px 0;
    }
    """
    
    # Wrap with HTML structure
    full_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            {css}
        </style>
    </head>
    <body>
        {html_content}
    </body>
    </html>
    """
    
    # Convert HTML to PDF
    with open(pdf_path, "wb") as pdf_file:
        pisa_status = pisa.CreatePDF(full_html, dest=pdf_file)
        
    if pisa_status.err:
        print("Error during PDF generation")
    else:
        print("PDF generated successfully at:", pdf_path)

if __name__ == "__main__":
    convert_md_to_pdf()

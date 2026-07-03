import zipfile
import xml.etree.ElementTree as ET
import os

def extract_text_from_pptx(pptx_path):
    with zipfile.ZipFile(pptx_path, 'r') as z:
        # Find all slide xml files
        slide_files = [f for f in z.namelist() if f.startswith('ppt/slides/slide') and f.endswith('.xml')]
        # Sort them numerically based on the slide number
        slide_files.sort(key=lambda x: int(x.replace('ppt/slides/slide', '').replace('.xml', '')))
        
        for i, slide_file in enumerate(slide_files):
            print(f"--- Slide {i+1} ---")
            xml_content = z.read(slide_file)
            root = ET.fromstring(xml_content)
            
            # The namespace for drawing text
            ns = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'}
            
            # Find all text elements
            texts = []
            for node in root.findall('.//a:t', ns):
                if node.text:
                    texts.append(node.text)
            print('\n'.join(texts))
            print("\n")

if __name__ == '__main__':
    extract_text_from_pptx('VTON_PPT.pptx')

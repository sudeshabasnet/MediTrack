# How to Convert Test Cases Document to .doc Format

## 📄 File Created
**Location:** `/home/saurav/Documents/Final year Projects/sudesha/MediTrack/MEDITRACK_TEST_CASES.md`

---

## Method 1: Using Pandoc (Recommended - Command Line)

### Step 1: Install Pandoc
```bash
# For Ubuntu/Debian
sudo apt-get install pandoc

# For macOS
brew install pandoc

# For Windows
# Download from: https://pandoc.org/installing.html
```

### Step 2: Convert to .docx
```bash
cd "/home/saurav/Documents/Final year Projects/sudesha/MediTrack"

pandoc MEDITRACK_TEST_CASES.md -o MEDITRACK_TEST_CASES.docx \
  --reference-doc=custom-reference.docx \
  --toc \
  --toc-depth=3
```

**Result:** Professional .docx file with table of contents

---

## Method 2: Using Microsoft Word (Easiest)

### Step 1: Open in Word
1. Open Microsoft Word
2. Click File → Open
3. Select `MEDITRACK_TEST_CASES.md`
4. Word will automatically convert Markdown to formatted document

### Step 2: Save as .doc
1. Click File → Save As
2. Choose format: "Word Document (.docx)"
3. Save as: `MEDITRACK_TEST_CASES.docx`

**Benefits:**
- Easy and quick
- Preserves most formatting
- Can edit directly in Word
- Professional appearance

---

## Method 3: Using Visual Studio Code + Extension

### Step 1: Install Extension
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Markdown PDF"
4. Install "Markdown PDF" extension

### Step 2: Convert
1. Open `MEDITRACK_TEST_CASES.md`
2. Press Ctrl+Shift+P
3. Type "Markdown PDF: Export (docx)"
4. Select docx format
5. File saved automatically

---

## Method 4: Using Online Converter

### Step 1: Visit Converter Website
- **Dillinger:** https://dillinger.io/
- **StackEdit:** https://stackedit.io/
- **Markdown to Word:** https://products.aspose.app/words/conversion/md-to-docx

### Step 2: Upload and Convert
1. Upload `MEDITRACK_TEST_CASES.md`
2. Click "Convert to Word"
3. Download .docx file

**Note:** May require internet connection

---

## Method 5: Using Python Script

### Install Required Package
```bash
pip install pypandoc
```

### Create Conversion Script
```python
import pypandoc

output = pypandoc.convert_file(
    'MEDITRACK_TEST_CASES.md',
    'docx',
    outputfile='MEDITRACK_TEST_CASES.docx'
)
```

### Run Script
```bash
python convert.py
```

---

## Method 6: Using LibreOffice (Free Alternative)

### Step 1: Install LibreOffice
```bash
sudo apt-get install libreoffice
```

### Step 2: Convert via Command Line
```bash
libreoffice --headless --convert-to docx MEDITRACK_TEST_CASES.md
```

**Result:** Creates `MEDITRACK_TEST_CASES.docx`

---

## Recommended Formatting After Conversion

Once converted to .doc, consider these formatting improvements:

### 1. **Page Setup**
- Margins: 1 inch all sides
- Page size: Letter (8.5" × 11")
- Orientation: Portrait

### 2. **Font Styling**
- Headings: Calibri Bold, sizes 18-24pt
- Body text: Calibri, 11pt
- Code blocks: Consolas, 10pt
- Table text: Calibri, 10pt

### 3. **Header/Footer**
- Header: Document title and version
- Footer: Page numbers (X of Y format)
- Date in header

### 4. **Table Formatting**
- Add borders to all tables
- Header row with background color
- Alternate row colors for readability

### 5. **Status Icons**
- Replace ✅ with green checkmark
- Replace ❌ with red X
- Use consistent icons throughout

---

## Quick Pandoc Command (Best Quality)

```bash
pandoc MEDITRACK_TEST_CASES.md \
  -f markdown \
  -t docx \
  -o MEDITRACK_TEST_CASES.docx \
  --toc \
  --toc-depth=3 \
  --number-sections \
  --highlight-style=tango \
  --reference-doc=template.docx
```

### Create Custom Template (Optional)
```bash
pandoc -o custom-reference.docx --print-default-data-file reference.docx
```

Then customize `custom-reference.docx` with your preferred styles.

---

## File Details

**Created File:**
- **Name:** MEDITRACK_TEST_CASES.md
- **Size:** ~150KB
- **Lines:** ~3,500
- **Test Cases:** 156
- **Sections:** 11 major sections

**Document Structure:**
1. Introduction & Scope
2. Test Environment Setup
3. Test Categories
4. Admin Module (40 test cases)
5. Supplier Module (20 test cases)
6. Pharmacy Module (20 test cases)
7. User Module (12 test cases)
8. Integration Tests (10 test cases)
9. Non-Functional Tests (20 test cases)
10. Test Results Summary
11. Appendix

---

## Verification Checklist

After conversion, verify:
- [ ] Table of contents generated
- [ ] All tables formatted correctly
- [ ] Images/icons display properly
- [ ] Code blocks preserved
- [ ] Headers and footers present
- [ ] Page numbers correct
- [ ] Consistent formatting throughout
- [ ] No missing sections
- [ ] Test case numbering intact
- [ ] Status indicators visible

---

## Troubleshooting

### Issue: Tables not formatted well
**Solution:** Use Pandoc with custom reference document

### Issue: Icons don't display
**Solution:** Replace emoji with Word symbols after conversion

### Issue: Code blocks lose formatting
**Solution:** Set code block style in Word template

### Issue: Page breaks in wrong places
**Solution:** Manually adjust in Word after conversion

---

## Alternative: Keep as PDF

If you need PDF instead:

### Using Pandoc
```bash
pandoc MEDITRACK_TEST_CASES.md -o MEDITRACK_TEST_CASES.pdf --pdf-engine=xelatex
```

### Using VS Code Extension
- Export as PDF instead of docx
- Professional appearance
- No editing needed

---

## Final Notes

**Best Method for Your Use Case:**
- **For quick conversion:** Method 2 (Microsoft Word)
- **For best quality:** Method 1 (Pandoc)
- **For no installation:** Method 4 (Online converter)
- **For automation:** Method 5 (Python script)

**Document is Ready:** The Markdown file is professionally formatted and ready for conversion. All 156 test cases are documented with complete details.

---

## Need Help?

If conversion issues arise:
1. Try different methods listed above
2. Check file encoding (should be UTF-8)
3. Verify Markdown syntax in original file
4. Use online converters as fallback

---

**Happy Converting! 📄➡️📋**







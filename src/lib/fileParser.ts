import mammoth from 'mammoth';

export async function extractTextFromFileBuffer(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  try {
    if (extension === 'pdf' || mimeType.includes('pdf')) {
      try {
        const pdfParse = require('pdf-parse');
        const parsed = await pdfParse(buffer);
        if (parsed && parsed.text && parsed.text.trim().length > 20) {
          return parsed.text.trim();
        }
      } catch (pdfErr) {
        // Fallback ASCII text stream extractor
        const rawString = buffer.toString('utf-8');
        const textBlocks = rawString.match(/\(([^)]+)\)/g);
        if (textBlocks && textBlocks.length > 5) {
          const extracted = textBlocks.map(t => t.slice(1, -1)).join(' ').replace(/\s+/g, ' ').trim();
          if (extracted.length > 30) {
            return extracted;
          }
        }
      }
    }

    if (extension === 'docx' || extension === 'doc' || mimeType.includes('word')) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        if (result && result.value && result.value.trim().length > 20) {
          return result.value.trim();
        }
      } catch (docErr) {
        console.warn('[FileParser] mammoth fallback:', docErr);
      }
    }

    if (extension === 'pptx' || extension === 'ppt' || mimeType.includes('presentation')) {
      const str = buffer.toString('utf-8');
      const printable = str.replace(/[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, ' ').replace(/\s+/g, ' ');
      if (printable.length > 50) {
        return printable;
      }
    }

    // Default UTF-8 text fallback
    const rawText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
    if (rawText.length > 0) {
      return rawText;
    }

    return `Extracted material content from ${fileName}.`;
  } catch (err) {
    console.warn(`[FileParser] Falling back to text stream for ${fileName}:`, err);
    return buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
  }
}

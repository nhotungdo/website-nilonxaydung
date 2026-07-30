import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { URL } from 'url';
import { app } from 'electron';

class PdfService {
  constructor() {}

  /**
   * Downloads a PDF file from a remote CDN/S3 URL to local disk cache
   */
  public async downloadPdf(pdfUrl: string, destinationPath: string): Promise<string> {
    console.log(`[PdfService] Initiating PDF download from: ${pdfUrl} to: ${destinationPath}`);
    
    // Ensure parent directory exists
    const parentDir = path.dirname(destinationPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(destinationPath);
      const parsedUrl = new URL(pdfUrl);
      
      const requestModule = parsedUrl.protocol === 'https:' ? https : http;
      
      const request = requestModule.get(pdfUrl, { timeout: 15000 }, (response) => {
        // Handle HTTP redirection
        if (response.statusCode === 301 || response.statusCode === 302) {
          fileStream.close();
          fs.unlinkSync(destinationPath); // clean up partial file
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            console.log(`[PdfService] Following redirect to: ${redirectUrl}`);
            this.downloadPdf(redirectUrl, destinationPath).then(resolve).catch(reject);
          } else {
            reject(new Error(`Failed to follow redirect: Header is empty`));
          }
          return;
        }

        if (response.statusCode !== 200) {
          fileStream.close();
          fs.unlinkSync(destinationPath); // clean up partial file
          reject(new Error(`Failed to download PDF: Server returned code ${response.statusCode}`));
          return;
        }

        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          // Verify downloaded PDF is not empty
          const stats = fs.statSync(destinationPath);
          if (stats.size === 0) {
            fs.unlinkSync(destinationPath);
            reject(new Error('Downloaded PDF file size is 0 bytes.'));
          } else {
            console.log(`[PdfService] Downloaded completed successfully. Size: ${stats.size} bytes`);
            resolve(destinationPath);
          }
        });
      });

      request.on('error', (err) => {
        fileStream.close();
        if (fs.existsSync(destinationPath)) {
          fs.unlinkSync(destinationPath);
        }
        reject(err);
      });

      request.on('timeout', () => {
        request.destroy();
        fileStream.close();
        if (fs.existsSync(destinationPath)) {
          fs.unlinkSync(destinationPath);
        }
        reject(new Error('Connection timed out while downloading PDF invoice (15s).'));
      });
    });
  }

  /**
   * Fallback receipt file generator (copies sample template if offline or no CDN link provided)
   */
  public generateFallbackPdf(orderCode: string, paperSize: 'K58' | 'K80', destinationPath: string): string {
    console.log(`[PdfService] Generating fallback placeholder PDF receipt for Order: ${orderCode} (${paperSize})`);
    
    const parentDir = path.dirname(destinationPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    const isDev = !app.isPackaged;
    const assetsDir = isDev
      ? path.resolve(__dirname, '../../../src/assets')
      : path.join(process.resourcesPath, 'src/assets');

    const sampleName = paperSize === 'K58' ? 'sample-k58.pdf' : 'sample-k80.pdf';
    const samplePath = path.join(assetsDir, 'templates', sampleName);

    if (fs.existsSync(samplePath)) {
      fs.copyFileSync(samplePath, destinationPath);
      console.log(`[PdfService] Fallback template successfully copied: ${samplePath} -> ${destinationPath}`);
      return destinationPath;
    } else {
      // Create empty mock file if template assets are missing
      fs.writeFileSync(destinationPath, `%PDF-1.4 mock pdf for order ${orderCode}`);
      console.warn(`[PdfService] Thermal sample PDF missing at ${samplePath}. Created mock raw file.`);
      return destinationPath;
    }
  }
}

export const pdfService = new PdfService();
export default pdfService;

import { PDFDocument, StandardFonts } from 'pdf-lib';

export async function makeResumePdf(options: { pages?: number; compressed?: boolean; blank?: boolean } = {}) {
  const document = await PDFDocument.create();
  const font = await document.embedFont(StandardFonts.Helvetica);
  for (let index = 0; index < (options.pages ?? 1); index++) {
    const page = document.addPage();
    if (!options.blank) {
      page.drawText([
        `Test Candidate - Resume page ${index + 1}`,
        'Education: Bachelor of Computer Science, 2024.',
        'Skills: JavaScript, TypeScript, React, Node.js, SQL, Git.',
        'Experience: Software engineering internship, June to August 2024.',
        'Built and tested REST APIs with authentication and input validation.',
        'Projects: Developed a sales dashboard using React and PostgreSQL.',
        'Added automated tests and reduced report generation time by 30 percent.',
        'Documented setup instructions and collaborated using Git code reviews.',
      ].join('\n'), { x: 40, y: 760, size: 11, font, lineHeight: 22 });
    }
  }
  return Buffer.from(await document.save({ useObjectStreams: options.compressed ?? true }));
}

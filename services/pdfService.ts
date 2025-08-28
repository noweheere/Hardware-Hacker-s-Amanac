import { ProjectData } from '../types';

// Declare the global libraries injected by the script tags
declare const jspdf: any;
declare const html2canvas: any;

function renderSection(title: string, content: string | string[] | { title: string; url: string; description: string }[] | { name: string; url: string }[]): string {
    let contentHtml = '';

    if (Array.isArray(content)) {
        if (content.length === 0) {
            contentHtml = '<p>N/A</p>';
        } else if (typeof content[0] === 'string') {
            contentHtml = `<ul>${content.map(item => `<li>${item}</li>`).join('')}</ul>`;
        } else if ('title' in content[0]) { // HackingResource / ToolResource
             contentHtml = (content as { title: string; url: string; description: string }[]).map(item => `
                <div class="item">
                    <p><strong>${item.title || (item as any).name}</strong></p>
                    <p class="description">${item.description}</p>
                    <p class="url">URL: <a href="${item.url}">${item.url}</a></p>
                </div>
            `).join('');
        } else { // CommunityResource
            contentHtml = `<ul>${(content as { name: string; url: string }[]).map(item => `
                <li><strong>${item.name}</strong> - <a href="${item.url}">${item.url}</a></li>
            `).join('')}</ul>`;
        }
    } else {
        contentHtml = `<p>${content || 'N/A'}</p>`;
    }

    return `
        <div class="section">
            <h2>${title}</h2>
            ${contentHtml}
        </div>
    `;
}

export const generatePdf = async (projectData: ProjectData): Promise<void> => {
    const { result, notes, sourceImage } = projectData;
    const { jsPDF } = jspdf;
    
    // Create a hidden element to render the report for PDF generation
    const reportElement = document.createElement('div');
    reportElement.id = 'pdf-report';
    reportElement.style.position = 'absolute';
    reportElement.style.left = '-9999px';
    reportElement.style.width = '1000px';
    reportElement.style.padding = '40px';
    reportElement.style.background = 'white';
    reportElement.style.fontFamily = 'Helvetica, Arial, sans-serif';
    reportElement.style.color = 'black';
    reportElement.style.fontSize = '12px';

    reportElement.innerHTML = `
        <style>
            #pdf-report { line-height: 1.6; }
            #pdf-report h1 { font-size: 28px; color: #003366; border-bottom: 2px solid #003366; padding-bottom: 10px; margin-bottom: 20px; }
            #pdf-report h2 { font-size: 20px; color: #0055a4; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 25px; margin-bottom: 15px; }
            #pdf-report .section { margin-bottom: 20px; }
            #pdf-report ul { list-style-position: inside; padding-left: 10px; }
            #pdf-report li { margin-bottom: 5px; }
            #pdf-report a { color: #0066cc; text-decoration: none; }
            #pdf-report .item { margin-bottom: 15px; padding-left: 10px; border-left: 3px solid #eee; }
            #pdf-report .description { margin: 5px 0; }
            #pdf-report .url { font-size: 11px; color: #555; }
            #pdf-report .source-image { max-width: 400px; max-height: 400px; margin: 20px auto; display: block; border: 1px solid #ddd; padding: 5px; border-radius: 4px; }
            #pdf-report .notes-section { background-color: #f9f9f9; border: 1px solid #ddd; padding: 15px; border-radius: 5px; white-space: pre-wrap; font-family: 'Courier New', Courier, monospace; }
        </style>

        <h1>Hardware Analysis Report</h1>
        
        <div class="section">
            <h1>${result.componentName}</h1>
            <p>${result.description}</p>
        </div>

        ${sourceImage ? `<img src="data:${sourceImage.mimeType};base64,${sourceImage.base64}" alt="Analysis Source Image" class="source-image" />` : ''}

        ${renderSection('Specifications', result.specifications)}
        ${renderSection('Datasheet', result.datasheetUrl ? `<a href="${result.datasheetUrl}">${result.datasheetUrl}</a>` : 'N/A')}
        ${renderSection('Hacking Tutorials & Guides', result.tutorials)}
        ${renderSection('Tools & Software', result.tools)}
        ${renderSection('Communities', result.communities)}
        
        <div class="section">
            <h2>Project Notes</h2>
            <div class="notes-section">${notes || 'No notes provided.'}</div>
        </div>
    `;

    document.body.appendChild(reportElement);

    try {
        const canvas = await html2canvas(reportElement, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgHeight / imgWidth;
        const finalImgHeight = pdfWidth * ratio;

        let heightLeft = finalImgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, finalImgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position = heightLeft - finalImgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, finalImgHeight);
            heightLeft -= pdfHeight;
        }
        
        pdf.save(`hardware-analysis-${result.componentName.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Failed to generate PDF. See console for details.");
    } finally {
        // Clean up the temporary element
        document.body.removeChild(reportElement);
    }
};

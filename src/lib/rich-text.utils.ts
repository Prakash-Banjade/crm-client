const emptyNodes = [
    `<p class="leading-6"><br></p>`,
    `<p class="leading-7"><br></p>`,
    `<p class="leading-7" style="text-align: start;"><br></p>`,
    `<p class="leading-6" style="text-align: start;"><br></p>`,
    `<p><br></p>`,
    `<p></p>`,
]

/**
 * Checks if the HTML is empty
 */
export default function isEmptyHTML(html: string) {
    return emptyNodes.includes(html?.trim()) || !html;
}

/**
 * @param html - The HTML string to count the plain characters from
 * @returns The number of plain characters in the HTML
 */
export function countPlainCharsFromHtml(html: string): number {
    const container = document.createElement('div');
    container.innerHTML = html;
    return container.textContent?.length ?? 0;
}

export function setDomHiddenUntilFound(dom: HTMLElement): void {
  (dom as any).hidden = "until-found";
}

export function domOnBeforeMatch(dom: HTMLElement, callback: () => void): void {
  (dom as any).onbeforematch = callback;
}

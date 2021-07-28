function elementHasAncestor(
  element: HTMLElement,
  predicate: (element: HTMLElement) => boolean,
) {
  const parent = element.parentElement;
  if (!parent) {
    return false;
  }

  if (predicate(parent)) {
    return true;
  } else {
    return elementHasAncestor(parent, predicate);
  }
}

function isElementOutside(
  element: HTMLElement,
  ...targets: Array<HTMLElement>
) {
  const isOneOfTheTargets = targets.some((target) => element === target);
  const isInsideOfSomeTarget = elementHasAncestor(element, (ancestor) =>
    targets.some((target) => ancestor === target),
  );
  const isNotOutside = isOneOfTheTargets || isInsideOfSomeTarget;
  return !isNotOutside;
}

export { isElementOutside };

// Linear interpolation - https://en.wikipedia.org/wiki/Linear_interpolation
function lerp(valueA, valueB, percentage) {
    return valueA + (valueB - valueA) * percentage;
}

function getIntersection(valueA, valueB, valueC, valueD) {
    const tTop =
        (valueD.x - valueC.x) * (valueA.y - valueC.y) -
        (valueD.y - valueC.y) * (valueA.x - valueC.x);
    const uTop =
        (valueC.y - valueA.y) * (valueA.x - valueB.x) -
        (valueC.x - valueA.x) * (valueA.y - valueB.y);
    const bottom =
        (valueD.y - valueC.y) * (valueB.x - valueA.x) -
        (valueD.x - valueC.x) * (valueB.y - valueA.y);

    if (bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(valueA.x, valueB.x, t),
                y: lerp(valueA.y, valueB.y, t),
                offset: t,
            };
        }
    }

    return null;
}

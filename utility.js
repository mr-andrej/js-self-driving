// Linear interpolation - https://en.wikipedia.org/wiki/Linear_interpolation
function lerp(valueA, valueB, percentage) {
    return valueA + (valueB - valueA) * percentage;
}

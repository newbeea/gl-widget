declare var ShapeUtils: {
    area: (contour: any) => number;
    isClockWise: (pts: any) => boolean;
    triangulateShape: (contour: any, holes: any) => any;
};
export { ShapeUtils };

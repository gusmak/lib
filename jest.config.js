module.exports = {
    // ...
    transform: {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.svg$": "<rootDir>/svgTransform.js",
    }
}
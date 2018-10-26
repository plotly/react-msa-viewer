module.exports = {
    "presets": [
        ["@babel/preset-env", {"modules": "commonjs"}],
        "@babel/preset-react",
    ],
    "plugins": [
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-proposal-class-properties",
    ],
    "env": {
        "test": {
            "presets": [
                ["@babel/preset-env", {"modules": "commonjs"}],
                "@babel/preset-react",
            ],
            plugins: [
                "transform-es2015-modules-commonjs",
                "dynamic-import-node"
            ]
        }
    }
}

console.log('PROOOXY')

const PROXY_CONFIG = {
    "/": {
        target: "localhost:5001",
        secure: false,
        changeOrigin: true,
        logLeveL: "debug"
    }
}

module.exports = PROXY_CONFIG
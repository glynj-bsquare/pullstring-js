var Features = {
    StreamingAsr: 0,
};

class VersionInfo {
    static hasFeature(feature) {
        switch (feature) {
        case Features.StreamingAsr:
        default:
            return false;
        }
    }
}

Object.defineProperty(VersionInfo, 'ApiBaseUrl', {
    value: 'https://conversation.pullstring.ai/v1/',
    writable: false,
    enumerable: true,
    configurable: false,
});

VersionInfo.Features = Features;

module.exports = { VersionInfo };

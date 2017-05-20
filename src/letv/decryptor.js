class Decryptor {

    static _decodeB2T(bytes) {
        let version =  String.fromCharCode.apply(String, bytes.subarray(0, 5)).toLowerCase();
        return version === 'vc_01' ? this._decodeBytesV1(bytes) : this._decodeBytes(bytes);
    }

    static _decodeBytes(bytes) {
        return String.fromCharCode.apply(String, bytes);
    }

    static _decodeBytesV1(bytes) {
        bytes = bytes.subarray(5);
        let buf = new ArrayBuffer((bytes.length << 1) + 11);
        let dv1 = new Uint8Array(buf, 11);

        for (let i = 0; i < bytes.length; i++) {
            dv1[i << 1] = bytes[i] >>> 4;
            dv1[(i << 1) + 1] = bytes[i] & 0x0f;
        }

        let dv2 = new Uint8Array(buf, 0, buf.byteLength - 11);
        dv2.set(dv1.subarray(dv1.length - 11));

        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = (dv2[i << 1] << 4) | dv2[(i << 1) + 1];
        }

        const MAX_CHUNK = 1024;
        let str = '';
        let ptr = 0;
        while (ptr < bytes.length) {
            let end = Math.min(ptr + MAX_CHUNK, bytes.length);
            str += String.fromCharCode.apply(String, bytes.subarray(ptr, end));
            ptr = end;
        }

        return str;
    }

    static decryptM3u8(buf) {
        let bytes = new Uint8Array(buf);
        let m3u8 = this._decodeB2T(bytes);
        return m3u8;
    }

}

export default Decryptor;

import XhrLoader from '../utils/xhr-loader';
import Decryptor from './decryptor';

class PXhrLoader extends XhrLoader {

    constructor(...args) {
        super(...args);
    }

    load(context, config, callbacks) {
        context.responseType = 'arraybuffer';
        const onSuccess = callbacks.onSuccess;

        callbacks.onSuccess = function(response, stats, context) {
            response.data = Decryptor.decryptM3u8(response.data);
            onSuccess(response, stats, context);
        };

        super.load(context, config, callbacks);
    }


}

export default PXhrLoader;

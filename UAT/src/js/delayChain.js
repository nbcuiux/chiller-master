



class DelayChain {

    constructor() {
        this.timeout = null;
    }

    delay(ms) {
        var self = this;
        window.clearTimeout(self.timeout);
        return new Promise(function(resolve, reject) {
            // Reject timeout makes sure the promise gets rejected
            // if the delayChain is cancelled
            var rejectTimeout = window.setTimeout(function() {
                reject();
            }, ms + 100);

            self.timeout = window.setTimeout(function() {
                window.clearTimeout(rejectTimeout);
                resolve();
            }, ms);
        });
    }

    cancel() {
        // Only clear the main timeout so the reject timeout fires
        window.clearTimeout(this.timeout);
    }
}


export default DelayChain


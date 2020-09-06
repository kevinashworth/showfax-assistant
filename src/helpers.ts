import log from 'loglevel';

export const onError = (error, sender?: any) => {
  // swallow this startup error
  if (sender === 'sendMessageToTabs' && error.message === 'Could not establish connection. Receiving end does not exist.') {
    return
  }
  if (sender) {
    log.error('onError from', sender)
  } else {
    log.error('onError:');
  }
  log.error(JSON.stringify(error, null, 2));
};

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

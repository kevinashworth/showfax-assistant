import log from 'loglevel';

export const onStart = () => {
  console.group('Showfax Assistant');
}

export const onStop = () => {
  console.groupEnd();
}

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
  log.error(error);
};

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// returns 2 decimal places
export const mySubtract = (a: number, b: number): number => {
  return Math.round((a - b + Number.EPSILON) * 100) / 100
}

export const bold = (msg): void => {
  return log.debug(`%c${msg}`, 'font-weight: bold;');
}
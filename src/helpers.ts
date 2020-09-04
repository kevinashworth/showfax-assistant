export const onError = (error) => {
  console.log('onError:');
  console.error(JSON.stringify(error, null, 2));
};

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

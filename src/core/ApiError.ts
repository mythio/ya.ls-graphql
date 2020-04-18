export default class CustErr extends Error {
  constructor(message: string) {
    super(message);

    this.name = "PJSAD";
  };
};
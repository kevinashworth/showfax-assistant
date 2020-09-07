export interface State {
  firstPass?: boolean,
  secondPass?: boolean
}

export interface Message {
  type: string,
  state?: Partial<State>,
  greeting?: string
}

